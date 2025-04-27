# DomSmith Docs

<a name="module_DomSmith"></a>

## DomSmith
The `DomSmith` is a utility class that helps to dynamically generate a DOM tree
based on a declarative configuration. It supports event handling, DOM node creation,
manipulation, and removal. Additionally, it ensures proper cleanup by removing events
and references when the `teardown()` or `removeNode()` methods are called.
This is especially useful for building UI components in a modular way where nodes can
be dynamically added, updated, or removed.

**Version**: 2.0.1  
**Author**: Frank Kudermann @ alphanull  

* [DomSmith](#module_DomSmith)
    * [module.exports](#exp_module_DomSmith--module.exports) ⏏
        * [new module.exports(nodeDef, [parentNode])](#new_module_DomSmith--module.exports_new)
        * _instance_
            * [._refs](#module_DomSmith--module.exports+_refs) : <code>WeakMap</code> ℗
            * [._events](#module_DomSmith--module.exports+_events) : <code>WeakMap.&lt;HTMLElement, Object&gt;</code> ℗
            * [._dom](#module_DomSmith--module.exports+_dom) : [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition) ℗
            * [._parent](#module_DomSmith--module.exports+_parent) : <code>HTMLElement</code> ℗
            * [.mount(parentNode)](#module_DomSmith--module.exports+mount)
            * [.unmount()](#module_DomSmith--module.exports+unmount)
            * [.addNode(nodeDefArg, [parent])](#module_DomSmith--module.exports+addNode) ⇒ [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition)
            * [.replaceNode(ref, replaceDef)](#module_DomSmith--module.exports+replaceNode)
            * [.removeNode([nodeDef])](#module_DomSmith--module.exports+removeNode)
            * [.addEvent(eleOrRef, eventName, handler)](#module_DomSmith--module.exports+addEvent)
            * [.removeEvent(eleOrRef, [eventName], [handler])](#module_DomSmith--module.exports+removeEvent)
            * [.teardown()](#module_DomSmith--module.exports+teardown)
        * _static_
            * [.getSupportedDomEvents([tag])](#module_DomSmith--module.exports.getSupportedDomEvents) ⇒ <code>Array.&lt;string&gt;</code>
        * _inner_
            * [~NodeDefinition](#module_DomSmith--module.exports..NodeDefinition) : <code>Object</code>


* * *

<a name="exp_module_DomSmith--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  

* * *

<a name="new_module_DomSmith--module.exports_new"></a>

#### new module.exports(nodeDef, [parentNode])
Creates a new DomSmith instance.


| Param | Type | Description |
| --- | --- | --- |
| nodeDef | [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition) \| <code>string</code> | Node definition. Can be an object, a string, or an array of definitions. |
| [parentNode] | <code>HTMLElement</code> | The parent node to mount the DOM elements to. |


* * *

<a name="module_DomSmith--module.exports+_refs"></a>

#### module.exports.\_refs : <code>WeakMap</code> ℗
Stores additional node data for cleanup.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Access**: private  

* * *

<a name="module_DomSmith--module.exports+_events"></a>

#### module.exports.\_events : <code>WeakMap.&lt;HTMLElement, Object&gt;</code> ℗
Central repository for event listeners.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Access**: private  

* * *

<a name="module_DomSmith--module.exports+_dom"></a>

#### module.exports.\_dom : [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition) ℗
The root node definition or an array of node definitions.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Access**: private  

* * *

<a name="module_DomSmith--module.exports+_parent"></a>

#### module.exports.\_parent : <code>HTMLElement</code> ℗
The parent DOM element where the constructed DOM tree is mounted.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Access**: private  

* * *

<a name="module_DomSmith--module.exports+mount"></a>

#### module.exports.mount(parentNode)
Mounts the created DOM element(s) into the specified parent node.
For multiple nodes, each element is appended individually.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| parentNode | <code>HTMLElement</code> | The parent node to mount the DOM elements to. |


* * *

<a name="module_DomSmith--module.exports+unmount"></a>

#### module.exports.unmount()
Unmounts the created DOM element(s) from their parent node.
For multiple nodes, each child element is removed individually.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  

* * *

<a name="module_DomSmith--module.exports+addNode"></a>

#### module.exports.addNode(nodeDefArg, [parent]) ⇒ [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition)
Adds a DOM node based on a declarative definition.
Supports string, object, or an array of node definitions.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Returns**: [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition) - A node definition object or an array of such objects.  
**Throws**:

- <code>Error</code> If trying to add a duplicate ref or a property was not found.


| Param | Type | Description |
| --- | --- | --- |
| nodeDefArg | [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) | Node definition or an array of definitions. |
| [parent] | <code>Object</code> | Parent object (synthetic) to assign to the newly created node. |


* * *

<a name="module_DomSmith--module.exports+replaceNode"></a>

#### module.exports.replaceNode(ref, replaceDef)
Replaces an existing DOM node (specified by its ref) with a new node definition.
This method first removes all events from the old node, then replaces it in the DOM.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Throws**:

- <code>Error</code> If an invalid ref was used.


| Param | Type | Description |
| --- | --- | --- |
| ref | <code>string</code> | Reference name of the node to be replaced. |
| replaceDef | [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) | The new node definition to replace the old node. |


* * *

<a name="module_DomSmith--module.exports+removeNode"></a>

#### module.exports.removeNode([nodeDef])
Removes all events and references associated with a DOM node.
If the passed node definition is an array, iterates through each element.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [nodeDef] | [<code>NodeDefinition</code>](#module_DomSmith--module.exports..NodeDefinition) \| [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition) | <code>this._dom</code> | The node definition(s) from which to remove events. |


* * *

<a name="module_DomSmith--module.exports+addEvent"></a>

#### module.exports.addEvent(eleOrRef, eventName, handler)
Adds an event listener to the specified element and registers it in the central events repository.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Throws**:

- <code>Error</code> If element was not found, or handler is not a function.


| Param | Type | Description |
| --- | --- | --- |
| eleOrRef | <code>HTMLElement</code> \| <code>string</code> | Target DOM element or ref. |
| eventName | <code>string</code> | Event name (e.g., 'click'). |
| handler | <code>function</code> \| <code>Array.&lt;function()&gt;</code> | Event handler(s) to add. |


* * *

<a name="module_DomSmith--module.exports+removeEvent"></a>

#### module.exports.removeEvent(eleOrRef, [eventName], [handler])
Removes event listener(s) from the specified element.
If no eventName and handler are provided, all event listeners for that element are removed.
If an eventName is provided but no handler, then all handlers for that event are removed.
Otherwise, only the specified handler for the given eventName is removed.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Throws**:

- <code>Error</code> If element or ref was not found.


| Param | Type | Description |
| --- | --- | --- |
| eleOrRef | <code>HTMLElement</code> \| <code>string</code> | Target DOM element or ref. |
| [eventName] | <code>string</code> | Event name (e.g., 'click'). |
| [handler] | <code>function</code> | Event handler to remove. |


* * *

<a name="module_DomSmith--module.exports+teardown"></a>

#### module.exports.teardown()
Cleans up all resources: removes all events, unmounts the DOM nodes, and clears all references.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  

* * *

<a name="module_DomSmith--module.exports.getSupportedDomEvents"></a>

#### module.exports.getSupportedDomEvents([tag]) ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of supported DOM event names for the given tag.

**Kind**: static method of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Returns**: <code>Array.&lt;string&gt;</code> - Sorted array of event names.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tag] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | The tag for which to retrieve supported events. |


* * *

<a name="module_DomSmith--module.exports..NodeDefinition"></a>

#### module.exports~NodeDefinition : <code>Object</code>
Structure of a node definition

**Kind**: inner typedef of [<code>module.exports</code>](#exp_module_DomSmith--module.exports)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [tag] | <code>string</code> | Tag name of the element. Defaults to 'div' if unspecified. |
| [text] | <code>string</code> | Text content for text nodes. |
| [ref] | <code>string</code> | A unique reference name used to store a direct reference on the DomSmith instance. |
| [events] | <code>Object.&lt;string, (function()\|Array.&lt;function()&gt;)&gt;</code> | Object containing event names and their handler(s). |
| [any] | <code>\*</code> | Additional properties that will be assigned either directly or via setAttribute. |
| [nodes] | [<code>Array.&lt;NodeDefinition&gt;</code>](#module_DomSmith--module.exports..NodeDefinition) | Child node definitions; can be a single NodeDefinition, a string, or an array of them. |


* * *


 * * *

&copy; 2016-present [Frank Kudermann](https://alphanull.de), [https://alphanull.de](https://alphanull.de) <[info@alphanull.de](mailto:info@alphanull.de)>

Documentation is generated by [JSDoc](https://github.com/jsdoc3/jsdoc) and [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
