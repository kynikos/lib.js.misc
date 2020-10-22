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

const SEP_POSIX = '/'
const SEP_WIN32 = '\\'


function basename(sep, path, ext) {
  let base = path.slice(path.lastIndexOf(sep) + 1)

  if (ext) {
    const extIndex = path.lastIndexOf(ext)

    if (extIndex > -1) {
      base = base.slice(0, extIndex)
    }
  }

  return base
}


function extname(sep, path) {
  const base = basename(sep, path)
  const dotIndex = base.lastIndexOf('.')

  if (dotIndex < 1) return ''

  return base.slice(dotIndex)
}


function make(sep) {
  return [
    basename,
    extname,
  ].reduce((acc, fn) => (args) => fn(sep, ...args))
}


export const posix = make(SEP_POSIX)
export const win32 = make(SEP_WIN32)
