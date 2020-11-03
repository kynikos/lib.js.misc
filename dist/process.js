"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.binding = binding;
exports.cwd = cwd;
exports.chdir = chdir;
exports.umask = umask;
exports.stdout = exports.env = exports.emit = exports.removeAllListeners = exports.removeListener = exports.off = exports.once = exports.addListener = exports.on = exports.versions = exports.version = exports.argv = exports.browser = exports.title = void 0;
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
var title = 'browser';
exports.title = title;
var browser = true;
exports.browser = browser;
var argv = [];
exports.argv = argv;
var version = '';
exports.version = version;
var versions = {};
exports.versions = versions;

function noop() {}

var on = noop;
exports.on = on;
var addListener = noop;
exports.addListener = addListener;
var once = noop;
exports.once = once;
var off = noop;
exports.off = off;
var removeListener = noop;
exports.removeListener = removeListener;
var removeAllListeners = noop;
exports.removeAllListeners = removeAllListeners;
var emit = noop;
exports.emit = emit;
var env = {
  NODE_ENV: window.__DEV__ ? 'development' : 'production'
};
exports.env = env;
var stdout = {
  isTTY: false
};
exports.stdout = stdout;

function binding(name) {
  throw new Error('process.binding is not supported');
}

function cwd() {
  return '/';
}

function chdir(dir) {
  throw new Error('process.chdir is not supported');
}

function umask() {
  return 0;
}