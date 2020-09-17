"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loader = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
var Loader = /*#__PURE__*/function () {
  function Loader(_ref) {
    var apiKey = _ref.apiKey,
        version = _ref.version,
        libraries = _ref.libraries;

    _classCallCheck(this, Loader);

    // https://developers.google.com/maps/documentation/javascript/overview
    this.polyfillSrc = 'https://polyfill.io/v3/polyfill.min.js?features=default';
    this.apiSrc = "https://maps.googleapis.com/maps/api/js?key=".concat(apiKey, "&libraries=").concat(libraries.join(','), "&v=").concat(version);
  } // BUG: @googlemaps/js-api-loader doesn't seem to support loading the map
  //    on child (popup) windows; the mouse events seem to come from the parent
  //    window
  //    Report the bug upstream


  _createClass(Loader, [{
    key: "load",
    value: function () {
      var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var _ref2$windowContext, windowContext, _ref2$polyfill, polyfill, loadScript;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref2$windowContext = _ref2.windowContext, windowContext = _ref2$windowContext === void 0 ? window : _ref2$windowContext, _ref2$polyfill = _ref2.polyfill, polyfill = _ref2$polyfill === void 0 ? false : _ref2$polyfill;

                if (!(windowContext.google && windowContext.google.maps)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", windowContext.google);

              case 3:
                loadScript = function loadScript(src) {
                  return new Promise(function (resolve, reject) {
                    var script = windowContext.document.createElement('script');

                    script.onload = function () {
                      resolve();
                    };

                    script.onerror = function (error) {
                      reject(error);
                    };

                    script.src = src;
                    windowContext.document.head.appendChild(script);
                  });
                };

                if (!polyfill) {
                  _context.next = 7;
                  break;
                }

                _context.next = 7;
                return loadScript(this.polyfillSrc);

              case 7:
                _context.next = 9;
                return loadScript(this.apiSrc);

              case 9:
                return _context.abrupt("return", windowContext.google);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load(_x) {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }]);

  return Loader;
}();

exports.Loader = Loader;