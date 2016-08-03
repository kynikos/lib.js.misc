# JavaScript auxiliary library
# Copyright (C) 2012 Dario Giovannetti <dev@dariogiovannetti.net>
#
# This file is part of JavaScript auxiliary library.
#
# JavaScript auxiliary library is free software: you can redistribute it
# and/or modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation, either version 3
# of the License, or (at your option) any later version.
#
# JavaScript auxiliary library is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with JavaScript auxiliary library.
# If not, see <http://www.gnu.org/licenses/>.


module.exports.getPreviousElementSibling = (node) ->
    while node.previousSibling.nodeType != 1
        node = node.previousSibling
    return node.previousSibling

module.exports.getNextElementSibling = (node) ->
    while node.nextSibling.nodeType != 1
        node = node.nextSibling
    return node.nextSibling

module.exports.getFirstElementChild = (node) ->
    if node.firstChild.nodeType == 1
        return node.firstChild
    else
        return module.exports.getNextElementSibling(node.firstChild)

module.exports.getLastElementChild = (node) ->
    if node.lastChild.nodeType == 1
        return node.lastChild
    else
        return module.exports.getPreviousElementSibling(node.lastChild)

module.exports.getChildElements = (node) ->
    list = element.childNodes
    children = []
    for child in list
        if child.nodeType == 1
            children.push(child)
    return children

module.exports.getChildrenByTagName = (element, tag) ->
    list = element.childNodes
    children = []
    for child in list
        localName = child.localName
        if localName and localName.toLowerCase() == tag.toLowerCase()
            children.push(child)
    return children

module.exports.isDescendantOf = (descendant, ancestor, identity) ->
    response = false
    if identity and descendant.isSameNode(ancestor)
        response = true
    else
        while descendant != document.body
            if descendant.parentNode.isSameNode(ancestor)
                response = true
                break
            descendant = descendant.parentNode
    return response

module.exports.getSiblingPositionByTagName = (element) ->
    i = 0
    siblings = module.exports.getChildrenByTagName(element.parentNode, element.localName)
    while not siblings[i].isSameNode(element)
        i++
    return if i < siblings.length then i else -1

module.exports.getLongTextNode = (element) ->
    # Firefox and other browsers split long text into multiple text nodes
    text = ""
    nodes = element.childNodes
    for child in nodes
        if child.nodeType == 3
            text += child.nodeValue
    return text

module.exports.waitUntilJQuerySelectorMatches = (selector, handler, args, interval) ->
    # TODO: turn into a jQuery plugin
    $ = require('jquery')
    recurse = ->
        if $(selector)[0]
            handler(args)
        else
            setTimeout(recurse, interval)
    recurse()
