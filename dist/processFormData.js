"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
// Node.js doesn't have a built-in multipart/form-data parsing library
// Instead, we can use the 'busboy' library from NPM to parse these requests
// See also https://cloud.google.com/functions/docs/writing/http#multipart_data
// The peculiarity of this function is that it does not write the files
// temporarily to the file system (or /tmp), but it processes the streams as it
// reads them from the request body, and stores them in buffers. The advantage
// is that the buffers eventually are simply garbage-collected, so there's no
// need to ensure that the temporary files are deleted when the request ends
// (whether cleanly or with an error) to avoid memory leaks, which would be
// quite tricky to do safely.
// TODO: 'multer' would be an alternative, however as of November 2020 it cannot
// be used in Cloud Functions because the request object is preprocessed and its
// body is made available in request.rawBody
// See also https://github.com/googlearchive/cloud-functions-emulator/issues/167
// There is a PR to enable the functionality:
// https://github.com/expressjs/multer/pull/796
// https://www.npmjs.com/package/@duydatpham/multer
var Busboy = require('busboy');

function processFormData(_ref) {
  var headers = _ref.headers,
      body = _ref.body;
  return new Promise(function (resolve, reject) {
    var fields = {};
    var strings = [];
    var files = [];
    var busboy = new Busboy({
      headers: headers,
      preservePath: true
    });
    busboy.on('field', function (fieldName, value, fieldNameTruncated) {
      var field = fields[fieldName];

      if (!field) {
        field = [];
        fields[fieldName] = field;
      }

      field.push(value);
      strings.push({
        fieldName: fieldName,
        value: value,
        fieldNameTruncated: fieldNameTruncated
      });
    });
    busboy.on('file', function (fieldName, fileStream, fileName, transferEncoding, mimeType) // eslint-disable-next-line max-params
    {
      var fileChunks = [];
      fileStream.on('data', function (chunk) {
        fileChunks.push(chunk);
      });
      fileStream.on('error', reject);
      fileStream.on('end', function () {
        var fileData = {
          fileName: fileName,
          transferEncoding: transferEncoding,
          mimeType: mimeType,
          fileBuffer: Buffer.concat(fileChunks)
        };
        var field = fields[fieldName];

        if (!field) {
          field = [];
          fields[fieldName] = field;
        }

        field.push(fileData);
        files.push(_objectSpread({
          fieldName: fieldName
        }, fileData));
      });
    });
    busboy.on('finish', function () {
      resolve({
        fields: fields,
        strings: strings,
        files: files
      });
    });
    busboy.on('error', reject);
    busboy.end(body);
  });
}

exports.processFormData = processFormData;

function makeMiddleware(_x) {
  return _makeMiddleware.apply(this, arguments);
}

function _makeMiddleware() {
  _makeMiddleware = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
    var headers, body, request, next;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            headers = _ref2.headers, body = _ref2.body, request = _ref2.request, next = _ref2.next;
            _context.next = 3;
            return processFormData({
              headers: headers,
              body: body
            });

          case 3:
            request.formData = _context.sent;
            next();

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _makeMiddleware.apply(this, arguments);
}

exports.cloudFunctionsFormDataMiddleware = function cloudFunctionsFormDataMiddleware(request, response, next) {
  makeMiddleware({
    headers: request.headers,
    body: request.rawBody,
    request: request,
    next: next
  });
};