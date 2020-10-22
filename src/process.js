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

// BUG[build,upstream]: Webpack 5 doesn't define 'process' anymore, but some
//   libraries do rely on 'process' to be defined as a global variable
//   For example pbkdf2 (required by crypto?) raises
//   "Uncaught ReferenceError: process is not defined" when testing
//   process.browser
//   Other dependencies try to call process.cwd()

// Inspired by https://github.com/aleclarson/process-browserify

export const title = 'browser'
export const browser = true
export const argv = []
export const version = ''
export const versions = {}

function noop() {}

export const on = noop
export const addListener = noop
export const once = noop
export const off = noop
export const removeListener = noop
export const removeAllListeners = noop
export const emit = noop

export const env = {
  NODE_ENV: window.__DEV__ ? 'development' : 'production',
}

export const stdout = {
  isTTY: false,
}

export function binding(name) {
  throw new Error('process.binding is not supported')
}

export function cwd() {
  return '/'
}

export function chdir(dir) {
  throw new Error('process.chdir is not supported')
}

export function umask() {
  return 0
}
