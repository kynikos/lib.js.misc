# lib.cs.misc - Check the status of code repositories under a root directory.
# Copyright (C) 2016 Dario Giovannetti <dev@dariogiovannetti.net>
#
# This file is part of lib.cs.misc.
#
# lib.cs.misc is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# lib.cs.misc is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with lib.cs.misc.  If not, see <http://www.gnu.org/licenses/>.

# TODO: See also:
#       * https://github.com/queckezz/elementx
#       * https://github.com/Raynos/mercury
#       * https://github.com/hyperapp/hyperapp

hyperscript = require('hyperscript')
hyperscript_helpers = require('hyperscript-helpers')(hyperscript)
# I don't want the hyperscript-helpers tags to be lowercase
# TODO: Propose upstream? https://github.com/ohanhi/hyperscript-helpers
module.exports.hyperscript = ( ->
    exported = {}
    for tag in hyperscript_helpers.TAG_NAMES
        exported[tag.charAt(0).toUpperCase() + tag.slice(1)] =
            hyperscript_helpers[tag]
    return exported
)()


# Originally adpatded from https://stackoverflow.com/a/40075864
# Usage example:
#     div = t.div([
#         t.span(
#             ["Hello ", t.b("world!")],
#             {style: {background: "red"}}
#         )
#     ])
module.exports.createElement = new Proxy({}, {
    get: (target, property, receiver) ->
        return (children, attrs = {}) ->
            el = document.createElement(property)
            for attr, val of attrs
                # TODO: Support 'style' attribute or is it overkill here?
                # if attr is 'style' and typeof val isnt "string"
                #     stylerules = ""
                #     for cssp, cssv of val
                #         stylerules += cssp + ":" + cssv + ";"
                #     el.setAttribute(attr, stylerules)
                # else
                # 	el.setAttribute(attr, val)
                el.setAttribute(attr, val)

            for child in (if Array.isArray(children) \
                    then children else [children])
                el.appendChild(if typeof child is "string" \
                    then document.createTextNode(child) else child)

            return el
})
