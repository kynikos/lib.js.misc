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
// 'multer' doesn't work in Cloud Functions
// https://stackoverflow.com/a/47319614/645498
// const multer = require('multer')
var Busboy = require('busboy');

module.exports.iterateFormData = function iterateFormData(req, handleFile) {
  return new Promise(function (resolve, reject) {
    // https://www.npmjs.com/package/busboy
    var busboy = new Busboy({
      headers: req.headers
    });
    busboy.on('file', function (fieldName, stream, fileName, transferEncoding, mimeType) {
      handleFile({
        fieldName: fieldName,
        stream: stream,
        fileName: fileName,
        transferEncoding: transferEncoding,
        mimeType: mimeType
      });
    });
    busboy.on('finish', function () {
      resolve();
    });
    busboy.end(req.rawBody);
  });
};