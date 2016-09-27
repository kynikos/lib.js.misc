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


if not GM_xmlhttpRequest?
    window.GM_xmlhttpRequest = ->
        # This function emulates GM_xmlhttpRequest only partially
        # Notably cross-origin requests are not supported
        #
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
        #
        #     // Not yet implemented
        #     //binary: ,
        #     //mozBackgroundRequest: ,
        #     //overrideMimeType: ,
        #     //ignoreCache: ,
        #     //ignoreRedirect: ,
        #     //ignoreTempRedirect: ,
        #     //ignorePermanentRedirect: ,
        #     //failOnRedirect: ,
        #     //redirectionLimit: ,
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

        for header of params.headers
            req.setRequestHeader(header, params.headers[header])

        req.onreadystatechange = ->
            response =
                responseText: req.responseText
                readyState: req.readyState
                responseHeaders: req.getAllResponseHeaders()
                status: req.status
                statusText: req.statusText
                # Not yet implemented
                #finalUrl: ,

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
