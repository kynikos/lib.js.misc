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
if not $().bootstrapTable? and not jQuery().bootstrapTable
    require('bootstrap-table')
if not Papa?
    Papa = require('papaparse')


# TODO: Change this to a proper BootstrapTable extension
module.exports.exportBootstrapTableToCSV = (table, button) ->
    options = table.bootstrapTable('getOptions')
    fields = []
    for column in options.columns[0]
        field = {}

        # TODO: Document that the title of the first field should not be just
        #       "ID", otherwise Excel will think it is a SYLK file and raise
        #       warnings
        # https://annalear.ca/2010/06/10/why-excel-thinks-your-csv-is-a-sylk/
        if not column.CSVexportAs?
            field.title = column.title
        else if column.CSVexportAs isnt false
            field.title = column.CSVexportAs
        else
            continue

        field.fieldName = column.field

        if column.CSVexporter?
            field.exporter = column.CSVexporter
        else
            field.exporter = (value, row, index) ->
                return value

        fields.push(field)

    rows = []
    for drow, index in table.bootstrapTable('getData')
        row = []
        for field in fields
            row.push(field.exporter(drow[field.fieldName],
                                    drow, index))
        rows.push(row)

    csv = Papa.unparse(
        fields: (field.title for field in fields)
        data: rows
    )
    blob = new Blob([csv], {type:'text/csv'})
    link = $("<a>")
        .attr(
            "download": options.CSVexportFileName
            "href": window.URL.createObjectURL(blob)
        )
        .insertAfter(button)
    # .trigger("click"); doesn't work
    link[0].click()
    link.remove()
