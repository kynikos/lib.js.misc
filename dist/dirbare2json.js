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

/* eslint-disable no-sync */
var _require = require('child_process'),
    spawnSync = _require.spawnSync;

function dirBare(root) {
  var directories = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return spawnSync('/mnt/c/Windows/System32/cmd.exe', ['/c', 'dir', '/s', '/b', directories ? '/ad' : '/a-d', root]).stdout.toString('utf-8').split(/\r?\n/);
}

exports.dirbare2Json = function dirbare2Json(_ref) {
  var root = _ref.root;
  var directories = dirBare(root, true);
  var files = dirBare(root, false);
  console.log(directories);
  console.log(files);
};