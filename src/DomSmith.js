/**
 * The `DomSmith` is a utility class that helps to dynamically generate a DOM tree
 * based on a declarative configuration. It supports event handling, DOM node creation,
 * manipulation, and removal. Additionally, it ensures proper cleanup by removing events
 * and references when the `teardown()` or `removeNode()` methods are called.
 * This is especially useful for building UI components in a modular way where nodes can
 * be dynamically added, updated, or removed.
 * @module DomSmith
 * @author    Frank Kudermann @ alphanull
 * @version   2.0.1
 */
export default class DomSmith {

    /**
     * @typedef  {Object} module:DomSmith~NodeDefinition       Structure of a node definition
     * @property {string}                               [tag]     Tag name of the element. Defaults to 'div' if unspecified.
     * @property {string}                               [text]    Text content for text nodes.
     * @property {string}                               [ref]     A unique reference name used to store a direct reference on the DomSmith instance.
     * @property {Object.<string, Function|Function[]>} [events]  Object containing event names and their handler(s).
     * @property {*}                                    [any]     Additional properties that will be assigned either directly or via setAttribute.
     * @property {module:DomSmith~NodeDefinition[]}     [nodes]   Child node definitions; can be a single NodeDefinition, a string, or an array of them.
     */

    /**
     * Creates a new DomSmith instance.
     * @param {module:DomSmith~NodeDefinition|module:DomSmith~NodeDefinition[]|string} nodeDef       Node definition. Can be an object, a string, or an array of definitions.
     * @param {HTMLElement}                                                            [parentNode]  The parent node to mount the DOM elements to.
     */
    constructor(nodeDef, parentNode) {

        // Create a synthetic root parent object if a parent node is provided.
        // This ensures that even if multiple root nodes are created,
        // each node gets a common parent with a 'nodes' array.
        let rootParent;

        if (parentNode) rootParent = { _ele: parentNode, nodes: [] };

        /**
         * Stores additional node data for cleanup.
         * @private
         * @type {WeakMap}
         */
        this._refs = new WeakMap();

        /**
         * Central repository for event listeners.
         * @private
         * @type {WeakMap<HTMLElement, Object>}
         */
        this._events = new WeakMap();

        /**
         * The root node definition or an array of node definitions.
         * @private
         * @type {module:DomSmith~NodeDefinition|module:DomSmith~NodeDefinition[]}
         */
        this._dom = this.addNode(nodeDef, rootParent);

        /**
         * The parent DOM element where the constructed DOM tree is mounted.
         * @private
         * @type {HTMLElement}
         */
        this._parent = parentNode;

        // If a synthetic root parent was used and the result is an array, update its nodes array.
        if (rootParent && Array.isArray(this._dom)) rootParent.nodes = this._dom;

        // Automatically mount the DOM node(s) if the 'mount' option is true
        if (this._parent) this.mount();

    }

    /**
     * Mounts the created DOM element(s) into the specified parent node.
     * For multiple nodes, each element is appended individually.
     * @param {HTMLElement} parentNode  The parent node to mount the DOM elements to.
     */
    mount(parentNode) {

        if (parentNode) this._parent = parentNode;

        if (Array.isArray(this._dom)) {
            // Append each node if it is not already attached
            this._dom.forEach(nodeDef => {
                if (!nodeDef._ele.parentNode || nodeDef._ele.parentNode !== this._parent) {
                    this._parent.appendChild(nodeDef._ele);
                }
            });
        } else if (!this._dom._ele.parentNode || this._dom._ele.parentNode !== this._parent) {
            this._parent.appendChild(this._dom._ele);
        }

    }

    /**
     * Unmounts the created DOM element(s) from their parent node.
     * For multiple nodes, each child element is removed individually.
     */
    unmount() {

        if (Array.isArray(this._dom)) {
            this._dom.forEach(nodeDef => nodeDef._ele.remove());
        } else if (this._dom && this._dom._ele && this._dom._ele.parentNode) {
            this._dom._ele.remove();
        }

    }

