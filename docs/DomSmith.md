# DomSmith Docs

<a name="module_DomSmith"></a>

## DomSmith

Creates a new DomSmith instance.

**Version**: 2.1.0
**Author**: Frank Kudermann - alphanull
**License**: MIT

| Param | Type | Description |
| --- | --- | --- |
| nodeDef | [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition) \| <code>string</code> | Node definition. Can be an object, a string, or an array of definitions. |
| [options] | <code>HTMLElement</code> \| [<code>Options</code>](#module_DomSmith..Options) | Either a target HTMLElement or an options object. |

* [DomSmith](#module_DomSmith)
  * _instance_
    * [._mountContext](#module_DomSmith+_mountContext) : <code>Object</code> ℗
      * [.parent](#module_DomSmith+_mountContext.parent) : <code>HTMLElement</code> ℗
    * [._refs](#module_DomSmith+_refs) : <code>WeakMap</code> ℗
    * [._events](#module_DomSmith+_events) : <code>WeakMap.&lt;HTMLElement, Object&gt;</code> ℗
    * [._dom](#module_DomSmith+_dom) : [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition) ℗
    * [.mount([options])](#module_DomSmith+mount)
    * [.unmount()](#module_DomSmith+unmount)
    * [.addNode(nodeDefArg, [parent])](#module_DomSmith+addNode) ⇒ [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition)
    * [.replaceNode(ref, replaceDef)](#module_DomSmith+replaceNode)
    * [.removeNode([nodeDefArg])](#module_DomSmith+removeNode) ⇒ [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition)
    * [.addEvent(eleOrRef, eventName, handler)](#module_DomSmith+addEvent)
    * [.removeEvent(eleOrRef, [eventName], [handler])](#module_DomSmith+removeEvent)
    * ~~[.teardown()](#module_DomSmith+teardown)~~
    * [.destroy()](#module_DomSmith+destroy)
  * _static_
    * [.getSupportedDomEvents([ele])](#module_DomSmith.getSupportedDomEvents) ⇒ <code>Array.&lt;string&gt;</code> ℗
    * [.registerPlugin(plugin, [options])](#module_DomSmith.registerPlugin)
  * _inner_
    * [~NodeDefinition](#module_DomSmith..NodeDefinition) : <code>Object</code>
    * [~Options](#module_DomSmith..Options) : <code>Object</code>

* * *

<a name="module_DomSmith+_mountContext"></a>

### domSmith.\_mountContext : <code>Object</code> ℗

Stores mount information like target node, insertMode type, parent, and next sibling.

**Kind**: instance property of [<code>DomSmith</code>](#module_DomSmith)
**Access**: private

* * *

<a name="module_DomSmith+_mountContext.parent"></a>

#### _mountContext.parent : <code>HTMLElement</code> ℗

The parent DOM element where the constructed DOM tree is mounted.

**Kind**: static property of [<code>\_mountContext</code>](#module_DomSmith+_mountContext)
**Access**: private

* * *

<a name="module_DomSmith+_refs"></a>

### domSmith.\_refs : <code>WeakMap</code> ℗

Stores additional node data for cleanup.

**Kind**: instance property of [<code>DomSmith</code>](#module_DomSmith)
**Access**: private

* * *

<a name="module_DomSmith+_events"></a>

### domSmith.\_events : <code>WeakMap.&lt;HTMLElement, Object&gt;</code> ℗

Central repository for event listeners.

**Kind**: instance property of [<code>DomSmith</code>](#module_DomSmith)
**Access**: private

* * *

<a name="module_DomSmith+_dom"></a>

### domSmith.\_dom : [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition) ℗

The root node definition or an array of node definitions.

**Kind**: instance property of [<code>DomSmith</code>](#module_DomSmith)
**Access**: private

* * *

<a name="module_DomSmith+mount"></a>

### domSmith.mount([options])

Mounts the created DOM element(s) into the specified location.
Supports insertModes: 'append' (default), 'before', 'replace' and 'top.
If called after unmount() without arguments, reuses the original location.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)
**Throws**:

* <code>Error</code> If injection node was not found.

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>HTMLElement</code> \| <code>HTMLElement</code> \| [<code>Options</code>](#module_DomSmith..Options) | Either a target HTMLElement or an options object. |

* * *

<a name="module_DomSmith+unmount"></a>

### domSmith.unmount()

Unmounts the created DOM element(s) from their parent node.
For multiple nodes, each child element is removed individually.
Also stores the original parent and nextSibling for potential re-mounting.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)

* * *

<a name="module_DomSmith+addNode"></a>

### domSmith.addNode(nodeDefArg, [parent]) ⇒ [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition)

Adds a DOM node based on a declarative definition.
Supports string, object, or an array of node definitions.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)
**Returns**: [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition) - A node definition object or an array of such objects.
**Throws**:

* <code>Error</code> If trying to add a duplicate ref or a property was not found.

| Param | Type | Description |
| --- | --- | --- |
| nodeDefArg | [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) | Node definition or an array of definitions. |
| [parent] | <code>Object</code> | Parent object (synthetic) to assign to the newly created node. |

* * *

<a name="module_DomSmith+replaceNode"></a>

### domSmith.replaceNode(ref, replaceDef)

Replaces an existing DOM node (specified by its ref) with a new node definition.
This method first removes all events from the old node, then replaces it in the DOM.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)
**Throws**:

* <code>Error</code> If an invalid ref was used.

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>string</code> | Reference name of the node to be replaced. |
| replaceDef | [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) | The new node definition to replace the old node. |

* * *

<a name="module_DomSmith+removeNode"></a>

### domSmith.removeNode([nodeDefArg]) ⇒ [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition)

Removes all events and references associated with a DOM node.
If the passed node definition is an array, iterates through each element.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)
**Returns**: [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition) - The - possibly modified - node definition(s).

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [nodeDefArg] | [<code>NodeDefinition</code>](#module_DomSmith..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition) | <code>this._dom</code> | The node definition(s) from which to remove events. |

* * *

<a name="module_DomSmith+addEvent"></a>

### domSmith.addEvent(eleOrRef, eventName, handler)

Adds an event listener to the specified element and registers it in the central events repository.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)
**Throws**:

* <code>Error</code> If element was not found, or handler is not a function.

| Param | Type | Description |
| --- | --- | --- |
| eleOrRef | <code>HTMLElement</code> \| <code>string</code> | Target DOM element or ref. |
| eventName | <code>string</code> | Event name (e.g., 'click'). |
| handler | <code>function</code> \| <code>Array.&lt;function()&gt;</code> | Event handler(s) to add. |

* * *

<a name="module_DomSmith+removeEvent"></a>

### domSmith.removeEvent(eleOrRef, [eventName], [handler])

Removes event listener(s) from the specified element.
If no eventName and handler are provided, all event listeners for that element are removed.
If an eventName is provided but no handler, then all handlers for that event are removed.
Otherwise, only the specified handler for the given eventName is removed.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)
**Throws**:

* <code>Error</code> If element or ref was not found.

| Param | Type | Description |
| --- | --- | --- |
| eleOrRef | <code>HTMLElement</code> \| <code>string</code> | Target DOM element or ref. |
| [eventName] | <code>string</code> | Event name (e.g., 'click'). |
| [handler] | <code>function</code> | Event handler to remove. |

* * *

<a name="module_DomSmith+teardown"></a>

### ~~domSmith.teardown()~~

***Since version 2.1.0.**_

Cleans up all resources: removes all events, unmounts the DOM nodes, and clears all references.
DEPRECATED, alias for `destroy()`.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)

* * *

<a name="module_DomSmith+destroy"></a>

### domSmith.destroy()

Cleans up all resources: removes all events, unmounts the DOM nodes, and clears all references.

**Kind**: instance method of [<code>DomSmith</code>](#module_DomSmith)
**Since**: 2.1.0

* * *

<a name="module_DomSmith.getSupportedDomEvents"></a>

### DomSmith.getSupportedDomEvents([ele]) ⇒ <code>Array.&lt;string&gt;</code> ℗

Returns an array of supported DOM event names for the given tag.

**Kind**: static method of [<code>DomSmith</code>](#module_DomSmith)
**Returns**: <code>Array.&lt;string&gt;</code> - Sorted array of event names.
**Access**: private

| Param | Type | Description |
| --- | --- | --- |
| [ele] | <code>HTMLElement</code> | The element for which to retrieve supported events. |

* * *

<a name="module_DomSmith.registerPlugin"></a>

### DomSmith.registerPlugin(plugin, [options])

Registers a singleton-style plugin for DomSmith.
The plugin may define any of the following methods: addNode, removeNode, mount, unmount & destroy.
Duplicate plugin instances will be ignored.

**Kind**: static method of [<code>DomSmith</code>](#module_DomSmith)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| plugin | <code>Object</code> |  | The plugin object. |
| [options] | <code>Object</code> |  | Additional Options for registration. |
| [options.priority] | <code>number</code> | <code>0</code> | Priority value for plugin execution order (higher runs earlier). |

* * *

<a name="module_DomSmith..NodeDefinition"></a>

### DomSmith~NodeDefinition : <code>Object</code>

Structure of a node definition

**Kind**: inner typedef of [<code>DomSmith</code>](#module_DomSmith)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [_tag] | <code>string</code> | Tag name of the element. Defaults to 'div' if unspecified. |
| [_text] | <code>string</code> | Text content for text nodes. |
| [_ref] | <code>string</code> | A unique reference name used to store a direct reference on the DomSmith instance. |
| [_events] | <code>Object.&lt;string, (function()\|Array.&lt;function()&gt;)&gt;</code> | Object containing event names and their handler(s). |
| [_nodes] | [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith..NodeDefinition) | Child node definitions; can be a single NodeDefinition, a string, or an array of them. |
| [any] | <code>\*</code> | Additional properties that will be assigned either directly or via setAttribute. |

* * *

<a name="module_DomSmith..Options"></a>

### DomSmith~Options : <code>Object</code>

**Kind**: inner typedef of [<code>DomSmith</code>](#module_DomSmith)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| node | <code>HTMLElement</code> | Target DOM node for mounting or insertion. |
| [insertMode] | <code>&#x27;append&#x27;</code> \| <code>&#x27;before&#x27;</code> \| <code>&#x27;replace&#x27;</code> | Injection strategy. Use 'append' to append, 'before' to insert before the node, or 'replace' to replace it. Defaults to 'append'. |

* * *

 * * *

&copy; 2016-present [Frank Kudermann](https://alphanull.de), [https://alphanull.de](https://alphanull.de) <[info@alphanull.de](mailto:info@alphanull.de)>

Documentation is generated by [JSDoc](https://github.com/jsdoc3/jsdoc) and [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
