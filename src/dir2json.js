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
import moment from 'moment'


function dir(root) {
  // https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/dir
  // https://docs.microsoft.com/en-us/windows/wsl/interop
  return spawnSync(
    '/mnt/c/Windows/System32/cmd.exe',
    ['/c', 'dir', '/s', '/n', root],
  ).stdout.toString('utf-8').split(/\r?\n/u)
}


function matchDirectory(line) {
  return line.match(/^ Directory of (.+)/u)
}


function matchDots(line) {
  return line.match(/^\d{4}-\d{2}-\d{2} {2}\d{2}:\d{2} {4}<DIR> +\.{1,2}$/u)
}


function matchSubdirectory(line) {
  return line.match(/^(\d{4}-\d{2}-\d{2} {2}\d{2}:\d{2}) {4}<DIR> +(.+)/u)
}


function matchFile(line) {
  return line.match(/^(\d{4}-\d{2}-\d{2} {2}\d{2}:\d{2}) +((?:\d+,)*\d+) (.+)/u)
}


function matchStat(line) {
  return line.match(/^ +(\d+ (File|Dir)\(s\) +[,0-9]+ bytes( free)?|Total Files Listed:) */u)
}


export function dir2Json({root, indent}) {
  const lines = dir(root)
  const json = {commandStart: moment().toISOString()}

  const header1 = lines.shift()
  const header1match = header1.match(/^ Volume in drive (.+) is (.+)$/u)
  if (!header1match) throw new Error(`Unknown header: ${header1}`)
  json.driveLetter = header1match[1]
  json.volumeName = header1match[2]

  const header2prefix = ' Volume Serial Number is '
  const header2 = lines.shift()
  if (!header2.startsWith(header2prefix)) throw new Error(`Unknown header: ${header2}`)
  json.volumeSN = header2.slice(header2prefix.length)

  json.tree = {}
  let currentSubdirectories = json.tree
  let currentFiles
  let match

  for (const line of lines) {
    if (!line) continue

    match = matchDirectory(line)
    if (match) {
      const dirName = match[1]
      currentSubdirectories = json.tree

      searchLoop:
      while (true) {
        for (const subDir of Object.keys(currentSubdirectories)) {
          if (dirName.startsWith(subDir)) { // eslint-disable-line max-depth
            currentSubdirectories = currentSubdirectories[subDir][1]
            continue searchLoop
          }
        }
        break
      }

      const parentSubdirectories = currentSubdirectories
      currentSubdirectories = {}
      currentFiles = []
      parentSubdirectories[dirName] = [currentFiles, currentSubdirectories]

      continue
    }

    // Test the dots *before* subdirectories
    match = matchDots(line)
    if (match) {
      continue
    }

    match = matchSubdirectory(line)
    if (match) {
      // TODO[__uncategorized__]: This would be the natural way of having the simple folder names
      //       as keys instead of their full paths
      // currentSubdirectories[match[2]] = match.slice(1)
      continue
    }

    match = matchFile(line)
    if (match) {
      currentFiles.push([
        match[3],
        moment(match[1], 'YYYY-MM-DD  HH:mm').format('YYYY-MM-DDTHH:mm'),
        parseInt(match[2].replace(/,/gu, ''), 10),
      ])
      continue
    }

    match = matchStat(line)
    if (match) {
      continue
    }

    throw new Error(`Unknown line: "${line}"`)
  }

  json.commandEnd = moment().toISOString()

  console.log(JSON.stringify(json, null, indent ? 2 : null))
}
