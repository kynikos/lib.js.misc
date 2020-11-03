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

var moment = require('moment');

function dir(root) {
  // https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/dir
  // https://docs.microsoft.com/en-us/windows/wsl/interop
  return spawnSync('/mnt/c/Windows/System32/cmd.exe', ['/c', 'dir', '/s', '/n', root]).stdout.toString('utf-8').split(/\r?\n/);
}

function matchDirectory(line) {
  return line.match(/^ Directory of ((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)/);
}

function matchDots(line) {
  return line.match(/^[0-9]{4}\x2D[0-9]{2}\x2D[0-9]{2} {2}[0-9]{2}:[0-9]{2} {4}<DIR> +\.{1,2}$/);
}

function matchSubdirectory(line) {
  return line.match(/^([0-9]{4}\x2D[0-9]{2}\x2D[0-9]{2} {2}[0-9]{2}:[0-9]{2}) {4}<DIR> +((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)/);
}

function matchFile(line) {
  return line.match(/^([0-9]{4}\x2D[0-9]{2}\x2D[0-9]{2} {2}[0-9]{2}:[0-9]{2}) +((?:[0-9]+,)*[0-9]+) ((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)/);
}

function matchStat(line) {
  return line.match(/^ +([0-9]+ (File|Dir)\(s\) +[,0-9]+ bytes( free)?|Total Files Listed:) */);
}

exports.dir2Json = function dir2Json(_ref) {
  var root = _ref.root,
      indent = _ref.indent;
  var lines = dir(root);
  var json = {
    commandStart: moment().toISOString()
  };
  var header1 = lines.shift();
  var header1match = header1.match(/^ Volume in drive ((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+) is ((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)$/);
  if (!header1match) throw new Error("Unknown header: ".concat(header1));
  json.driveLetter = header1match[1];
  json.volumeName = header1match[2];
  var header2prefix = ' Volume Serial Number is ';
  var header2 = lines.shift();
  if (!header2.startsWith(header2prefix)) throw new Error("Unknown header: ".concat(header2));
  json.volumeSN = header2.slice(header2prefix.length);
  json.tree = {};
  var currentSubdirectories = json.tree;
  var currentFiles;
  var match;

  var _iterator = _createForOfIteratorHelper(lines),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      if (!line) continue;
      match = matchDirectory(line);

      if (match) {
        var dirName = match[1];
        currentSubdirectories = json.tree;

        searchLoop: while (true) {
          for (var _i = 0, _Object$keys = Object.keys(currentSubdirectories); _i < _Object$keys.length; _i++) {
            var subDir = _Object$keys[_i];

            if (dirName.startsWith(subDir)) {
              // eslint-disable-line max-depth
              currentSubdirectories = currentSubdirectories[subDir][1];
              continue searchLoop;
            }
          }

          break;
        }

        var parentSubdirectories = currentSubdirectories;
        currentSubdirectories = {};
        currentFiles = [];
        parentSubdirectories[dirName] = [currentFiles, currentSubdirectories];
        continue;
      } // Test the dots *before* subdirectories


      match = matchDots(line);

      if (match) {
        continue;
      }

      match = matchSubdirectory(line);

      if (match) {
        // TODO[__uncategorized__]: This would be the natural way of having the simple folder names
        //       as keys instead of their full paths
        // currentSubdirectories[match[2]] = match.slice(1)
        continue;
      }

      match = matchFile(line);

      if (match) {
        currentFiles.push([match[3], moment(match[1], 'YYYY-MM-DD  HH:mm').format('YYYY-MM-DDTHH:mm'), parseInt(match[2].replace(/,/g, ''), 10)]);
        continue;
      }

      match = matchStat(line);

      if (match) {
        continue;
      }

      throw new Error("Unknown line: \"".concat(line, "\""));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  json.commandEnd = moment().toISOString();
  console.log(JSON.stringify(json, null, indent ? 2 : null));
};