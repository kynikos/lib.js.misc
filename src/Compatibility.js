/*
 *  JavaScript auxiliary library
 *  Copyright (C) 2012-2014 Dario Giovannetti <dev@dariogiovannetti.net>
 *
 *  This file is part of JavaScript auxiliary library.
 *
 *  JavaScript auxiliary library is free software: you can redistribute it
 *  and/or modify it under the terms of the GNU General Public License
 *  as published by the Free Software Foundation, either version 3
 *  of the License, or (at your option) any later version.
 *
 *  JavaScript auxiliary library is distributed in the hope that it will be
 *  useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with JavaScript auxiliary library.
 *  If not, see <http://www.gnu.org/licenses/>.
 */

if (!Alib) var Alib = {};

Alib.Compatibility = new function () {
    this.normalizeCarriageReturns = function (source) {
        // Opera and IE use \r\n instead of \n
        return source.replace(/\r\n/g, '\n');
    };
};
