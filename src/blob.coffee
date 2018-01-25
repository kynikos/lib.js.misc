# lib.cs.misc - Check the status of code repositories under a root directory.
# Copyright (C) 2016 Dario Giovannetti <dev@dariogiovannetti.net>
#
# This file is part of lib.cs.misc.
#
# lib.cs.misc is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# lib.cs.misc is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with lib.cs.misc.  If not, see <http://www.gnu.org/licenses/>.


module.exports.extjQuery = ($) ->
    $.fn.exportToFile = (filename, text) ->
        @each( ->
            blob = new Blob([text], {type:'text/plain'})
            $(this)
                .attr("href", window.URL.createObjectURL(blob))
                .attr('download', filename)
                # This is supposed to be called from a click event, so don't run
                # .get(0).click() here
            return $(this)
        )


# http://stackoverflow.com/a/5100158
module.exports.dataURItoBlob = (dataURI) ->
    # convert base64/URLEncoded data component to raw binary data held in a
    # string
    byteString
    if dataURI.split(',')[0].indexOf('base64') >= 0
        byteString = atob(dataURI.split(',')[1])
    else
        byteString = unescape(dataURI.split(',')[1])

    # separate out the mime component
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    # write the bytes of the string to a typed array
    ia = new Uint8Array(byteString.length)
    for i in [0..byteString.length]
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], {type: mimeString})


# http://stackoverflow.com/a/30407840
module.exports.dataURLtoBlob = (dataurl) ->
    arr = dataurl.split(',')
    mime = arr[0].match(/:(.*?);/)[1]
    bstr = atob(arr[1])
    n = bstr.length
    u8arr = new Uint8Array(n)
    while n--
        u8arr[n] = bstr.charCodeAt(n)
    return new Blob([u8arr], {type: mime})
