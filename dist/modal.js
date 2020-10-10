"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// lib.cs.misc - Check the status of code repositories under a root directory.
// Copyright (C) 2016 Dario Giovannetti <dev@dariogiovannetti.net>
//
// This file is part of lib.cs.misc.
//
// lib.cs.misc is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// lib.cs.misc is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with lib.cs.misc.  If not, see <http://www.gnu.org/licenses/>.
var $ = require('jquery');

module.exports.Modal = /*#__PURE__*/function () {
  function Modal(header, content) {
    var _this = this;

    _classCallCheck(this, Modal);

    this.close = this.close.bind(this);
    this.closespan = $('<span class="close">').html('&times;').click(this.close);
    this.main = $('<div class="modal-root">') // This will make fadeIn() use display:flex instead of
    // display:block
    .css('display', 'flex').hide().append($('<div class="modal-window">').append(this.closespan, $('<div class="header">').append(header), // Ensure that the content is never too big for the viewport
    // Possibly give it max-width/height using vw/vh units
    $('<div class="content">').append(content))).appendTo('body').fadeIn();

    var externalclick = function externalclick(event) {
      if (event.target === _this.main[0]) {
        _this.close();

        $(window).off('click', externalclick);
      }
    };

    $(window).on('click', externalclick);
  }

  _createClass(Modal, [{
    key: "close",
    value: function close() {
      var _this2 = this;

      return this.main.fadeOut(function () {
        return _this2.main.remove();
      });
    }
  }]);

  return Modal;
}();