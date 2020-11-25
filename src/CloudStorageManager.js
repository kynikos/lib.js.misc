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

const path = require('path')


module.exports = function CloudStorageManager(
  firebaseAdminApp, bucketNamesMap,
) {
  const cStorage = firebaseAdminApp.storage()

  const buckets = {}
  const nameToBucket = {}

  for (const [refName, bucketName] of Object.entries(bucketNamesMap)) {
    const bucket = Bucket(cStorage, bucketName)
    buckets[refName] = bucket
    nameToBucket[bucketName] = bucket
  }

  return {
    buckets,
    nameToBucket,
  }
}


function Bucket(cStorage, name) {
  const csBucket = cStorage.bucket(name)

  return {
    name,
    async listDir(directory) {
      const [files] = await csBucket.getFiles({directory})
      return files.map((file) => file.metadata.name)
    },
    async readFile(filePath) {
      const file = csBucket.file(filePath)

      const [contentType, buffer] = await Promise.all([
        file.getMetadata().then(([metadata]) => {
          return metadata.contentType
        }),
        new Promise((resolve, reject) => {
          const fileStream = file.createReadStream()

          const fileChunks = []

          fileStream.on('data', (chunk) => {
            fileChunks.push(chunk)
          })
          fileStream.on('error', reject)
          fileStream.on('end', () => {
            resolve(Buffer.concat(fileChunks))
          })
        }),
      ])

      return {contentType, buffer}
    },
    async uploadFiles(
      files,
      {
        allowedExtensions,
        allowedMimeTypes,
        sizeLimit,
        adjust,
        allowOverwrite = false,
        validateOnly = false,
        allOrNothing = true,
      },
    ) {
      const promises1 = files.map(async ({
        fileName,
        transferEncoding,
        mimeType,
        fileBuffer,
      }, fileIndex) => {
        if (
          allowedExtensions != null &&
          !allowedExtensions.includes(path.extname(fileName))
        ) {
          const error = new Error(`File ${
            fileName} has an unexpected name extension; accepted: ${
            allowedExtensions.join(' | ')}`)

          if (allOrNothing) {
            throw error
          } else {
            return error
          }
        }

        if (
          allowedMimeTypes != null &&
          !allowedMimeTypes.includes(mimeType)
        ) {
          const error = new Error(`File ${
            fileName} has an unexpected MIME type (${
            mimeType}); accepted: ${allowedMimeTypes.join(' | ')}`)

          if (allOrNothing) {
            throw error
          } else {
            return error
          }
        }

        if (sizeLimit != null && fileBuffer.length > sizeLimit) {
          const error = new Error(`File ${
            fileName} exceeds size limit of ${fileBuffer.length} bytes`)

          if (allOrNothing) {
            throw error
          } else {
            return error
          }
        }

        // TODO: Allow explicitly setting the content type, and maybe also
        //       other metadata
        const {filePath} = adjust
          ? adjust({
            fileName,
            transferEncoding,
            mimeType,
            fileBuffer,
            fileIndex,
          })
          : {filePath: fileName}

        const csFile = csBucket.file(filePath)

        if (!allowOverwrite && (await csFile.exists())[0]) {
          const error = new Error(`File ${filePath} already exists`)

          if (allOrNothing) {
            throw error
          } else {
            return error
          }
        }

        if (validateOnly) return true

        const doUpload = () => {
          const writable = csFile.createWriteStream(
            // TODO: Allow explicitly setting the content type, and maybe also
            //       other metadata
            // {metadata: {contentType}}
          )

          return new Promise((resolve, reject) => {
            writable.on('finish', resolve)
            writable.on('error', reject)
            writable.end(fileBuffer)
          })
        }

        return allOrNothing ? doUpload : doUpload()
      })

      let promisesEnd

      if (!validateOnly && allOrNothing) {
        // Promise.all(promises1) may throw errors and break the function before
        // any file is uploaded, which is what I want in the allOrNothing case
        const doUploads = await Promise.all(promises1)
        promisesEnd = doUploads.map((doUpload) => doUpload())
      } else {
        promisesEnd = promises1
      }

      return Promise.all(promisesEnd)
    },
    deleteFiles(filePaths) {
      return Promise.all(filePaths.map((filePath) => {
        const csFile = csBucket.file(filePath)
        return csFile.delete()
      }))
    },
  }
}
