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

WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
module.exports.WEEKDAYS_SHORT = WEEKDAYS_SHORT

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
