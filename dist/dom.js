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
var $, error;

try {
  $ = require('jquery');
} catch (error1) {
  error = error1;
  $ = null;
}

module.exports.getPreviousElementSibling = function (node) {
  while (node.previousSibling.nodeType !== 1) {
    node = node.previousSibling;
  }

  return node.previousSibling;
};

module.exports.getNextElementSibling = function (node) {
  while (node.nextSibling.nodeType !== 1) {
    node = node.nextSibling;
  }

  return node.nextSibling;
};

module.exports.getFirstElementChild = function (node) {
  if (node.firstChild.nodeType === 1) {
    return node.firstChild;
  } else {
    return module.exports.getNextElementSibling(node.firstChild);
  }
};

module.exports.getLastElementChild = function (node) {
  if (node.lastChild.nodeType === 1) {
    return node.lastChild;
  } else {
    return module.exports.getPreviousElementSibling(node.lastChild);
  }
};

module.exports.getChildElements = function (node) {
  var child, children, j, len, list;
  list = element.childNodes;
  children = [];

  for (j = 0, len = list.length; j < len; j++) {
    child = list[j];

    if (child.nodeType === 1) {
      children.push(child);
    }
  }

  return children;
};

module.exports.getChildrenByTagName = function (element, tag) {
  var child, children, j, len, list, localName;
  list = element.childNodes;
  children = [];

  for (j = 0, len = list.length; j < len; j++) {
    child = list[j];
    localName = child.localName;

    if (localName && localName.toLowerCase() === tag.toLowerCase()) {
      children.push(child);
    }
  }

  return children;
};

module.exports.isDescendantOf = function (descendant, ancestor, identity) {
  var response;
  response = false;

  if (identity && descendant.isSameNode(ancestor)) {
    response = true;
  } else {
    while (descendant !== document.body) {
      if (descendant.parentNode.isSameNode(ancestor)) {
        response = true;
        break;
      }

      descendant = descendant.parentNode;
    }
  }

  return response;
};

module.exports.getSiblingPositionByTagName = function (element) {
  var i, siblings;
  i = 0;
  siblings = module.exports.getChildrenByTagName(element.parentNode, element.localName);

  while (!siblings[i].isSameNode(element)) {
    i++;
  }

  if (i < siblings.length) {
    return i;
  } else {
    return -1;
  }
};

module.exports.getLongTextNode = function (element) {
  var child, j, len, nodes, text; // Firefox and other browsers split long text into multiple text nodes

  text = "";
  nodes = element.childNodes;

  for (j = 0, len = nodes.length; j < len; j++) {
    child = nodes[j];

    if (child.nodeType === 3) {
      text += child.nodeValue;
    }
  }

  return text;
};

if ($) {
  // TODO: turn into a jQuery plugin
  module.exports.waitUntilJQuerySelectorMatches = function (selector, handler, args, interval) {
    var _recurse;

    _recurse = function recurse() {
      if ($(selector)[0]) {
        return handler(args);
      } else {
        return setTimeout(_recurse, interval);
      }
    };

    return _recurse();
  };
}