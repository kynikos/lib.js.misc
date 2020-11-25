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

const Busboy = require('busboy')


function processFormData({headers, body}) {
  return new Promise((resolve, reject) => {
    const fields = {}
    const strings = []
    const files = []

    const busboy = new Busboy({headers, preservePath: true})

    busboy.on('field', (fieldName, value, fieldNameTruncated) => {
      let field = fields[fieldName]

      if (!field) {
        field = []
        fields[fieldName] = field
      }

      field.push(value)
      strings.push({fieldName, value, fieldNameTruncated})
    })

    busboy.on('file', (
      fieldName, fileStream, fileName, transferEncoding, mimeType,
    // eslint-disable-next-line max-params
    ) => {
      const fileChunks = []

      fileStream.on('data', (chunk) => {
        fileChunks.push(chunk)
      })
      fileStream.on('error', reject)
      fileStream.on('end', () => {
        const fileData = {
          fileName,
          transferEncoding,
          mimeType,
          fileBuffer: Buffer.concat(fileChunks),
        }
        let field = fields[fieldName]

        if (!field) {
          field = []
          fields[fieldName] = field
        }

        field.push(fileData)
        files.push({fieldName, ...fileData})
      })
    })

    busboy.on('finish', () => {
      resolve({fields, strings, files})
    })

    busboy.on('error', reject)

    busboy.end(body)
  })
}
exports.processFormData = processFormData


async function makeMiddleware({
  headers, body, request, next,
}) {
  request.formData = await processFormData({headers, body})
  next()
}


exports.cloudFunctionsFormDataMiddleware =
  function cloudFunctionsFormDataMiddleware(request, response, next) {
    makeMiddleware({
      headers: request.headers,
      body: request.rawBody,
      request,
      next,
    })
  }
