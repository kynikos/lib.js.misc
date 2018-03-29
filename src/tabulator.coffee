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
require("jquery.tabulator")
math = require('./math')
{format_money} = require('./format')


_money_formatter = (factor) ->
    return (value, data, cell, row, options) ->
        return format_money(parseFloat(value) * factor)


_number_editor_input = (cell, value, units, decimals, post_process) ->
        min = "0." + "0".repeat(decimals)
        max = "9".repeat(units) + "." + "9".repeat(decimals)
        if decimals < 1
            step = "1"
        else
            step = "0." + "0".repeat(decimals - 1) + "1"

        input = $("<input type='number' min=#{min} max=#{max} step=#{step} />")
            .css(
                "padding": "4px"
                "width": "100%"
                "box-sizing": "border-box"
            )
            .val(value)

        if cell.hasClass("tabulator-cell")
            setTimeout( ->
                input.focus()
            , 100)

        input.on("blur", (event) ->
            cell.trigger("editval", post_process(input.val()))
        )

        input.on("keydown", (event) ->
            if event.keyCode == 13
                cell.trigger("editval", post_process(input.val()))
        )

        return input


_number_editor = (units, decimals) ->
    return (cell, value) ->
        return _number_editor_input(cell, value, units, decimals, (inputval) ->
            return inputval
        )


_number_editor_multiply = (units, decimals, scale) ->
    return (cell, value) ->
        factor = 10 ** scale
        value = math.rounded_multiplication(value, factor, decimals)
        return _number_editor_input(cell, value, units, decimals, (inputval) ->
            # Add scale to decimals, since the original number may have had
            # more decimal digits than 'decimals'
            return math.rounded_division(inputval, factor, decimals + scale)
        )


_number_editor_divide = (units, decimals, scale) ->
    return (cell, value) ->
        divisor = 10 ** scale
        value = math.rounded_division(value, divisor, decimals)
        return _number_editor_input(cell, value, units, decimals, (inputval) ->
            math.rounded_multiplication(inputval, divisor, decimals)
        )


# Extend Tabulator http://olifolkerd.github.io/tabulator/docs/
module.exports.extjQuery = ($) ->
    $.widget("ui.tabulator", $.ui.tabulator,
        options: {}

        sorters:
            'generic_ext': (a, b, aData, bData, field, dir) ->
                if a < b
                    return -1
                if a > b
                    return 1
                return 0

            'number_ext': (a, b, aData, bData, field, dir) ->
                if bData.always_sort_last? and bData.always_sort_last
                    return -1
                if aData.always_sort_last? and aData.always_sort_last
                    return 1
                return a - b

            'istring_ext': (a, b, aData, bData, field, dir) ->
                if bData.always_sort_last? and bData.always_sort_last
                    return -1
                if aData.always_sort_last? and aData.always_sort_last
                    return 1
                ai = a.toLowerCase()
                bi = b.toLowerCase()
                if ai < bi
                    return -1
                if ai > bi
                    return 1
                return 0

        formatters:
            'integer*1000': (value, data, cell, row, options) ->
                return parseInt(value * 1000, 10)

            'integer/1000': (value, data, cell, row, options) ->
                return math.format_division(value, 1000, 0)

            'float*1000': (value, data, cell, row, options) ->
                return value * 1000

            'float.3*1000': (value, data, cell, row, options) ->
                return parseFloat((value * 1000).toFixed(3))

            'float.30*1000': (value, data, cell, row, options) ->
                return (value * 1000).toFixed(3)

            'float.3/1000': (value, data, cell, row, options) ->
                return math.rounded_division(value, 1000, 3)

            'float.30/1000': (value, data, cell, row, options) ->
                return math.format_division(value, 1000, 3)

            'money*1000': _money_formatter(1000)
            'money/1000': _money_formatter(1/1000)

        editors:
            'integer4': _number_editor(4, 0)
            'integer4*1000': _number_editor_multiply(4, 0, 3)
            'integer4/1000': _number_editor_divide(4, 0, 3)
            'float4.2': _number_editor(4, 2)
            'float4.2*1000': _number_editor_multiply(4, 2, 3)
            'float4.2/1000': _number_editor_divide(4, 2, 3)
            'float4.3': _number_editor(4, 3)
            'float4.3*1000': _number_editor_multiply(4, 3, 3)
            'float4.3/1000': _number_editor_divide(4, 3, 3)

        mutators:
            integer: (value, type, data) ->
                return parseInt(value, 10)

            float: (value, type, data) ->
                return parseFloat(value)

            boolean: (value, type, data) ->
                return new Boolean(value)

        accessors:
            integer: (value, data) ->
                return parseInt(value, 10)

            float: (value, data) ->
                return parseFloat(value)

            boolean: (value, data) ->
                return new Boolean(value)
    )


