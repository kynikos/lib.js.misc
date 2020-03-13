"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
var $, BootstrapDatePickerAltDisplay;
$ = require('jquery');

require('bootstrap');

require('bootstrap-datepicker');

BootstrapDatePickerAltDisplay = /*#__PURE__*/function () {
  function BootstrapDatePickerAltDisplay() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var dpconfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, BootstrapDatePickerAltDisplay);

    var ref, ref1;

    if (config.format_date == null) {
      config.format_date = function (widget) {
        return widget.get_date();
      };
    } // Simply setting it as type="hidden" would show the popup in the
    // top-left corner of the screen


    this.picker = $('<input>').css({
      width: 0,
      height: 0,
      margin: 0,
      padding: 0,
      border: 'none'
    }).datepicker(dpconfig).change(function () {
      return _this.display.val(config.format_date(_this));
    });
    this.display = $('<input>').attr({
      'type': 'text',
      // TODO: Support readonly=false, but the user should provide a
      //       should be a reverse format_date function (parse_date)
      'readonly': (ref = config.readonly) != null ? ref : true,
      'placeholder': (ref1 = config.placeholder) != null ? ref1 : 'Select a date'
    }).addClass('datepicker-display').click(function () {
      return _this.picker.datepicker('show');
    });

    if (config.name != null) {
      this.picker.attr('name', config.name);
    }

    if (config.size != null) {
      this.display.attr('size', config.size);
    }

    if (config["class"] != null) {
      this.display.addClass(config["class"]);
    } // This block triggers 'change' on the picker, execute after configuring
    // everything


    if (config.initial_value != null) {
      this.set_date(config.initial_value);
      this.picker.trigger('change');
    }
  }

  _createClass(BootstrapDatePickerAltDisplay, [{
    key: "get_date",
    value: function get_date() {
      return this.picker.datepicker('getDate');
    }
  }, {
    key: "set_date",
    value: function set_date(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }

      return this.picker.datepicker('setDate', date);
    }
  }]);

  return BootstrapDatePickerAltDisplay;
}();

module.exports.extjQuery = function ($) {
  return $.fn.bootstrapDatepickerAltDisplay = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.each(function () {
      var config, dpconfig, ref, ref1, widget;

      if (typeof args[0] === 'string') {
        var _widget$picker;

        widget = $(this).data('widget'); // BUG: This is broken because the main
        //      bootstrapDatepickerAltDisplay method returns @each

        return (_widget$picker = widget.picker).datepicker.apply(_widget$picker, args);
      }

      config = (ref = args[0]) != null ? ref : {};
      dpconfig = (ref1 = args[1]) != null ? ref1 : {};
      widget = new BootstrapDatePickerAltDisplay(config, dpconfig); // Append the picker before the display, so that the popup
      // appears on the left

      return $(this).data('widget', widget).append(widget.picker, widget.display);
    });
  };
};