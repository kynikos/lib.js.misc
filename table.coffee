# lib.cs.misc - Check the status of code repositories under a root directory.
# Copyright (C) 2015 Dario Giovannetti <dev@dariogiovannetti.net>
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


class TableSettings
    constructor: (@table) ->
        self = this

        showSettings = (event) ->
            settings = $(this).parents('div.settings').first()
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
            $(this).parents('div.settings').first().children('form').hide()
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