class module.exports.Tabulator
    constructor: (@config, @tabulator_config) ->
        @_firstload = $.Deferred()
        @firstload = @_firstload.promise()
        @tabulator_config.dataLoading = (data, params) =>
            # @firstload should be resolved every time new data is loaded
            @_firstload = $.Deferred()
            @firstload = @_firstload.promise()
            @show_loader()
        @tabulator_config.dataLoaded = (data) =>
            @controls.children().detach()
            # Detach to preserve the control elements to be readded, but
            # then also empty to get rid of the separator pipes ("|")
            @controls.empty()
            if data.length
                @controls.append(if @is_editable then @controls_edit \
                                 else @controls_view)
                @show_table()
            else
                @controls.append(@controls_nodata)
                @show_nodata_message()
            @_firstload.resolve(data)

        @config.show_view_controls ?= ['edit', 'export']
        if @config.show_view_controls
            @controls_view = []
            if 'edit' in @config.show_view_controls
                @controls_view.push($('<a href="#">Edit</a>')
                    .click(@set_editable))
                @controls_view.push(' | ')
            if 'export' in @config.show_view_controls
                @controls_view.push($('<a href="#">Export</a>').click( =>
                    @tabulator.tabulator("download", "csv", "data.csv")
                    return false
                ))
                @controls_view.push(' | ')
            @controls_view.pop()

        @config.show_nodata_controls ?= ['edit']
        if @config.show_nodata_controls
            @controls_nodata = []
            if 'edit' in @config.show_nodata_controls
                @controls_nodata.push($('<a href="#">Edit</a>')
                    .click(@set_editable))
                @controls_nodata.push(' | ')
            @controls_nodata.pop()

        @config.add_row_label ?= "Add row"
        @config.new_row ?= {}
        @config.show_edit_controls ?= ['save', 'cancel', 'add_row']
        if @config.show_edit_controls
            @controls_edit = []
            if 'save' in @config.show_edit_controls
                @controls_edit.push($('<a href="#">Save</a>').click(@save))
                @controls_edit.push(' | ')
            if 'cancel' in @config.show_edit_controls
                @controls_edit.push($('<a href="#">Cancel</a>').click(@cancel))
                @controls_edit.push(' | ')
            if 'add_row' in @config.show_edit_controls
                @controls_edit.push(
                    $("<a href=\"#\">#{@config.add_row_label}</a>")
                        .click(@add_row))
                @controls_edit.push(' | ')
            @controls_edit.pop()

        if @config.show_nodata_message
            text = if typeof @config.show_nodata_message is 'string' \
                then @config.show_nodata_message else 'Enter data'
            @message = $('<p>').append(
                $('<a>')
                    .attr('href', "#")
                    .text(text)
                    .click( =>
                        @set_editable()
                        @show_table()
                        return false
                    )
            )
        else
            @message = $('<p>').text('No data')

        @widget = $('<div class="tabulator-container">').append(
            @controls = $('<div class="tabulator-controls">').hide(),
            @message.hide(),
            @loader = if @config.loader? then @config.loader \
                      else $('<p>Loading...</p>'),
            @tabulator = $('<div>').tabulator(@tabulator_config).hide(),
        )

        if @config.start_editable? and @config.start_editable
            @set_editable()
        else
            @set_uneditable()

        if @config.onsaving?
            @on_saving = @config.onsaving
        else
            @on_saving = ->
                return true

        if @config.onsaved?
            @on_saved = @config.onsaved
        else
            @on_saved = =>
                @set_uneditable()
                return true

        if @config.oncancelling?
            @on_cancelling = @config.oncancelling
        else
            @on_cancelling = =>
                @set_uneditable()
                return true

        if @config.oncancelled?
            @on_cancelled = @config.oncancelled
        else
            @on_cancelled = ->
                return true

    @make_select_editor: (options, val, text, datatext) =>
        return (cell, value, data) =>
            if typeof options is 'function'
                options = options()
            select = $('<select>')
                .append( =>
                    opts = []
                    for opt in options
                        if typeof text is 'function'
                            opttext = text(opt)
                        else
                            opttext = opt[text]
                        opts.push($('<option>')
                            .val(opt[val])
                            .text(opttext)
                        )
                    return opts
                )
                .css(
                    "width": "100%"
                    "box-sizing": "border-box"
                )
            if value
                select.val(value)

            if cell.hasClass("tabulator-cell")
                setTimeout( ->
                    # TODO: Find a way to open the select (~ trigger a click)
                    select.focus()
                , 100)

            editval = ->
                newtext = select.find(':selected').text()
                if typeof datatext is 'function'
                    datatext(newtext, data)
                else
                    data[datatext] = newtext
                cell.trigger("editval", select.val())

            select.on("blur", (event) ->
                editval()
            )

            select.on("keydown", (event) ->
                if event.keyCode == 13
                    editval()
            )

            return select

    reconfigure: (config) =>
        @tabulator_config = config
        @tabulator.tabulator(@tabulator_config)

    get_data: =>
        return @tabulator.tabulator("getData")

    set_data: (data) =>
        @tabulator.tabulator("setData", data)

    refresh_data: =>
        @tabulator.tabulator('setData', @tabulator_config.ajaxURL,
                             @tabulator_config.ajaxParams)

    show: =>
        @widget.show()

    hide: =>
        @widget.hide()

    show_loader: =>
        @controls.hide()
        @message.hide()
        @tabulator.hide()
        @loader.show()

    show_table: =>
        @loader.hide()
        @controls.show()
        @message.hide()
        @tabulator.show()

    show_nodata_message: =>
        @loader.hide()
        if @controls_nodata?
            @controls.show()
        @tabulator.hide()
        @message.show()

    set_editable: =>
        @is_editable = true
        @saved_data = @tabulator.tabulator("getData")
        col_defs = @tabulator.tabulator("getColumns")
        for def in col_defs
            if def.editable_inhibited?
                def.editable = def.editable_inhibited
            if def.editor_inhibited?
                def.editor = def.editor_inhibited
        @tabulator.tabulator("setColumns", col_defs, false)
        @controls.children().detach()
        # Detach to preserve the control elements to be readded, but
        # then also empty to get rid of the separator pipes ("|")
        @controls.empty()
        if @controls_edit?
            @controls.append(@controls_edit)
        return false

    set_uneditable: =>
        @is_editable = false
        col_defs = @tabulator.tabulator("getColumns")
        for def in col_defs
            if def.editable? and def.editable is true
                def.editable_inhibited = def.editable
                def.editable = false
            if def.editor?
                # Setting an 'editor' attribute automatically makes the column
                # editable
                def.editor_inhibited = def.editor
                delete def.editor
        @tabulator.tabulator("setColumns", col_defs, false)
        @controls.children().detach()
        # Detach to preserve the control elements to be readded, but
        # then also empty to get rid of the separator pipes ("|")
        @controls.empty()
        if @controls_view?
            @controls.append(@controls_view)

    save: =>
        @on_saving()
        @show_loader()
        if @config.api_submit_url?
            $.post(
                url: @config.api_submit_url
                data:
                    data: JSON.stringify(@tabulator.tabulator("getData"))
                success: (data, textStatus, jqXHR) =>
                    if data != 'success'
                        alert("""
                              Error while saving the data.

                              Check the validity of the input values.
                              """)
                        @show_table()
                    else
                        onsaveret = @on_saved()
                        if onsaveret isnt false
                            # Reload the data, since the submitted
                            # array doesn't have the new entity keys
                            # that have been created
                            # Delay the refresh a little to give the
                            # time to the datastore to update the
                            # entities
                            window.setTimeout( =>
                                    # TODO: setData should work also
                                    #       without parameters, but it
                                    #       doesn't (report bug)
                                    # @tabulator.tabulator("setData")
                                    @tabulator.tabulator(
                                        "setData",
                                        @tabulator_config.ajaxURL,
                                        @tabulator_config.ajaxParams
                                    )
                                , 1000)
                error: (jqXHR, textStatus, errorThrown) =>
                    alert("""
                          Error while saving the data.

                          Check the validity of the input values.
                          """)
                    @show_table()
                    # alert("Error: jqXHR[#{JSON.stringify(jqXHR)}]
                    #       textStatus[#{textStatus}]
                    #       errorThrown[#{errorThrown}]")
            )
        # BUG: The window is scrolled up probably because the table changes
        #      size
        return false

    cancel: =>
        oncancellingret = @on_cancelling()
        if oncancellingret isnt false
            @tabulator.tabulator("setData", @saved_data)
            @on_cancelled()
        # BUG: The window is scrolled up probably because the table changes
        #      size
        return false

    add_row: =>
        # BUG: Tabulator adds the new row twice (wait for upstream
        #      fix)
        # rowsM = @tabulator.tabulator("getData").length
        @tabulator.tabulator("addRow",
                             jQuery.extend(true, {}, @config.new_row), true)
        # BUG: Tabulator adds the new row twice (wait for upstream
        #      fix)
        # data = @tabulator.tabulator("getData")
        # rowsN = data.length
        # if rowsN - rowsM > 1
        #     @tabulator.tabulator("setData", data[(rowsN - rowsM - 1)..])
        # BUG: The window is scrolled up probably because the table changes
        #      size (???)
        return false
