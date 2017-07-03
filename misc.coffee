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
require("jquery-ui-browserify")
# BUG: bootstrap-datepicker may conflict with jquery-ui's datepicker
# require('bootstrap-datepicker')

WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
module.exports.WEEKDAYS_SHORT = WEEKDAYS_SHORT

WEEKDAYS_SHORT_SU = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
module.exports.WEEKDAYS_SHORT_SU = WEEKDAYS_SHORT_SU

module.exports.MONTHS_LONG = ['January', 'February', 'March', 'April', 'May',
                              'June', 'July', 'August', 'September', 'October',
                              'November', 'December']


format_multiplication = (factor1, factor2, decimals) ->
    return (factor1 * factor2).toFixed(decimals)
module.exports.format_multiplication = format_multiplication


module.exports.rounded_multiplication = (factor1, factor2, decimals) ->
    return parseFloat(format_multiplication(factor1, factor2, decimals))


format_division = (dividend, divisor, decimals) ->
    return (dividend / divisor).toFixed(decimals)
module.exports.format_division = format_division


module.exports.rounded_division = (dividend, divisor, decimals) ->
    return parseFloat(format_division(dividend, divisor, decimals))


module.exports.format_money = (value) ->
    # http://stackoverflow.com/a/14428340
    return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')


# Open links in the same window when using "apple-mobile-web-app-capable"
$.fn.standaloneAppLinks = ->
    @each( ->
        $(this).find('a').each( ->
            href = $(this).attr('href')
            if href isnt '' and href[0] isnt '#'
                $(this).on('click', (event) ->
                    event.preventDefault()
                    window.location.href = $(event.currentTarget).attr('href')
                    return false
                )
        )
        return $(this)
    )


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


module.exports.getQueryParameters = ->
    params = {}
    query = window.location.search.substring(1)
    for pair in query.split('&')
        [name, value...] = pair.split("=")
        params[name] = value.join('=')
    return params


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


class module.exports.DatePicker
    constructor: ->
        @display = $('<input>')
            .attr(
                'type': 'text'
                'readonly': 'true'
                'size': 30
                'placeholder': 'Select a date'
            )
            .addClass('datepicker-display')
            .click( =>
                @input.datepicker('show')
            )
        @input = $('<input>')
            .attr('type', 'hidden')
            .datepicker(
                dateFormat: 'yy-mm-dd'
                altField: @display
                altFormat: "DD, d MM yy"
                firstDay: 1
            )

    show: ->
        @input.datepicker('show')

    hide: ->
        @input.datepicker('hide')

    set_date: (date) ->
        if typeof date is 'string'
            date = $.datepicker.parseDate('yy-mm-dd', date)
        @input.datepicker("setDate", date)

    get_date: ->
        return @input.val()

    enable: ->
        @display.removeAttr('disabled')

    disable: ->
        @input.datepicker("setDate", null)
        @display.attr('disabled', 'true')


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
            return widget[args[0]](args[1...]...)
        config = args[0] ? {}
        dpconfig = args[1] ? {}
        widget  = new BootstrapDatePickerAltDisplay(config, dpconfig)
        return $(this)
            .data('widget', widget)
            # Append the picker before the display, so that the popup appears
            # on the left
            .append(widget.picker, widget.display)
    )


class module.exports.WeekDaySelector
    constructor:  (selected_days, baseid, radio=false) ->
        @container = $('<span>').addClass('weekdayselector')
        for wday, index in WEEKDAYS_SHORT
            id = "#{baseid}-#{index}"
            name = "#{baseid}"
            input = $('<input>')
                .attr(
                    'type': if radio then 'radio' else 'checkbox'
                    'name': name
                    'id': id
                )
                .val(index)
                .appendTo(@container)

            if selected_days.indexOf(index) > -1
                input.prop("checked", true)

            $('<label>')
                .attr('for', id)
                .text(wday)
                .appendTo(@container)

    get_days: ->
        days = []
        for input in @container.children('input')
            if input.checked
                days.push(input.value)
        return days
