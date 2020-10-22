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
import {spawnSync} from 'child_process'


function tree(root) {
  // https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/tree
  // https://docs.microsoft.com/en-us/windows/wsl/interop
  return spawnSync(
    '/mnt/c/Windows/System32/tree.com',
    [root, '/a', '/f'],
  ).stdout.toString('utf-8').split(/\r?\n/u)
}


function matchNonLastSubDirectory(lineEnd) {
  return lineEnd.match(/^\+---(.+)/u)
}


function matchLastSubDirectory(lineEnd) {
  return lineEnd.match(/^\\---(.+)/u)
}


function matchFile(lineEnd) {
  return lineEnd.match(/^[| ] {3}(.+)/u)
}


function matchNonLastSubDirectoryEnd(lineEnd) {
  return lineEnd.match(/^\| {3}$/u)
}


function matchLastSubDirectoryEnd(lineEnd) {
  return lineEnd.match(/^ {4}$/u)
}


export function tree2Json({root}) {
  const lines = tree(root)
  const json = {}

  const header1prefix = 'Folder PATH listing for volume '
  const header1 = lines.shift()
  if (!header1.startsWith(header1prefix)) throw new Error(`Unknown header: ${header1}`)
  json.volumeName = header1.slice(header1prefix.length)

  const header2prefix = 'Volume serial number is '
  const header2 = lines.shift()
  if (!header2.startsWith(header2prefix)) throw new Error(`Unknown header: ${header2}`)
  json.volumeSN = header2.slice(header2prefix.length)

  json.rootPath = lines.shift()

  json.tree = []
  let match
  const currentAncestors = []
  let currentIsLastSubDirectory = false

  linesLoop:
  for (const line of lines) {
    while (true) {
      const lineEnd = line.slice(currentAncestors.length * 4)

      match = matchNonLastSubDirectory(lineEnd)
      if (match) {
        currentAncestors.push(match[1])
        currentIsLastSubDirectory = false
        console.log(' NLASTDIR', line, '      ', currentAncestors.join('/'))
        continue linesLoop
      }

      match = matchLastSubDirectory(lineEnd)
      if (match) {
        currentAncestors.push(match[1])
        currentIsLastSubDirectory = true
        console.log('  LASTDIR', line, '      ', currentAncestors.join('/'))
        continue linesLoop
      }

      match = matchFile(lineEnd)
      if (match) {
        console.log('     FILE', line)
        continue linesLoop
      }

      match = matchNonLastSubDirectoryEnd(lineEnd)
      if (match) {
        // if (currentIsLastSubDirectory) currentAncestors.pop()
        console.log('NLADIREND', line)
        continue linesLoop
      }

      match = matchLastSubDirectoryEnd(lineEnd)
      if (match) {
        // currentAncestors.pop()
        // if (currentIsLastSubDirectory) currentAncestors.pop()
        console.log('LASDIREND', line)
        continue linesLoop
      }

      if (currentAncestors.length) {
        currentAncestors.pop()
      } else {
        // TODO[__uncategorized__]: 'No subfolders exist '
        console.log('***UNK***', line)
        continue linesLoop
      }
    }
  }

  console.log(json)
}
