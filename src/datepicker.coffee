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
if not $().modal? and not jQuery().modal?
    require('bootstrap')
if not $().datepicker? and not jQuery().datepicker
    require('bootstrap-datepicker')


class BootstrapDatePickerAltDisplay
    constructor: (config={}, dpconfig={}) ->
        config.format_date ?= (widget) =>
            return widget.get_date()

        @picker = $('<input>')
            # Simply setting it as type="hidden" would show the popup in the
            # top-left corner of the screen
            .css(
                width: 0
                height: 0
                margin: 0
                padding: 0
                border: 'none'
            )
            .datepicker(dpconfig)
            .change( =>
                @display.val(config.format_date(this))
            )

        @display = $('<input>')
            .attr(
                'type': 'text'
                # TODO: Support readonly=false, but the user should provide a
                #       should be a reverse format_date function (parse_date)
                'readonly': config.readonly ? true
                'placeholder': config.placeholder ? 'Select a date'
            )
            .addClass('datepicker-display')
            .click( =>
                @picker.datepicker('show')
            )

        if config.name?
            @picker.attr('name', config.name)

        if config.size?
            @display.attr('size', config.size)

        if config.class?
            @display.addClass(config.class)

        # This block triggers 'change' on the picker, execute after configuring
        # everything
        if config.initial_value?
            @set_date(config.initial_value)
            @picker.trigger('change')

    get_date: ->
        return @picker.datepicker('getDate')

    set_date: (date) ->
        if typeof date is 'string'
            date = new Date(date)
        return @picker.datepicker('setDate', date)


$.fn.bootstrapDatepickerAltDisplay = (args...) ->
    @each( ->
        if typeof args[0] is 'string'
            widget = $(this).data('widget')
            # BUG: This is broken because the main
            #      bootstrapDatepickerAltDisplay method returns @each
            return widget.picker.datepicker(args...)
        config = args[0] ? {}
        dpconfig = args[1] ? {}
        widget  = new BootstrapDatePickerAltDisplay(config, dpconfig)
        return $(this)
            .data('widget', widget)
            # Append the picker before the display, so that the popup appears
            # on the left
            .append(widget.picker, widget.display)
    )
