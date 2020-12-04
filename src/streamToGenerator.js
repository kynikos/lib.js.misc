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


exports.streamToGenerator = async function *streamToGenerator(stream) {
  // BUG: This implementation does not listen to all 'data' events, i.e. an
  //      amount of data is always lost
  throw new Error('Not implemented')

  stream.on('error', (error) => {
    throw error
  })

  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      yield await new Promise((resolve, reject) => {
        stream.once('data', (data) => {
          // If I don't remove the 'end' and 'error' listeners, Node will raise
          // MaxListenersExceededWarning
          stream.off('end', reject)
          stream.off('error', reject)
          resolve(data)
        })
        stream.once('end', reject)
        stream.once('error', reject)
      })
    } catch (error) {
      // Don't worry, the 'error' event is also handled above the loop
      break
    }
  }
}
