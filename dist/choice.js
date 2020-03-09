'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Generated by CoffeeScript 2.5.1
// lib.cs.misc - Check the status of code repositories under a root directory.
// Copyright (C) 2016 Dario Giovannetti <dev@dariogiovannetti.net>

// This file is part of lib.cs.misc.

// lib.cs.misc is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// lib.cs.misc is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with lib.cs.misc.  If not, see <http://www.gnu.org/licenses/>.
var $,
    datetime,
    h,
    indexOf = [].indexOf;

$ = require('jquery');

h = require('hyperscript');

datetime = require('./datetime');

module.exports.Choice = function (options, selected, props) {
  var i, len, opt, option, select, text, val;
  select = h('select', props);
  for (i = 0, len = options.length; i < len; i++) {
    opt = options[i];
    if (Array.isArray(opt)) {
      var _opt = opt;

      var _opt2 = _slicedToArray(_opt, 2);

      text = _opt2[0];
      val = _opt2[1];
    } else {
      text = val = opt;
    }
    option = h('option', {
      value: val
    }, text);
    if (val === selected) {
      option.selected = true;
    }
    select.appendChild(option);
  }
  return select;
};

module.exports.Multichoice = function (legend, items, checked, attributes) {
  var fieldset, i, input, item, len;
  fieldset = $('<fieldset>').append($('<legend>').text(legend)).attr(attributes);
  for (i = 0, len = items.length; i < len; i++) {
    item = items[i];
    input = $('<input>').val(item).attr({
      'type': 'checkbox'
    }).attr(attributes);
    if (indexOf.call(checked, item) >= 0) {
      input.attr('checked', '');
    }
    fieldset.append($('<div>').append(item, input));
  }
  return fieldset;
};

module.exports.WeekDaySelector = function () {
  function WeekDaySelector(selected_days, baseid) {
    var radio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, WeekDaySelector);

    var i, id, index, input, len, name, ref, wday;
    this.container = $('<span>').addClass('weekdayselector');
    ref = datetime.WEEKDAYS_SHORT;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      wday = ref[index];
      id = baseid + '-' + index;
      name = '' + baseid;
      input = $('<input>').attr({
        'type': radio ? 'radio' : 'checkbox',
        'name': name,
        'id': id
      }).val(index).appendTo(this.container);
      if (selected_days.indexOf(index) > -1) {
        input.prop("checked", true);
      }
      $('<label>').attr('for', id).text(wday).appendTo(this.container);
    }
  }

  _createClass(WeekDaySelector, [{
    key: 'get_days',
    value: function get_days() {
      var days, i, input, len, ref;
      days = [];
      ref = this.container.children('input');
      for (i = 0, len = ref.length; i < len; i++) {
        input = ref[i];
        if (input.checked) {
          days.push(input.value);
        }
      }
      return days;
    }
  }]);

  return WeekDaySelector;
}();