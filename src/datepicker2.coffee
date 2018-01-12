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
require("jquery-ui-browserify")


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
