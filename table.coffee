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


# Extend Tabulator http://olifolkerd.github.io/tabulator/docs/
$.widget("ui.tabulator", $.ui.tabulator,
    options: {}
    sorters: {}
    formatters:
        select: (value, data, cell, row, options) ->
            return cell.attr('data-text')

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

        money: (cell, value) ->
            input = $("<input type='number' min=0.00 max=9999.99 step=0.01 />")
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
                cell.trigger("editval", input.val())
            )

            input.on("keydown", (event) ->
                if event.keyCode == 13
                    cell.trigger("editval", input.val())
            )

            return input

    mutators: {}
    accessors:
        integer: (value, data) ->
            return parseInt(value, 10)

        float: (value, data) ->
            return parseFloat(value)
)


class module.exports.Tabulator
    constructor: (@config, @tabulator_config) ->
        @tabulator_config.dataLoading = (data, params) =>
            @show_loader()
        @tabulator_config.dataLoaded = (data) =>
            if data.length
                @show_table()
            else
                @show_message('No data')

        @widget = $('<div class="tabulator-container">').append(
            @controls = $('<div class="tabulator-controls">').hide(),
            @message = $('<p>').hide(),
            @loader = if @config.loader? then @config.loader \
                      else $('<p>Loading...</p>'),
            @tabulator = $('<div>').tabulator(@tabulator_config).hide(),
        )

        if @config.start_editable? and @config.start_editable
            @set_editable()
        else
            @set_uneditable()

        if @config.onclose?
            @on_close = @config.onclose
        else
            @on_close = @set_uneditable

    @make_select_editor: (options, val, text) =>
        return (cell, value, data) =>
            if typeof options is 'function'
                options = options()
            select = $('<select>')
                .append( =>
                    opts = []
                    for opt in options
                        opts.push($('<option>')
                            .val(opt[val])
                            .text(opt[text])
                        )
                    return opts
                )
                .css(
                    "width": "100%"
                    "box-sizing": "border-box"
                )

            if cell.hasClass("tabulator-cell")
                setTimeout( ->
                    # TODO: Find a way to open the select (~ trigger a click)
                    select.focus()
                , 100)

            select.on("blur", (event) ->
                cell.attr('data-text', select.find(':selected').text())
                cell.trigger("editval", select.val())
            )

            select.on("keydown", (event) ->
                if event.keyCode == 13
                    cell.attr('data-text', select.find(':selected').text())
                    cell.trigger("editval", select.val())
            )

            return select

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

    show_message: (message) =>
        @loader.hide()
        @controls.show()
        @tabulator.hide()
        @message.text(message).show()

    set_editable: =>
        @saved_data = @tabulator.tabulator("getData")
        col_defs = @tabulator.tabulator("getColumns")
        for def in col_defs
            if def.editable_inhibited?
                def.editable = def.editable_inhibited
            if def.editor_inhibited?
                def.editor = def.editor_inhibited
        @tabulator.tabulator("setColumns", col_defs, false)
        @controls
            .empty()
            .append(
                $('<a href="#">Save</a>').click( =>
                    @show_loader()
                    $.post(
                        url: '/api/'
                        data:
                            action: @config.api_submit_action
                            data: JSON.stringify(@tabulator
                                                        .tabulator("getData"))
                        success: (data, textStatus, jqXHR) =>
                            if data != 'success'
                                alert("""
                                      Error while saving the data.

                                      Check the validity of the input values.
                                      """)
                                @show_table()
                            else
                                @on_close()
                                # Reload the data, since the submitted array
                                # doesn't have the new entity keys that have
                                # been created
                                # Delay the refresh a little to give the time
                                # to the datastore to update the entities
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
                    return false
                ),
                ' | ',
                $('<a href="#">Cancel</a>').click( =>
                    @tabulator.tabulator("setData", @saved_data)
                    @on_close()
                    return false
                ),
                ' | ',
                $('<a href="#">Add row</a>').click( =>
                    # BUG: Tabulator adds the new row twice (wait for upstream
                    #      fix)
                    rowsM = @tabulator.tabulator("getData").length
                    @tabulator.tabulator("addRow", {key: 'new'}, true)
                    # BUG: Tabulator adds the new row twice (wait for upstream
                    #      fix)
                    data = @tabulator.tabulator("getData")
                    rowsN = data.length
                    if rowsN - rowsM > 1
                        @tabulator.tabulator("setData",
                                             data[(rowsN - rowsM - 1)..])
                    return false
                ),
            )
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
        @controls.empty().append(
            $('<a href="#">Edit</a>').click(@set_editable)
        )


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
