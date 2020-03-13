"use strict";

// Generated by CoffeeScript 2.5.1
// JavaScript auxiliary library
// Copyright (C) 2012 Dario Giovannetti <dev@dariogiovannetti.net>
// This file is part of JavaScript auxiliary library.
// JavaScript auxiliary library is free software: you can redistribute it
// and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation, either version 3
// of the License, or (at your option) any later version.
// JavaScript auxiliary library is distributed in the hope that it will be
// useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with JavaScript auxiliary library.
// If not, see <http://www.gnu.org/licenses/>.
module.exports.executeAsync = function (functions, id) {
  var _this = this;

  var callContinue, fid;
  id++;

  if (functions[id]) {
    fid = functions[id];

    callContinue = function callContinue() {
      return _this.executeAsync(functions, id);
    };

    return fid[0](fid[1], callContinue);
  }
};

module.exports.recurseTreeAsync = function (params) {
  var parent; // params = {
  //   node: ,
  //   parentIndex: ,
  //   siblingIndex: ,
  //   ancestors: ,
  //   children: ,
  //   callChildren: ,
  //   callNode: ,
  //   callEnd: ,
  //   callArgs: ,
  //   stage: ,
  //   nodesList:
  // }
  // nodesList: [
  //   {
  //     node: ,
  //     parentIndex: ,
  //     siblingIndex: ,
  //     ancestors: [...],
  //     children: [...]
  //   },
  //   {...}
  // ]
  // Example:
  // recurseTreeAsync({
  //   node: ,
  //   callChildren: ,
  //   callNode: ,
  //   callEnd: ,
  //   callArgs:
  // });
  // callChildren(params) {
  //   params.children = ;
  //   recurseTreeAsync(params);
  // }
  // callNode(params) {
  //   recurseTreeAsync(params);
  // }
  // callEnd(params) {}

  switch (params.stage) {
    case void 0:
      params.parentIndex = null;
      params.siblingIndex = 0;
      params.ancestors = [];
      params.children = [];
      params.nodesList = [];
      params.stage = 1;
      return this.recurseTreeAsync(params);

    case 1:
      params.stage = 2; // Prevent infinite loops

      if (params.ancestors.indexOf(params.node) === -1) {
        return params.callChildren(params);
      } else {
        params.children = "loop";
        return this.recurseTreeAsync(params);
      }

      break;

    case 2:
      params.nodesList.push({
        node: params.node,
        parentIndex: params.parentIndex,
        siblingIndex: params.siblingIndex,
        ancestors: params.ancestors.slice(0),
        children: params.children.slice(0)
      });
      params.stage = 3;
      return params.callNode(params);

    case 3:
      if (params.children.length && params.children !== "loop") {
        // Go to the first child
        params.ancestors.push(params.node);
        params.node = params.children[0];
        params.parentIndex = params.nodesList.length - 1;
        params.siblingIndex = 0;
        params.children = [];
        params.stage = 1;
        return this.recurseTreeAsync(params);
      } else if (params.parentIndex !== null) {
        // Go to the next sibling
        parent = params.nodesList[params.parentIndex];
        params.siblingIndex++;
        params.node = parent.children[params.siblingIndex];
        params.children = [];

        if (params.node) {
          params.stage = 1;
        } else {
          // There are no more siblings
          params.node = parent.node;
          params.parentIndex = parent.parentIndex;
          params.siblingIndex = parent.siblingIndex;
          params.ancestors = parent.ancestors.slice(0);
          params.stage = 3;
        }

        return this.recurseTreeAsync(params);
      } else {
        // End of recursion
        return params.callEnd(params);
      }

  }
};