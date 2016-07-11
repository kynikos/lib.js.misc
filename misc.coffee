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

$ = require('jquery')


$.fn.appendText = (text) ->
    @each( ->
        $(this).append(document.createTextNode(text))
        return $(this)
    )


$.fn.exportToFile = (filename, text) ->
    @each( ->
        blob = new Blob([text], {type:'text/plain'})
        $(this)
            .attr("href", window.URL.createObjectURL(blob))
            .attr('download', filename)
            # Don't just use $(this).click(), or the click event on the
            # 'a' element will be called over in an infinite loop
            [0].click()
        return $(this)
    )
