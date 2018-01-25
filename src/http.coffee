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


module.exports.getUrlLocation = (url) ->
    link = document.createElement('a')
    link.href = url
    return link


module.exports.getURIParameters = (uri) ->
    if uri
        qstring = module.exports.getUrlLocation(uri).search
    else
        qstring = location.search

    qarray = qstring.substr(1).split('&')
    qdict = new Object()
    s = new Array()

    for par in qarray
        s = par.split('=')
        qdict[s[0]] = s[1]

    return qdict


module.exports.getURIParameter = (uri, name) ->
    return module.exports.getURIParameters(uri)[name]


module.exports.getQueryParameters = ->
    params = {}
    query = window.location.search.substring(1)
    for pair in query.split('&')
        [name, value...] = pair.split("=")
        params[name] = value.join('=')
    return params


module.exports.sendGetAsyncRequest = (url, call) ->
    req = new XMLHttpRequest()
    req.onreadystatechange = ->
        if req.readyState == 4 and req.status == 200
            call(req)
    req.open("GET", url, true)
    req.send()


module.exports.sendGetSyncRequest = (url) ->
    req = new XMLHttpRequest()
    req.open("GET", url, false)
    req.send()
    return req


module.exports.sendPostAsyncRequest = (url, call, query, header, headervalue) ->
    req = new XMLHttpRequest()
    req.onreadystatechange = ->
        if req.readyState == 4 and req.status == 200
            call(req)
    req.open("POST", url, true)
    if header and headervalue
        req.setRequestHeader(header, headervalue)
    req.send(query)


module.exports.sendPostSyncRequest = (url, query, header, headervalue) ->
    req = new XMLHttpRequest()
    req.open("POST", url, false)
    if header and headervalue
        req.setRequestHeader(header, headervalue)
    req.send(query)
    return req
