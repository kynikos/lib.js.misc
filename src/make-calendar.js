// JavaScript auxiliary library
// Copyright (C) 2012 Dario Giovannetti <dev@dariogiovannetti.net>
//
// This file is part of JavaScript auxiliary library.
//
// JavaScript auxiliary library is free software: you can redistribute it
// and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation, either version 3
// of the License, or (at your option) any later version.
//
// JavaScript auxiliary library is distributed in the hope that it will be
// useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with JavaScript auxiliary library.
// If not, see <http://www.gnu.org/licenses/>.

const moment = require('moment')


function roundDateRangeToWholeWeeks({
  dateRange,
  firstDayOfWeek = 1,
}) {
  const firstRangeDate = dateRange[0]
  const lastRangeDate = dateRange[1]

  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  const diff1 = firstRangeDate.day() >= firstDayOfWeek
    ? firstDayOfWeek
    : (firstDayOfWeek - 7)
  const diff2 = lastRangeDate.day() <= lastDayOfWeek
    ? lastDayOfWeek
    : (lastDayOfWeek + 7)

  return [
    moment(firstRangeDate).day(diff1),
    moment(lastRangeDate).day(diff2),
  ]
}
module.exports.roundDateRangeToWholeWeeks = roundDateRangeToWholeWeeks


function makeCalendar({
  roundedDateRange,
  dates,
}) {
  const firstDate = roundedDateRange[0]
  const lastDate = roundedDateRange[1]

  const rows = [[]]

  for (
    let rDate = moment(firstDate);
    rDate.isSameOrBefore(lastDate, 'day');
    rDate.add(1, 'day')
  ) {
    const cDate = moment(rDate)
    let cRow = rows.slice(-1)[0]

    if (cRow.length >= 7) {
      cRow = []
      rows.push(cRow)
    }

    cRow.push({
      date: cDate,
      inRange: dates.some((date) => date.isSame(cDate, 'day')),
    })
  }

  return rows
}
module.exports.makeCalendar = makeCalendar
