"use strict";

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen["return"] !== "function") { this["return"] = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype["throw"] = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype["return"] = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

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
exports.streamToGenerator = /*#__PURE__*/function () {
  var _streamToGenerator = _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stream) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            throw new Error('Not implemented');

          case 2:
            if (!true) {
              _context.next = 13;
              break;
            }

            _context.prev = 3;
            _context.next = 6;
            return new Promise(function (resolve, reject) {
              stream.once('data', function (data) {
                // If I don't remove the 'end' and 'error' listeners, Node will raise
                // MaxListenersExceededWarning
                stream.off('end', reject);
                stream.off('error', reject);
                resolve(data);
              });
              stream.once('end', reject);
              stream.once('error', reject);
            });

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("break", 13);

          case 11:
            _context.next = 2;
            break;

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 8]]);
  }));

  function streamToGenerator(_x) {
    return _streamToGenerator.apply(this, arguments);
  }

  return streamToGenerator;
}();