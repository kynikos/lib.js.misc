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


module.exports.geoMapHref = geoMapHref = (link) ->
    coords = link.getAttribute('data-geomap-coordinates') or "0,0"
    query = link.getAttribute('data-geomap-query') or ""
    if window.navigator.platform.match(/iPad|iPhone|iPod/i) is null
        link.setAttribute('href', "geo:#{coords}?q=#{query || coords}")
    else
        # TODO: The "geo:" URI scheme doesn't work on Safari yet
        # Yes, apparently putting the coordinates in place
        # of 0,0 doesn't work...
        link.setAttribute('href', "maps:0,0?q=#{query || coords}")
    return link


module.exports.extjQuery = ($) ->
    $.fn.geoMapHref = ->
        @each( -> $(geoMapHref(this)))