    /**
     * Adds a DOM node based on a declarative definition.
     * Supports string, object, or an array of node definitions.
     * @param   {module:DomSmith~NodeDefinition}                                  nodeDefArg  Node definition or an array of definitions.
     * @param   {Object}                                                          [parent]    Parent object (synthetic) to assign to the newly created node.
     * @returns {module:DomSmith~NodeDefinition|module:DomSmith~NodeDefinition[]}             A node definition object or an array of such objects.
     * @throws  {Error}                                                                       If trying to add a duplicate ref or a property was not found.
     */
    addNode(nodeDefArg, parent) {

        let nodeDef = nodeDefArg || {};

        // If an array is provided, return an array of node definitions.
        if (Array.isArray(nodeDef)) {

            const nodes = nodeDef.map(nd => {
                const node = this.addNode(nd, parent);
                if (parent && Array.isArray(parent.nodes)) parent.nodes.push(node);
                return node;
            });

            return nodes;
        }

        // Helper function: assign a value to a property by path (e.g., 'style.color')
        function assignWithPath(obj, path, value) { // eslint-disable-line jsdoc/require-jsdoc
            const pathArray = path.split('.'),
                  pathObj = pathArray.slice(0, -1).reduce((acc, key) => (typeof acc === 'undefined' || typeof acc[key] === 'undefined' ? null : acc[key]), obj);
            if (typeof pathObj !== 'object' || pathObj === null) throw new Error(`[DomSmith] Did not find property with path: ${path}`);
            pathObj[pathArray.pop()] = value;
        }

        if (typeof nodeDef === 'string' || nodeDef instanceof String) {
            // Create a text node if nodeDef is a string
            nodeDef = { _ele: document.createTextNode(nodeDef) };
        } else {
            // Use SVG namespace if the current node's tag is 'svg' (case-insensitive), or a parent is provided and its element is in the SVG namespace.
            const SVG_NS = 'http://www.w3.org/2000/svg', // Define SVG namespace
                  isParentForeign = parent && parent._ele && parent._ele.tagName.toLowerCase() === 'foreignobject',
                  useSvgNS = !isParentForeign && (nodeDef.tag && nodeDef.tag.toLowerCase() === 'svg' || parent && parent._ele && parent._ele.namespaceURI === SVG_NS);

            if (useSvgNS) {
                nodeDef._ele = document.createElementNS(SVG_NS, nodeDef.tag);
            } else {
                nodeDef._ele = document.createElement(nodeDef.tag || 'div');
            }
        }

        // If a 'text' property is provided, override _ele with a text node
        if (typeof nodeDef.text !== 'undefined') {
            nodeDef._ele = document.createTextNode(nodeDef.text);
        }

        const { nodes, tag, ref, events, _ele } = nodeDef;

        // Process each property of nodeDef
        Object.entries(nodeDef).forEach(([key, value]) => {
            // Skip reserved keys
            if (DomSmith.nodeProps.includes(key)) return;

            // Determine supported events; extra events for 'video' and 'audio'
            const supportedEvents = tag === 'video' || tag === 'audio'
                ? DomSmith.getSupportedDomEvents(tag)
                : DomSmith.supportedEvents;

            if (supportedEvents.includes(key)) {
                // Add event listener if key is a supported event name
                this.addEvent(_ele, key, value);

            } else if (key.includes('.')) {

                assignWithPath(_ele, key, value);

            } else if (key in _ele) {
                // Directly assign the property if it exists on the element
                try {
                    _ele[key] = value;
                } catch (e) { // eslint-disable-line no-unused-vars
                    // If direct assignment fails (e.g., property is readonly, as with some SVG elements), fallback to using setAttribute.
                    if (value !== null && typeof value !== 'undefined') _ele.setAttribute(key, value);
                }
            } else if (value !== null && typeof value !== 'undefined') {
                // fall back to setAttribute if key does not exist
                _ele.setAttribute(key, value);
            }
        });

        // Process explicit "events" property if provided
        if (events) {
            Object.entries(events).forEach(([evName, evHandler]) => {
                this.addEvent(_ele, evName, evHandler);
            });
        }

        // Set the parent reference (if provided)
        if (parent) nodeDef._parent = parent;

        // Register references for easy access
        if (ref) {
            // Skip reserved keys
            if (DomSmith.rootProps.includes(ref)) throw new Error('[DomSmith] Reserved properties are not allowed as ref');
            if (this[ref]) throw new Error('[DomSmith] No Duplicate Refs are allowed');
            this[ref] = _ele;
            this._refs.set(_ele, nodeDef);
        }

        // Process child nodes recursively
        if (nodes) {
            if (typeof nodes === 'string') nodeDef.nodes = [nodes];
            nodeDef.nodes = nodeDef.nodes.reduce((acc, node) => {
                if (node) {
                    const childNodeDef = this.addNode(node, nodeDef);
                    _ele.appendChild(childNodeDef._ele);
                    acc.push(childNodeDef);
                }
                return acc;
            }, []);
        }

        return nodeDef;

    }

    /**
     * Replaces an existing DOM node (specified by its ref) with a new node definition.
     * This method first removes all events from the old node, then replaces it in the DOM.
     * @param  {string}                         ref         Reference name of the node to be replaced.
     * @param  {module:DomSmith~NodeDefinition} replaceDef  The new node definition to replace the old node.
     * @throws {Error}                                      If an invalid ref was used.
     */
    replaceNode(ref, replaceDef) {

        const replaceEle = this[ref],
              oldNode = this._refs.get(replaceEle);

        if (!oldNode) throw new Error('[DomSmith] invalid ref used with replaceNode');

        // Remove all events attached to the old node and clean up references
        this.removeNode(oldNode);

        const parentIndex = oldNode._parent.nodes.findIndex(pnode => pnode === oldNode), // Index of the old node within its parent's nodes array
              newNode = this.addNode(replaceDef, oldNode._parent); // New node using the same parent reference

        newNode._parent._ele.replaceChild(newNode._ele, oldNode._ele); // Replace the old node with the new node in the parent's DOM element
        newNode._parent.nodes[parentIndex] = newNode; // Update the parent's nodes array

        // Update the reference to point to the new element
        if (oldNode.ref) {
            this[oldNode.ref] = newNode._ele;
            this._refs.set(newNode._ele, newNode);
        }

    }

