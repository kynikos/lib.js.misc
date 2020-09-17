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


export class Loader {
  constructor({apiKey, version, libraries}) {
    // https://developers.google.com/maps/documentation/javascript/overview
    this.polyfillSrc = 'https://polyfill.io/v3/polyfill.min.js?features=default'
    this.apiSrc = `https://maps.googleapis.com/maps/api/js?key=${
      apiKey}&libraries=${libraries.join(',')}&v=${version}`
  }

  // BUG: @googlemaps/js-api-loader doesn't seem to support loading the map
  //    on child (popup) windows; the mouse events seem to come from the parent
  //    window
  //    Report the bug upstream
  async load({windowContext = window, polyfill = false}) {
    if (windowContext.google && windowContext.google.maps) {
      return windowContext.google
    }

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = windowContext.document.createElement('script')

        script.onload = () => {
          resolve()
        }
        script.onerror = (error) => {
          reject(error)
        }
        script.src = src

        windowContext.document.head.appendChild(script)
      })
    }

    if (polyfill) {
      await loadScript(this.polyfillSrc)
    }

    await loadScript(this.apiSrc)

    return windowContext.google
  }
}
