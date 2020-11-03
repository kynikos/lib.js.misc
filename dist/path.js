"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.win32 = exports.posix = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
var SEP_POSIX = '/';
var SEP_WIN32 = '\\';

function basename(sep, path, ext) {
  var base = path.slice(path.lastIndexOf(sep) + 1);

  if (ext) {
    var extIndex = path.lastIndexOf(ext);

    if (extIndex > -1) {
      base = base.slice(0, extIndex);
    }
  }

  return base;
}

function extname(sep, path) {
  var base = basename(sep, path);
  var dotIndex = base.lastIndexOf('.');
  if (dotIndex < 1) return '';
  return base.slice(dotIndex);
}

function make(sep) {
  return [basename, extname].reduce(function (acc, fn) {
    return function (args) {
      return fn.apply(void 0, [sep].concat(_toConsumableArray(args)));
    };
  });
}

var posix = make(SEP_POSIX);
exports.posix = posix;
var win32 = make(SEP_WIN32);
exports.win32 = win32;