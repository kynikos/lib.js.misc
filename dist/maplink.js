"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extjQuery = extjQuery;
exports.geoMapHref = geoMapHref;

// lib.cs.misc - Check the status of code repositories under a root directory.
// Copyright (C) 2016 Dario Giovannetti <dev@dariogiovannetti.net>
//
// This file is part of lib.cs.misc.
//
// lib.cs.misc is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// lib.cs.misc is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with lib.cs.misc.  If not, see <http://www.gnu.org/licenses/>.
function geoMapHref(link) {
  var coords = link.getAttribute('data-geomap-coordinates') || '0,0';
  var query = link.getAttribute('data-geomap-query') || '';

  if (window.navigator.platform.match(/iPad|iPhone|iPod/i) === null) {
    link.setAttribute('href', "geo:".concat(coords, "?q=").concat(query || coords));
  } else {
    // TODO: The "geo:" URI scheme doesn't work on Safari yet
    // Yes, apparently putting the coordinates in place
    // of 0,0 doesn't work...
    link.setAttribute('href', "maps:0,0?q=".concat(query || coords));
  }

  return link;
}

function extjQuery($) {
  $.fn.geoMapHref = function () {
    return this.each(function () {
      return $(geoMapHref(this));
    });
  };
}