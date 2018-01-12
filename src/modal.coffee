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

# BUG: For some reason requiring jquery here gives an error...
# if not $? and not jQuery?
#     window.$ = window.jQuery = require('jquery')


class module.exports.Modal
    constructor: (header, content) ->
        @closespan = $('<span class="close">')
            .html("&times;")
            .click(@close)

        @main = $('<div class="modal-root">')
            # This will make fadeIn() use display:flex instead of
            # display:block
            .css("display", "flex")
            .hide()
            .append($('<div class="modal-window">')
                .append(
                    @closespan,
                    $('<div class="header">').append(header),
                    # Ensure that the content is never too big for the viewport
                    # Possibly give it max-width/height using vw/vh units
                    $('<div class="content">').append(content),
                ))
            .appendTo('body')
            .fadeIn()

        externalclick = (event) =>
            if event.target == @main[0]
                @close()
                $(window).off('click', externalclick)

        $(window).on('click', externalclick)

    close: =>
        @main.fadeOut( =>
            @main.remove()
        )
