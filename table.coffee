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
require("jquery.tabulator")
misc = require('./misc')


_money_formatter = (factor) ->
    return (value, data, cell, row, options) ->
        return misc.format_money(parseFloat(value) * factor)


_number_editor = (units, decimals, factor) ->
    return (cell, value) ->
        value *= factor

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
            cell.trigger("editval", misc.rounded_division(
                                            input.val(), factor, decimals))
        )

        input.on("keydown", (event) ->
            if event.keyCode == 13
                cell.trigger("editval", misc.rounded_division(
                                            input.val(), factor, decimals))
        )

        return input


# Extend Tabulator http://olifolkerd.github.io/tabulator/docs/
$.widget("ui.tabulator", $.ui.tabulator,
    options: {}
    sorters: {}
    formatters:
        'integer*1000': (value, data, cell, row, options) ->
            return parseInt(value * 1000, 10)

        'integer/1000': (value, data, cell, row, options) ->
            return misc.format_division(value, 1000, 0)

        'float*1000': (value, data, cell, row, options) ->
            return value * 1000

        'float.3*1000': (value, data, cell, row, options) ->
            return parseFloat((value * 1000).toFixed(3))

        'float.30*1000': (value, data, cell, row, options) ->
            return (value * 1000).toFixed(3)

        'float.3/1000': (value, data, cell, row, options) ->
            return misc.rounded_division(value, 1000, 3)

        'float.30/1000': (value, data, cell, row, options) ->
            return misc.format_division(value, 1000, 3)

        'money*1000': _money_formatter(1000)
        'money/1000': _money_formatter(1/1000)

    editors:
        date: (cell, value) ->
            datepicker = new misc.DatePicker()

            if cell.hasClass("tabulator-cell")
                setTimeout( ->
                    datepicker.show()
                , 100)

            datepicker.input.change( ->
                cell.trigger("editval", datepicker.get_date())
            )

            return $('<span>').append(datepicker.input, datepicker.display)

        'integer4': _number_editor(4, 0, 1)
        'integer4*1000': _number_editor(4, 0, 1000)
        'integer4/1000': _number_editor(4, 0, 1/1000)
        'float4.2': _number_editor(4, 2, 1)
        'float4.2*1000': _number_editor(4, 2, 1000)
        'float4.2/1000': _number_editor(4, 2, 1/1000)
        'float4.3': _number_editor(4, 3, 1)
        'float4.3*1000': _number_editor(4, 3, 1000)
        'float4.3/1000': _number_editor(4, 3, 1/1000)

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
            if data.length
                @show_table()
            else
                if @config.show_nodata_controls
                    text = if typeof @config.show_nodata_controls is 'string' \
                        then @config.show_nodata_controls else 'Enter data'
                    @show_message($('<a>')
                        .attr('href', "#")
                        .text(text)
                        .click( =>
                            @set_editable()
                            @show_table()
                            return false
                        )
                    )
                else
                    @show_message('No data')
            @_firstload.resolve(data)

        if @config.show_controls? and @config.show_controls is false
            @controls = null
        else
            @controls = $('<div class="tabulator-controls">').hide()

        @widget = $('<div class="tabulator-container">').append(
            @controls,
            @message = $('<p>').hide(),
            @loader = if @config.loader? then @config.loader \
                      else $('<p>Loading...</p>'),
            @tabulator = $('<div>').tabulator(@tabulator_config).hide(),
        )

        if @config.start_editable? and @config.start_editable
            @set_editable()
        else
            @set_uneditable()

        @config.add_row_label ?= "Add row"
        @config.new_row ?= {}

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
        @controls?.hide()
        @message.hide()
        @tabulator.hide()
        @loader.show()

    show_table: =>
        @loader.hide()
        @controls?.show()
        @message.hide()
        @tabulator.show()

    show_message: (message) =>
        @loader.hide()
        @controls?.show()
        @tabulator.hide()
        # Use append() to allow for complex messages
        @message.empty().append(message).show()

    set_editable: =>
        @saved_data = @tabulator.tabulator("getData")
        col_defs = @tabulator.tabulator("getColumns")
        for def in col_defs
            if def.editable_inhibited?
                def.editable = def.editable_inhibited
            if def.editor_inhibited?
                def.editor = def.editor_inhibited
        @tabulator.tabulator("setColumns", col_defs, false)
        if @controls?
            controls = []
            if not @config.show_save_cancel? or \
                    @config.show_save_cancel isnt false
                controls.push($('<a href="#">Save</a>').click(@save))
                controls.push(' | ')
                controls.push($('<a href="#">Cancel</a>').click(@cancel))
                controls.push(' | ')
            if not @config.show_add_row? or @config.show_add_row isnt false
                controls.push($("<a href=\"#\">#{@config.add_row_label}</a>")
                    .click(@add_row))
                controls.push(' | ')
            controls.pop()
            @controls.empty().append(controls)
        return false

    set_uneditable: =>
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
        @controls?.empty().append(
            $('<a href="#">Edit</a>').click(@set_editable)
        )

    save: =>
        @on_saving()
        @show_loader()
        if @config.api_submit_action?
            $.post(
                url: '/api/'
                data:
                    action: @config.api_submit_action
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
        rowsM = @tabulator.tabulator("getData").length
        @tabulator.tabulator("addRow", @config.new_row, true)
        # BUG: Tabulator adds the new row twice (wait for upstream
        #      fix)
        data = @tabulator.tabulator("getData")
        rowsN = data.length
        if rowsN - rowsM > 1
            @tabulator.tabulator("setData", data[(rowsN - rowsM - 1)..])
        # BUG: The window is scrolled up probably because the table changes
        #      size (???)
        return false


class TableSettings
    constructor: (@table) ->
        self = this

        showSettings = (event) ->
            settings = $(this).closest('div.settings')
            form = settings.children('form')
            if form.length
                form.show()
            else
                form = $('<form>').appendTo(settings)
                self.table.find('th').each((index) ->
                    th = $(this)
                    form
                        .append(
                            $('<label>')
                                .text(th.text())
                                .prepend(
                                    $('<input type="checkbox">')
                                        .prop('checked', true)
                                        .change( ->
                                            if $(this)[0].checked
                                                self._showField(index)
                                            else
                                                self._hideField(index)
                                        )
                            )
                        )
                        .append('<br>')
                )

            $(this)
                .off('click', showSettings)
                .on('click', hideSettings)
            return false

        hideSettings = (event) ->
            # Only hide the form, don't remove it, or the checkboxes will
            # have to be reinitialized to a checked/unchecked status based on
            # the visibility of each field every time the settings are shown
            # again
            $(this).closest('div.settings').children('form').hide()
            $(this)
                .off('click', hideSettings)
                .on('click', showSettings)
            return false

        $('<div>')
            .addClass('settings')
            .append(
                $('<a>')
                    .attr('href', '#')
                    .text('Settings')
                    .click(showSettings)
            )
            .insertBefore(@table)


class TableSettingsNoSpan extends TableSettings
    _showField: (index) ->
        filter = ':nth-of-type(' + (index + 1) + ')'
        @table.find('th' + filter + ', td' + filter).show()

    _hideField: (index) ->
        filter = ':nth-of-type(' + (index + 1) + ')'
        @table.find('th' + filter + ', td' + filter).hide()


class TableSettingsRowspan extends TableSettings
    _showField: (index) ->
        @table.find('.col' + index).show()

    _hideField: (index) ->
        @table.find('.col' + index).hide()


$.fn.addTableSettings = ->
    @each( ->
        if $(this).hasClass('hideable-fields-nospan')
            new TableSettingsNoSpan($(this))
        else if $(this).hasClass('hideable-fields-rowspan')
            new TableSettingsRowspan($(this))
        return $(this)
    )


$.fn.prependTableDataRows = (rows...) ->
    @each( ->
        # TODO: Check if this is a table, thead, tbody or tfoot?
        for row in rows
            tr = $('<tr>')
            for cell in row
                tr.append($('<td>').append(cell))
            $(this).prepend(tr)
        return $(this)
    )


$.fn.appendTableDataRows = (rows...) ->
    @each( ->
        # TODO: Check if this is a table, thead, tbody or tfoot?
        for row in rows
            tr = $('<tr>')
            for cell in row
                tr.append($('<td>').append(cell))
            $(this).append(tr)
        return $(this)
    )
