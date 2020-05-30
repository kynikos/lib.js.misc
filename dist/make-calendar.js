"use strict";

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
var moment = require('moment');

function makeCalendar(_ref) {
  var sortedDates = _ref.sortedDates,
      _ref$firstDayOfWeek = _ref.firstDayOfWeek,
      firstDayOfWeek = _ref$firstDayOfWeek === void 0 ? 1 : _ref$firstDayOfWeek;
  if (!sortedDates || !sortedDates.length) return null;
  var firstSelectedDate = sortedDates[0];
  var lastSelectedDate = sortedDates.slice(-1)[0];
  var lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  var diff1 = firstSelectedDate.day() >= firstDayOfWeek ? firstDayOfWeek : firstDayOfWeek - 7;
  var diff2 = lastSelectedDate.day() <= lastDayOfWeek ? lastDayOfWeek : lastDayOfWeek + 7;
  var firstDate = moment(firstSelectedDate).day(diff1);
  var lastDate = moment(lastSelectedDate).day(diff2);
  var rows = [[]];

  var _loop = function _loop(rDate) {
    var cDate = moment(rDate);
    var cRow = rows.slice(-1)[0];

    if (cRow.length >= 7) {
      cRow = [];
      rows.push(cRow);
    }

    cRow.push({
      date: cDate,
      isSelected: sortedDates.some(function (date) {
        return date.isSame(cDate, 'day');
      })
    });
  };

  for (var rDate = moment(firstDate); // eslint-disable-next-line no-unmodified-loop-condition
  rDate <= lastDate; rDate.add(1, 'day')) {
    _loop(rDate);
  }

  return rows;
}

module.exports.makeCalendar = makeCalendar;
module.exports["default"] = makeCalendar;