    /**
     * Removes all events and references associated with a DOM node.
     * If the passed node definition is an array, iterates through each element.
     * @param {module:DomSmith~NodeDefinition|module:DomSmith~NodeDefinition[]} [nodeDef=this._dom]  The node definition(s) from which to remove events.
     */
    removeNode(nodeDef = this._dom) {

        if (Array.isArray(nodeDef)) { // If nodeDef is an array, process each node individually
            nodeDef.forEach(nd => this.removeNode(nd));
            return;
        }

        this.removeEvent(nodeDef._ele);

        if (nodeDef.events) delete nodeDef.events;

        if (nodeDef.ref) {
            this._refs.delete(this[nodeDef.ref]);
            delete this[nodeDef.ref];
        }

        if (nodeDef.nodes) {
            nodeDef.nodes.forEach(child => this.removeNode(child));
        }

    }

    /**
     * Adds an event listener to the specified element and registers it in the central events repository.
     * @param  {HTMLElement|string}  eleOrRef   Target DOM element or ref.
     * @param  {string}              eventName  Event name (e.g., 'click').
     * @param  {Function|Function[]} handler    Event handler(s) to add.
     * @throws {Error}                          If element was not found, or handler is not a function.
     */
    addEvent(eleOrRef, eventName, handler) {

        if (!handler) return; // ignore undefined handlers

        const ele = typeof eleOrRef === 'string' ? this[eleOrRef] : eleOrRef;

        if (!ele) throw new Error(`[DomSmith] removeEvent: ele or ref: ${eleOrRef} not found`);

        if (!this._events.has(ele)) this._events.set(ele, {}); // Initialize mapping if not present
        const events = this._events.get(ele);
        if (!events[eventName]) events[eventName] = [];

        if (Array.isArray(handler)) {
            handler.forEach(h => {
                if (typeof h !== 'function') throw new Error('[DomSmith] Handler must be a function');
                ele.addEventListener(eventName, h);
                events[eventName].push(h);
            });
        } else {
            if (typeof handler !== 'function') throw new Error('[DomSmith] Handler must be a function');
            ele.addEventListener(eventName, handler);
            events[eventName].push(handler);
        }

    }

    /**
     * Removes event listener(s) from the specified element.
     * If no eventName and handler are provided, all event listeners for that element are removed.
     * If an eventName is provided but no handler, then all handlers for that event are removed.
     * Otherwise, only the specified handler for the given eventName is removed.
     * @param  {HTMLElement|string} eleOrRef     Target DOM element or ref.
     * @param  {string}             [eventName]  Event name (e.g., 'click').
     * @param  {Function}           [handler]    Event handler to remove.
     * @throws {Error}                           If element or ref was not found.
     */
    removeEvent(eleOrRef, eventName, handler) {

        const ele = typeof eleOrRef === 'string' ? this[eleOrRef] : eleOrRef;

        if (!ele) throw new Error(`[DomSmith] removeEvent: ele or ref: ${eleOrRef} not found`);

        if (!this._events.has(ele)) return;
        const events = this._events.get(ele);

        if (eventName) {
            if (!events[eventName]) return;
            if (handler) {
                ele.removeEventListener(eventName, handler);
                events[eventName] = events[eventName].filter(h => h !== handler);
            } else {
                events[eventName].forEach(h => ele.removeEventListener(eventName, h));
                delete events[eventName];
            }
            if (Object.keys(events).length === 0) this._events.delete(ele);
        } else {
            Object.keys(events).forEach(evName => {
                events[evName].forEach(h => ele.removeEventListener(evName, h));
            });
            this._events.delete(ele);
        }

    }

    /**
     * Cleans up all resources: removes all events, unmounts the DOM nodes, and clears all references.
     */
    teardown() {

        this.removeNode();
        this.unmount();
        this._dom = this._refs = this._parent = this._events = null;

    }

    /**
     * Returns an array of supported DOM event names for the given tag.
     * @param   {string}   [tag='div']  The tag for which to retrieve supported events.
     * @returns {string[]}              Sorted array of event names.
     */
    static getSupportedDomEvents(tag = 'div') {

        const el = document.createElement(tag),
              events = [];
        for (const key in el) {
            if (key.startsWith('on')) events.push(key.slice(2));
        }
        return events.sort();

    }
}

// List of reserved root properties.
DomSmith.rootProps = ['_dom', '_refs', '_parent', '_events', 'constructor', 'prototype', 'addNode', 'replaceNode', 'removeNode', 'addEvent', 'removeEvent', 'teardown'];
// List of reserved nodeDef properties.
DomSmith.nodeProps = ['_ele', 'ref', 'tag', 'nodes', 'text', 'events'];
// Pre-calculate supported events for a generic element.
DomSmith.supportedEvents = DomSmith.getSupportedDomEvents();
