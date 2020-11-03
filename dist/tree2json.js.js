"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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

/* eslint-disable no-sync */
var _require = require('child_process'),
    spawnSync = _require.spawnSync;

function tree(root) {
  // https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/tree
  // https://docs.microsoft.com/en-us/windows/wsl/interop
  return spawnSync('/mnt/c/Windows/System32/tree.com', [root, '/a', '/f']).stdout.toString('utf-8').split(/\r?\n/);
}

function matchNonLastSubDirectory(lineEnd) {
  return lineEnd.match(/^\+\x2D\x2D\x2D((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)/);
}

function matchLastSubDirectory(lineEnd) {
  return lineEnd.match(/^\\\x2D\x2D\x2D((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)/);
}

function matchFile(lineEnd) {
  return lineEnd.match(/^[ \|] {3}((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)/);
}

function matchNonLastSubDirectoryEnd(lineEnd) {
  return lineEnd.match(/^\| {3}$/);
}

function matchLastSubDirectoryEnd(lineEnd) {
  return lineEnd.match(/^ {4}$/);
}

exports.tree2Json = function tree2Json(_ref) {
  var root = _ref.root;
  var lines = tree(root);
  var json = {};
  var header1prefix = 'Folder PATH listing for volume ';
  var header1 = lines.shift();
  if (!header1.startsWith(header1prefix)) throw new Error("Unknown header: ".concat(header1));
  json.volumeName = header1.slice(header1prefix.length);
  var header2prefix = 'Volume serial number is ';
  var header2 = lines.shift();
  if (!header2.startsWith(header2prefix)) throw new Error("Unknown header: ".concat(header2));
  json.volumeSN = header2.slice(header2prefix.length);
  json.rootPath = lines.shift();
  json.tree = [];
  var match;
  var currentAncestors = [];
  var currentIsLastSubDirectory = false;

  var _iterator = _createForOfIteratorHelper(lines),
      _step;

  try {
    linesLoop: for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;

      while (true) {
        var lineEnd = line.slice(currentAncestors.length * 4);
        match = matchNonLastSubDirectory(lineEnd);

        if (match) {
          currentAncestors.push(match[1]);
          currentIsLastSubDirectory = false;
          console.log(' NLASTDIR', line, '      ', currentAncestors.join('/'));
          continue linesLoop;
        }

        match = matchLastSubDirectory(lineEnd);

        if (match) {
          currentAncestors.push(match[1]);
          currentIsLastSubDirectory = true;
          console.log('  LASTDIR', line, '      ', currentAncestors.join('/'));
          continue linesLoop;
        }

        match = matchFile(lineEnd);

        if (match) {
          console.log('     FILE', line);
          continue linesLoop;
        }

        match = matchNonLastSubDirectoryEnd(lineEnd);

        if (match) {
          // if (currentIsLastSubDirectory) currentAncestors.pop()
          console.log('NLADIREND', line);
          continue linesLoop;
        }

        match = matchLastSubDirectoryEnd(lineEnd);

        if (match) {
          // currentAncestors.pop()
          // if (currentIsLastSubDirectory) currentAncestors.pop()
          console.log('LASDIREND', line);
          continue linesLoop;
        }

        if (currentAncestors.length) {
          currentAncestors.pop();
        } else {
          // TODO[__uncategorized__]: 'No subfolders exist '
          console.log('***UNK***', line);
          continue linesLoop;
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  console.log(json);
};