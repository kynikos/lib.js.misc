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

if not $? and not jQuery?
    window.$ = window.jQuery = require('jquery')


class module.exports.TableOfContents
    constructor: ->
        # TODO: This class won't work well if a document's first heading after
        #       the #table-of-contents is e.g. a <h3> and then there are <h2>
        #       elements further down; in other words, the first header element
        #       after #table-of-contents must be the lowest header level that
        #       should be in the table of contents
        @rootul = $('<ul>')
        @refresh()
        $('#table-of-contents').after(@rootul)

    refresh: ->
        @rootul.empty()

        tocheaderfound = false
        currul = @rootul
        currhlevel = 0

        $(':header').each( ->
            header = $(this)
            if tocheaderfound
                header.addClass('toc-heading')

                hlevel = header.prop('tagName')[1..]
                if currul.children().length > 0 and hlevel > currhlevel
                    currul = $('<ul>').appendTo(currul)
                else if hlevel < currhlevel
                    for N in [0...(currhlevel - hlevel)]
                        currul = currul.parent()
                currhlevel = hlevel

                link = $('<a>')
                    .attr('href', '#' + header.attr('id'))
                    .text(header.text())

                $('<li>')
                    .append(link)
                    .appendTo(currul)

            else if header.attr('id') == 'table-of-contents'
                tocheaderfound = true
        )


class EnhancedHeading
    constructor: (@section) ->
        header = @section.find(':header').first()
        header.wrap(
            $('<div>')
                .addClass('section-start')
                .mouseenter(show_actions)
                .mouseleave(hide_actions)
        )
        header
            .css('display', 'inline-block')
            .after(
                $('<span>')
                    .addClass('actions')
                    .append(
                        $('<a>')
                            .css('margin-left', '4px')
                            .attr('href', '#' + header.attr('id'))
                            .text('¶')
                    )
                    .append(
                        $('<a>')
                            .css('margin-left', '4px')
                            .attr('href', '#')
                            .text('top')
                    )
                    .append(
                        $('<a>')
                            .css('margin-left', '4px')
                            .attr('href', '#')
                            .text('collapse')
                            .click(collapse_section)
                    )
                    .hide()
            )

    show_actions = (event) ->
        $(this).children('span.actions').show()

    hide_actions = (event) ->
        $(this).children('span.actions').hide()

    collapse_section = (event) ->
        $(this).closest('div.section-start').nextAll().hide()
        $(this)
            .text('expand')
            .off('click', collapse_section)
            .on('click', expand_section)
        return false

    expand_section = (event) ->
        $(this).closest('div.section-start').nextAll().show()
        $(this)
            .text('collapse')
            .off('click', expand_section)
            .on('click', collapse_section)
        return false


$.fn.enhanceHeading = ->
    @each( ->
        new EnhancedHeading($(this))
        return $(this)
    )
