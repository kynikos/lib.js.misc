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
h = require('hyperscript')
misc = require('./misc')


module.exports.Choice = (options, selected, props) ->
    select = h('select', props)
    for opt in options
        if Array.isArray(opt)
            [text, val] = opt
        else
            text = val = opt
        option = h('option', {value: val}, text)
        if val is selected
            option.selected = true
        select.appendChild(option)
    return select


module.exports.Multichoice = (legend, items, checked, attributes) ->
    fieldset = $('<fieldset>')
        .append($('<legend>').text(legend))
        .attr(attributes)
    for item in items
        input = $('<input>')
            .val(item)
            .attr('type': 'checkbox')
            .attr(attributes)
        if item in checked
            input.attr('checked', '')
        fieldset.append($('<div>').append(item, input))
    return fieldset


class module.exports.WeekDaySelector
    constructor:  (selected_days, baseid, radio=false) ->
        @container = $('<span>').addClass('weekdayselector')
        for wday, index in misc.WEEKDAYS_SHORT
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
