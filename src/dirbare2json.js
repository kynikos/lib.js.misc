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
const {spawnSync} = require('child_process')


function dirBare(root, directories = false) {
  return spawnSync(
    '/mnt/c/Windows/System32/cmd.exe',
    ['/c', 'dir', '/s', '/b', directories ? '/ad' : '/a-d', root],
  ).stdout.toString('utf-8').split(/\r?\n/u)
}


exports.dirbare2Json = function dirbare2Json({root}) {
  const directories = dirBare(root, true)
  const files = dirBare(root, false)

  console.log(directories)
  console.log(files)
}
