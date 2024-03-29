"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// Generated by CoffeeScript 2.7.0
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
    _money_formatter,
    _number_editor,
    _number_editor_divide,
    _number_editor_input,
    _number_editor_multiply,
    format_money,
    math,
    indexOf = [].indexOf;

$ = require('jquery');

require("jquery-ui-browserify");

require("jquery.tabulator");

math = require('./math');

var _require = require('./format');

format_money = _require.format_money;

_money_formatter = function _money_formatter(factor) {
  return function (value, data, cell, row, options) {
    return format_money(parseFloat(value) * factor);
  };
};

_number_editor_input = function _number_editor_input(cell, value, units, decimals, post_process) {
  var input, max, min, step;
  min = "0." + "0".repeat(decimals);
  max = "9".repeat(units) + "." + "9".repeat(decimals);

  if (decimals < 1) {
    step = "1";
  } else {
    step = "0." + "0".repeat(decimals - 1) + "1";
  }

  input = $("<input type='number' min=".concat(min, " max=").concat(max, " step=").concat(step, " />")).css({
    "padding": "4px",
    "width": "100%",
    "box-sizing": "border-box"
  }).val(value);

  if (cell.hasClass("tabulator-cell")) {
    setTimeout(function () {
      return input.focus();
    }, 100);
  }

  input.on("blur", function (event) {
    return cell.trigger("editval", post_process(input.val()));
  });
  input.on("keydown", function (event) {
    if (event.keyCode === 13) {
      return cell.trigger("editval", post_process(input.val()));
    }
  });
  return input;
};

_number_editor = function _number_editor(units, decimals) {
  return function (cell, value) {
    return _number_editor_input(cell, value, units, decimals, function (inputval) {
      return inputval;
    });
  };
};

_number_editor_multiply = function _number_editor_multiply(units, decimals, scale) {
  return function (cell, value) {
    var factor;
    factor = Math.pow(10, scale);
    value = math.roundedMultiplication(value, factor, decimals);
    return _number_editor_input(cell, value, units, decimals, function (inputval) {
      // Add scale to decimals, since the original number may have had
      // more decimal digits than 'decimals'
      return math.roundedDivision(inputval, factor, decimals + scale);
    });
  };
};

_number_editor_divide = function _number_editor_divide(units, decimals, scale) {
  return function (cell, value) {
    var divisor;
    divisor = Math.pow(10, scale);
    value = math.roundedDivision(value, divisor, decimals);
    return _number_editor_input(cell, value, units, decimals, function (inputval) {
      return math.roundedMultiplication(inputval, divisor, decimals);
    });
  };
}; // Extend Tabulator http://olifolkerd.github.io/tabulator/docs/


module.exports.extjQuery = function ($) {
  return $.widget("ui.tabulator", $.ui.tabulator, {
    options: {},
    sorters: {
      'generic_ext': function generic_ext(a, b, aData, bData, field, dir) {
        if (a < b) {
          return -1;
        }

        if (a > b) {
          return 1;
        }

        return 0;
      },
      'number_ext': function number_ext(a, b, aData, bData, field, dir) {
        if (bData.always_sort_last != null && bData.always_sort_last) {
          return -1;
        }

        if (aData.always_sort_last != null && aData.always_sort_last) {
          return 1;
        }

        return a - b;
      },
      'istring_ext': function istring_ext(a, b, aData, bData, field, dir) {
        var ai, bi;

        if (bData.always_sort_last != null && bData.always_sort_last) {
          return -1;
        }

        if (aData.always_sort_last != null && aData.always_sort_last) {
          return 1;
        }

        ai = a.toLowerCase();
        bi = b.toLowerCase();

        if (ai < bi) {
          return -1;
        }

        if (ai > bi) {
          return 1;
        }

        return 0;
      }
    },
    formatters: {
      'integer*1000': function integer1000(value, data, cell, row, options) {
        return parseInt(value * 1000, 10);
      },
      'integer/1000': function integer1000(value, data, cell, row, options) {
        return math.formatDivision(value, 1000, 0);
      },
      'float*1000': function float1000(value, data, cell, row, options) {
        return value * 1000;
      },
      'float.3*1000': function float31000(value, data, cell, row, options) {
        return parseFloat((value * 1000).toFixed(3));
      },
      'float.30*1000': function float301000(value, data, cell, row, options) {
        return (value * 1000).toFixed(3);
      },
      'float.3/1000': function float31000(value, data, cell, row, options) {
        return math.roundedDivision(value, 1000, 3);
      },
      'float.30/1000': function float301000(value, data, cell, row, options) {
        return math.formatDivision(value, 1000, 3);
      },
      'money*1000': _money_formatter(1000),
      'money/1000': _money_formatter(1 / 1000)
    },
    editors: {
      'integer4': _number_editor(4, 0),
      'integer4*1000': _number_editor_multiply(4, 0, 3),
      'integer4/1000': _number_editor_divide(4, 0, 3),
      'float4.2': _number_editor(4, 2),
      'float4.2*1000': _number_editor_multiply(4, 2, 3),
      'float4.2/1000': _number_editor_divide(4, 2, 3),
      'float4.3': _number_editor(4, 3),
      'float4.3*1000': _number_editor_multiply(4, 3, 3),
      'float4.3/1000': _number_editor_divide(4, 3, 3)
    },
    mutators: {
      integer: function integer(value, type, data) {
        return parseInt(value, 10);
      },
      "float": function float(value, type, data) {
        return parseFloat(value);
      },
      "boolean": function boolean(value, type, data) {
        return new Boolean(value);
      }
    },
    accessors: {
      integer: function integer(value, data) {
        return parseInt(value, 10);
      },
      "float": function float(value, data) {
        return parseFloat(value);
      },
      "boolean": function boolean(value, data) {
        return new Boolean(value);
      }
    }
  });
};

