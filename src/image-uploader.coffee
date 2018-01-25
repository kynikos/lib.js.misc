# JavaScript auxiliary library
# Copyright (C) 2012 Dario Giovannetti <dev@dariogiovannetti.net>
#
# This file is part of JavaScript auxiliary library.
#
# JavaScript auxiliary library is free software: you can redistribute it
# and/or modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation, either version 3
# of the License, or (at your option) any later version.
#
# JavaScript auxiliary library is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with JavaScript auxiliary library.
# If not, see <http://www.gnu.org/licenses/>.


class module.exports.ImageUploader
    constructor: ->
        @total = 0
        @counter = 0
        @config =
            'fileChooser': null  # Must be overridden
            'uploadButton': null  # Must be overridden
            'statusMessage': null  # Must be overridden
            'statusList': null  # Must be overridden
            'callBack': ->
            'copies': [
                {
                    'processUrl': null  # Must be overridden
                    'destPath': './'  # Automatically normalized with a trailing slash
                    'prefix': ''
                    'type': 'image/png'
                    'mode': 'deform'
                    'width': 200
                    'height': 200
                }
            ]

    httpRequest: (params) ->
        # params = {
        #     method: ,
        #     url: ,
        #     data: ,
        #     headers: ,
        #     user: ,
        #     password: ,
        #     onload: ,
        #     onerror: ,
        #     onreadystatechange: ,
        # }

        if not params.method? then params.method = "GET"
        if not params.data? then params.data = null
        if not params.headers? then params.headers = {}
        if not params.user? then params.user = null
        if not params.password? then params.password = null
        if not params.onload? then params.onload = (req) ->
        if not params.onerror? then params.onerror = (req) ->
        if not params.onreadystatechange? then params.onreadystatechange = (req) ->
        params.async = true

        req = new XMLHttpRequest()

        req.open(params.method, params.url, params.async, params.user, params.password)

        for header in params.headers
            req.setRequestHeader(header, params.headers[header])

        # TODO:
        #   http://www.matlus.com/html5-file-upload-with-progress/
        #   http://html5doctor.com/the-progress-element/
        #   http://www.geekthis.net/blog/38/html5-uploading-with-progress-bar
        req.upload.onprogress = (e) ->
            if e.lengthComputable
                percentComplete = (e.loaded / e.total) * 100
                # TODO: log
                #console.log(percentComplete + '% uploaded')

        req.onreadystatechange = ->
            response =
                responseText: req.responseText
                readyState: req.readyState
                responseHeaders: req.getAllResponseHeaders()
                status: req.status
                statusText: req.statusText

            try
                response.responseJSON = JSON.parse(req.responseText)
            catch err
                response.responseJSON = undefined

            params.onreadystatechange(response)

            if req.readyState == 4
                if req.status == 200
                    params.onload(response)
                else
                    params.onerror(response)

        req.send(params.data)

        return {
            abort: ->
                req.abort()
        }

    requestPost: (params, blobs, url, call, callArgs) ->
        query =
            method: "POST"
            url: url
            onload: (res) ->
                call(res, callArgs)
            onerror: (res) ->
                if confirm("Failed query (" + res.finalUrl + ")\n\nDo you want to retry?")
                    @requestPost(params, url, call, callArgs)

        query.data = new FormData()
        for p in params
            query.data.append(p, params[p])
        for blob in blobs
            query.data.append(blob[0], blob[1], blob[2])
        # Do not add "multipart/form-data" explicitly or the query will fail
        #query.headers = {"Content-type": "multipart/form-data"}

        try
            @httpRequest(query)
        catch err
            alert("Failed HTTP request: " + err)

    dataURLtoBlob: (cId, dataURL) ->
        # Thanks to http://mitgux.com/send-canvas-to-server-as-file-using-ajax

        binary = atob(dataURL.split(',')[1])

        # Create 8-bit unsigned array
        array = []
        for i in [0...binary.length]
          array.push(binary.charCodeAt(i))

        return new Blob([new Uint8Array(array)], {type: @config.copies[cId].type})

    processImage: (iId, cId, canvas, name, image) ->
        ctx = canvas.getContext("2d")

        imageObj = new Image()
        imageObj.onload = ->
            @resizeImage(cId, this, canvas, ctx)
            modImage = @dataURLtoBlob(cId, canvas.toDataURL(@config.copies[cId].type))
            @uploadImage(iId, cId, name, modImage)

        reader = new FileReader()
        reader.onload = (e) ->
            imageObj.src = e.target.result

        reader.readAsDataURL(image)

    resizeImage: (cId, img, canvas, ctx) ->
        ratio = img.width / img.height

        cfgWidth = @config.copies[cId].width
        cfgHeight = @config.copies[cId].height

        if cfgWidth and cfgHeight
            newWidth = cfgWidth
            newHeight = cfgHeight

            if @config.copies[cId].mode == 'outside'
                newHeight = cfgWidth / ratio
                if newHeight < cfgHeight
                    newHeight = cfgHeight
                    newWidth = cfgHeight * ratio
            else if @config.copies[cId].mode == 'inside'
                newHeight = cfgWidth / ratio
                if newHeight > cfgHeight
                    newHeight = cfgHeight
                    newWidth = cfgHeight * ratio

        else if cfgWidth and not cfgHeight
            newWidth = cfgWidth
            newHeight = cfgWidth / ratio

        else if not cfgWidth and cfgHeight
            newWidth = cfgHeight * ratio
            newHeight = cfgHeight

        else
            newWidth = img.width
            newHeight = img.height

        canvas.width = newWidth
        canvas.height = newHeight
        ctx.drawImage(img, 0, 0, newWidth, newHeight)

    uploadImage: (iId, cId, name, blob) ->
        destPath = @config.copies[cId].destPath
        if destPath != '' and destPath.substr(-1) != '/'
            destPath += '/'

        fName = @config.copies[cId].prefix + name

        blobs = [
            ['image', blob, fName],
        ]
        url = @config.copies[cId].processUrl
        call = (res, args) ->
            @updateStatus(iId, cId, res)
            if @counter == @total
                @config.callBack()

        @requestPost({'destPath': destPath}, blobs, url, call, [])

    updateStatus: (iId, cId, res) ->
        # @counter and @total are defined outside of this function
        @counter++
        @config.statusMessage.innerHTML = (@counter * 100 / @total).toFixed(0) + " %"
        @config.statusList.getElementsByTagName('li')[iId].innerHTML += '<br>' + res.responseText

    configure: (cfg) ->
        # cfg can be incomplete, thus using the default values in @config
        for c in cfg
            @config[c] = cfg[c]

    initStatus: ->
        # Reset file list
        @config.statusList.innerHTML = ''

        # Make sure the controls are enabled, as for example Firefox doesn't
        # re-enable them if the page is refreshed simply (not using Shift)
        @config.uploadButton.disabled = false
        @config.fileChooser.disabled = false

        files = @config.fileChooser.files

        for image in files
            imageItem = document.createElement('li')
            imageItem.innerHTML = image.name + ' (' + image.type + ')'
            @config.statusList.appendChild(imageItem)

    main: ->
        # Make sure the file list is up to date
        @initStatus()

        # At the moment the page needs to be refreshed before doing another
        # upload, so leave the form disabled
        @config.uploadButton.disabled = true
        @config.fileChooser.disabled = true

        @config.statusMessage.innerHTML = "0 %"

        canvas = document.createElement('canvas')
        files = @config.fileChooser.files

        # @total is defined outside of this function
        @total = files.length * @config.copies.length;

        for i in [0...files.length]
            image = files[i]
            for c in [0...@config.copies.length]
                @processImage(i, c, canvas, image.name, image)