module.exports.Tabulator = /*#__PURE__*/function () {
  function Tabulator(config1, tabulator_config) {
    var _this = this;

    _classCallCheck(this, Tabulator);

    var base, base1, base2, base3, base4, text;
    this.reconfigure = this.reconfigure.bind(this);
    this.get_data = this.get_data.bind(this);
    this.set_data = this.set_data.bind(this);
    this.refresh_data = this.refresh_data.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.show_loader = this.show_loader.bind(this);
    this.show_table = this.show_table.bind(this);
    this.show_nodata_message = this.show_nodata_message.bind(this);
    this.set_editable = this.set_editable.bind(this);
    this.set_uneditable = this.set_uneditable.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.add_row = this.add_row.bind(this);
    this.config = config1;
    this.tabulator_config = tabulator_config;
    this._firstload = $.Deferred();
    this.firstload = this._firstload.promise();

    this.tabulator_config.dataLoading = function (data, params) {
      // @firstload should be resolved every time new data is loaded
      _this._firstload = $.Deferred();
      _this.firstload = _this._firstload.promise();
      return _this.show_loader();
    };

    this.tabulator_config.dataLoaded = function (data) {
      _this.controls.children().detach(); // Detach to preserve the control elements to be readded, but
      // then also empty to get rid of the separator pipes ("|")


      _this.controls.empty();

      if (data.length) {
        _this.controls.append(_this.is_editable ? _this.controls_edit : _this.controls_view);

        _this.show_table();
      } else {
        _this.controls.append(_this.controls_nodata);

        _this.show_nodata_message();
      }

      return _this._firstload.resolve(data);
    };

    if ((base = this.config).show_view_controls == null) {
      base.show_view_controls = ['edit', 'export'];
    }

    if (this.config.show_view_controls) {
      this.controls_view = [];

      if (indexOf.call(this.config.show_view_controls, 'edit') >= 0) {
        this.controls_view.push($('<a href="#">Edit</a>').click(this.set_editable));
        this.controls_view.push(' | ');
      }

      if (indexOf.call(this.config.show_view_controls, 'export') >= 0) {
        this.controls_view.push($('<a href="#">Export</a>').click(function () {
          _this.tabulator.tabulator("download", "csv", "data.csv");

          return false;
        }));
        this.controls_view.push(' | ');
      }

      this.controls_view.pop();
    }

    if ((base1 = this.config).show_nodata_controls == null) {
      base1.show_nodata_controls = ['edit'];
    }

    if (this.config.show_nodata_controls) {
      this.controls_nodata = [];

      if (indexOf.call(this.config.show_nodata_controls, 'edit') >= 0) {
        this.controls_nodata.push($('<a href="#">Edit</a>').click(this.set_editable));
        this.controls_nodata.push(' | ');
      }

      this.controls_nodata.pop();
    }

    if ((base2 = this.config).add_row_label == null) {
      base2.add_row_label = "Add row";
    }

    if ((base3 = this.config).new_row == null) {
      base3.new_row = {};
    }

    if ((base4 = this.config).show_edit_controls == null) {
      base4.show_edit_controls = ['save', 'cancel', 'add_row'];
    }

    if (this.config.show_edit_controls) {
      this.controls_edit = [];

      if (indexOf.call(this.config.show_edit_controls, 'save') >= 0) {
        this.controls_edit.push($('<a href="#">Save</a>').click(this.save));
        this.controls_edit.push(' | ');
      }

      if (indexOf.call(this.config.show_edit_controls, 'cancel') >= 0) {
        this.controls_edit.push($('<a href="#">Cancel</a>').click(this.cancel));
        this.controls_edit.push(' | ');
      }

      if (indexOf.call(this.config.show_edit_controls, 'add_row') >= 0) {
        this.controls_edit.push($("<a href=\"#\">".concat(this.config.add_row_label, "</a>")).click(this.add_row));
        this.controls_edit.push(' | ');
      }

      this.controls_edit.pop();
    }

    if (this.config.show_nodata_message) {
      text = typeof this.config.show_nodata_message === 'string' ? this.config.show_nodata_message : 'Enter data';
      this.message = $('<p>').append($('<a>').attr('href', "#").text(text).click(function () {
        _this.set_editable();

        _this.show_table();

        return false;
      }));
    } else {
      this.message = $('<p>').text('No data');
    }

    this.widget = $('<div class="tabulator-container">').append(this.controls = $('<div class="tabulator-controls">').hide(), this.message.hide(), this.loader = this.config.loader != null ? this.config.loader : $('<p>Loading...</p>'), this.tabulator = $('<div>').tabulator(this.tabulator_config).hide());

    if (this.config.start_editable != null && this.config.start_editable) {
      this.set_editable();
    } else {
      this.set_uneditable();
    }

    if (this.config.onsaving != null) {
      this.on_saving = this.config.onsaving;
    } else {
      this.on_saving = function () {
        return true;
      };
    }

    if (this.config.onsaved != null) {
      this.on_saved = this.config.onsaved;
    } else {
      this.on_saved = function () {
        _this.set_uneditable();

        return true;
      };
    }

    if (this.config.oncancelling != null) {
      this.on_cancelling = this.config.oncancelling;
    } else {
      this.on_cancelling = function () {
        _this.set_uneditable();

        return true;
      };
    }

    if (this.config.oncancelled != null) {
      this.on_cancelled = this.config.oncancelled;
    } else {
      this.on_cancelled = function () {
        return true;
      };
    }
  }

  _createClass(Tabulator, [{
    key: "reconfigure",
    value: function reconfigure(config) {
      this.tabulator_config = config;
      return this.tabulator.tabulator(this.tabulator_config);
    }
  }, {
    key: "get_data",
    value: function get_data() {
      return this.tabulator.tabulator("getData");
    }
  }, {
    key: "set_data",
    value: function set_data(data) {
      return this.tabulator.tabulator("setData", data);
    }
  }, {
    key: "refresh_data",
    value: function refresh_data() {
      return this.tabulator.tabulator('setData', this.tabulator_config.ajaxURL, this.tabulator_config.ajaxParams);
    }
  }, {
    key: "show",
    value: function show() {
      return this.widget.show();
    }
  }, {
    key: "hide",
    value: function hide() {
      return this.widget.hide();
    }
  }, {
    key: "show_loader",
    value: function show_loader() {
      this.controls.hide();
      this.message.hide();
      this.tabulator.hide();
      return this.loader.show();
    }
  }, {
    key: "show_table",
    value: function show_table() {
      this.loader.hide();
      this.controls.show();
      this.message.hide();
      return this.tabulator.show();
    }
  }, {
    key: "show_nodata_message",
    value: function show_nodata_message() {
      this.loader.hide();

      if (this.controls_nodata != null) {
        this.controls.show();
      }

      this.tabulator.hide();
      return this.message.show();
    }
  }, {
    key: "set_editable",
    value: function set_editable() {
      var col_defs, def, i, len;
      this.is_editable = true;
      this.saved_data = this.tabulator.tabulator("getData");
      col_defs = this.tabulator.tabulator("getColumns");

      for (i = 0, len = col_defs.length; i < len; i++) {
        def = col_defs[i];

        if (def.editable_inhibited != null) {
          def.editable = def.editable_inhibited;
        }

        if (def.editor_inhibited != null) {
          def.editor = def.editor_inhibited;
        }
      }

      this.tabulator.tabulator("setColumns", col_defs, false);
      this.controls.children().detach(); // Detach to preserve the control elements to be readded, but
      // then also empty to get rid of the separator pipes ("|")

      this.controls.empty();

      if (this.controls_edit != null) {
        this.controls.append(this.controls_edit);
      }

      return false;
    }
  }, {
    key: "set_uneditable",
    value: function set_uneditable() {
      var col_defs, def, i, len;
      this.is_editable = false;
      col_defs = this.tabulator.tabulator("getColumns");

      for (i = 0, len = col_defs.length; i < len; i++) {
        def = col_defs[i];

        if (def.editable != null && def.editable === true) {
          def.editable_inhibited = def.editable;
          def.editable = false;
        }

        if (def.editor != null) {
          // Setting an 'editor' attribute automatically makes the column
          // editable
          def.editor_inhibited = def.editor;
          delete def.editor;
        }
      }

      this.tabulator.tabulator("setColumns", col_defs, false);
      this.controls.children().detach(); // Detach to preserve the control elements to be readded, but
      // then also empty to get rid of the separator pipes ("|")

      this.controls.empty();

      if (this.controls_view != null) {
        return this.controls.append(this.controls_view);
      }
    }
  }, {
    key: "save",
    value: function save() {
      var _this2 = this;

      this.on_saving();
      this.show_loader();

      if (this.config.api_submit_url != null) {
        $.post({
          url: this.config.api_submit_url,
          data: {
            data: JSON.stringify(this.tabulator.tabulator("getData"))
          },
          success: function success(data, textStatus, jqXHR) {
            var onsaveret;

            if (data !== 'success') {
              alert("Error while saving the data.\n\nCheck the validity of the input values.");
              return _this2.show_table();
            } else {
              onsaveret = _this2.on_saved();

              if (onsaveret !== false) {
                // Reload the data, since the submitted
                // array doesn't have the new entity keys
                // that have been created
                // Delay the refresh a little to give the
                // time to the datastore to update the
                // entities
                return window.setTimeout(function () {
                  // TODO: setData should work also
                  //       without parameters, but it
                  //       doesn't (report bug)
                  // @tabulator.tabulator("setData")
                  return _this2.tabulator.tabulator("setData", _this2.tabulator_config.ajaxURL, _this2.tabulator_config.ajaxParams);
                }, 1000);
              }
            }
          },
          error: function error(jqXHR, textStatus, errorThrown) {
            alert("Error while saving the data.\n\nCheck the validity of the input values.");
            return _this2.show_table();
          }
        });
      } // BUG: The window is scrolled up probably because the table changes
      //      size
      // alert("Error: jqXHR[#{JSON.stringify(jqXHR)}]
      //       textStatus[#{textStatus}]
      //       errorThrown[#{errorThrown}]")


      return false;
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var oncancellingret;
      oncancellingret = this.on_cancelling();

      if (oncancellingret !== false) {
        this.tabulator.tabulator("setData", this.saved_data);
        this.on_cancelled();
      } // BUG: The window is scrolled up probably because the table changes
      //      size


      return false;
    }
  }, {
    key: "add_row",
    value: function add_row() {
      // BUG: Tabulator adds the new row twice (wait for upstream
      //      fix)
      // rowsM = @tabulator.tabulator("getData").length
      this.tabulator.tabulator("addRow", jQuery.extend(true, {}, this.config.new_row), true); // BUG: Tabulator adds the new row twice (wait for upstream
      //      fix)
      // data = @tabulator.tabulator("getData")
      // rowsN = data.length
      // if rowsN - rowsM > 1
      //     @tabulator.tabulator("setData", data[(rowsN - rowsM - 1)..])
      // BUG: The window is scrolled up probably because the table changes
      //      size (???)

      return false;
    }
  }], [{
    key: "make_select_editor",
    value: function make_select_editor(options, val, text, datatext) {
      return function (cell, value, data) {
        var editval, select;

        if (typeof options === 'function') {
          options = options();
        }

        select = $('<select>').append(function () {
          var i, len, opt, opts, opttext;
          opts = [];

          for (i = 0, len = options.length; i < len; i++) {
            opt = options[i];

            if (typeof text === 'function') {
              opttext = text(opt);
            } else {
              opttext = opt[text];
            }

            opts.push($('<option>').val(opt[val]).text(opttext));
          }

          return opts;
        }).css({
          "width": "100%",
          "box-sizing": "border-box"
        });

        if (value) {
          select.val(value);
        }

        if (cell.hasClass("tabulator-cell")) {
          setTimeout(function () {
            // TODO: Find a way to open the select (~ trigger a click)
            return select.focus();
          }, 100);
        }

        editval = function editval() {
          var newtext;
          newtext = select.find(':selected').text();

          if (typeof datatext === 'function') {
            datatext(newtext, data);
          } else {
            data[datatext] = newtext;
          }

          return cell.trigger("editval", select.val());
        };

        select.on("blur", function (event) {
          return editval();
        });
        select.on("keydown", function (event) {
          if (event.keyCode === 13) {
            return editval();
          }
        });
        return select;
      };
    }
  }]);

  return Tabulator;
}();