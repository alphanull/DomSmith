![License](https://img.shields.io/github/license/alphanull/domsmith)
![Version](https://img.shields.io/npm/v/@alphanull/domsmith)
[![JSDoc](https://img.shields.io/badge/docs-JSDoc-blue)](./docs/DomSmith.md)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/@alphanull/domsmith)

# DomSmith

**DomSmith** is a lightweight and declarative DOM builder for JavaScript that enables you to create, update, and remove DOM trees with an intuitive API. It supports both HTML and SVG elements with automatic namespace handling (including `<foreignObject>` support) and centralized event management with proper cleanup. By also providing direct access to element references via the instance, DomSmith aims to simplify UI component creation for modern web applications.

## Features

- **Declarative DOM Creation:** Create complex DOM structures with simple JSON-like configurations.
- **HTML & SVG Support:** Automatically uses the correct namespace (including `<foreignObject>` support).
- **Centralized Event Handling:** Easily attach events and ensure proper cleanup.
- **Direct References:** Expose element references directly on the builder instance.
- **Node Replacement & Removal:** Dynamically update and remove parts of your DOM tree.
- **Plugin System:** Extensible architecture with lifecycle hooks and priority-based execution.
- **Flexible Mounting:** Multiple insert modes (append, before, replace, top) for precise DOM placement.
- **Memory Management:** Proper cleanup with the `destroy()` method.

## Installation

### Using NPM

```bash
npm install @alphanull/domsmith
```

### Using CDN

[Download latest version](https://cdn.jsdelivr.net/npm/@alphanull/domsmith@2/dist/DomSmith.min.js) from jsDelivr
[Download latest version](https://unpkg.com/@alphanull/domsmith@2/dist/DomSmith.min.js) from unpkg

### via GitHub

[Download release](https://github.com/alphanull/domsmith/releases) from GitHub

## Usage

### 1. Basic Usage

Create a simple DOM tree with nested children. The resulting DOM tree is immediately mounted to `document.body`.

```javascript
import DomSmith from '@alphanull/domsmith';

const domConfig = {
    _tag: 'div', // 'div' is default and can be omitted.
    _nodes: [ // _nodes array contains child nodes
        {
            _tag: 'header', // The tag name
            _nodes: [
                {
                    _tag: 'h1',
                    // Use a string as a _nodes definition to create a single text node
                    _nodes: 'Welcome to DomSmith!'
                }
            ]
        },
        {
            _tag: 'section',
            _nodes: [
                {
                    _tag: 'p',
                    // You can also use a string for text node(s) in an _nodes array
                    _nodes: [
                        {
                            _tag: 'span',
                            _nodes: 'This is a basic usage example. '
                        },
                        'Second Text Node'
                    ]
                }
            ]
        }
    ]
};

// New API with extended options (v2.1.0+)
const dom = new DomSmith(domConfig, { ele: document.body, insertMode: 'append' });
// Legacy API shortcut (insertMode defaults to 'append')
const dom2 = new DomSmith(domConfig, document.body);
// Alternatively, if you omit the second parameter, the DOM is not mounted immediately
const dom3 = new DomSmith(domConfig);
// ... later, you can mount manually:
dom3.mount({ ele: myEle, insertMode: 'replace' });
```

### 2. Attributes and Properties

Assign attributes and properties directly in the configuration.

```javascript
const domConfig = {
    _tag: 'button',
    id: 'myButton', // Will be set as an attribute or property.
    className: 'btn-primary', // Will be set as an attribute or property.
    'style.backgroundColor': 'skyblue', // Dot notation for nested properties.
    _nodes: 'I am a Button'
};
```

DomSmith automatically determines whether to use `setAttribute()` or set the value directly on the property. If the property exists, direct assignment is used. If the property is not found or assignment fails (for example, due to being readonly on svg elements) `setAttribute()` is used. Also, especially for `style` properties you can use dot notation.

**Please note:**
It is strongly recommended to avoid properties beginning with an underscore to prevent conflicts with internal properties.

### 3. References

Expose direct references to DOM elements by specifying the `_ref` property for easy access and further manipulation:

```javascript
const domConfig = {
    _ref: 'container',
    _nodes: [
        {
            _tag: 'p',
            _nodes: 'Paragraph 1'
        },
        {
            _tag: 'p',
            _ref: 'secondParagraph',
            _nodes: 'Paragraph 2'
        }
    ]
};

const dom = new DomSmith(domConfig, document.body);

console.log(dom.container);       // Direct access to the container div
console.log(dom.secondParagraph); // Direct access to the second paragraph
```

In case you want to directly reference a **text node**, you can use this format:

```javascript
const domConfig = {
    _ref: 'container',
    _nodes: [
        {
            _ref: 'myText',
            _text: 'A referenced TextNode'
        }
    ]
};

const dom = new DomSmith(domConfig, document.body);
dom.myText.nodeValue = 'Changed Text'; // direct access to TextNode
```

**Please note:**
You can use almost any string as a reference name, but since the refs are exposed on the root of the instance, certain names (especially those reserved for the API) cannot be used. Therefore, it is strongly recommended to avoid refs beginning with an underscore as well as a dollar sign to prevent conflicts with internal properties. Additionally, refs must be unique within each instance; duplicate refs will throw an error.

**Legacy Support:**
The old property names (`ref`, `tag`, `text`, `nodes`, `events`) are still supported but will show deprecation warnings. It's recommended to migrate to the new underscore-prefixed versions.

### 4. Events

#### Using the shortcut notation

Attach event listeners directly within the node definition. These event listeners will be automatically removed when `teardown()` or `removeNode()` is called, so manual cleanup is usually unecessary.

```javascript
const domConfig = {
    _tag: 'button',
    _nodes: 'Click Me',
    mouseover: () => console.log('Mouse over button'),
    click: [ // You can bind multiple handlers to the same event by using an array of handlers
        () => console.log('Button clicked!'),
        () => console.log('Second Click handlers!')
    ]
};
```

**Please note:**
Event names are derived dynamically at runtime and only cover events that have a corresponding “on” property (e.g., `onclick`). Some events, such as `compositionupdate`, do not have this equivalent, nor do custom events. In those cases, you can specify events explicitly:

#### Setting events explicity (mostly for edge cases and custom events)

```javascript
const domConfig = {
    _tag: 'input',
    _events: {
        compositionupdate: () => console.log('Composition updated')
    }
};
```

#### Manually adding and removing events

You can also add or remove events manually after creating the DomSmith Instance by using a reference:

```javascript
const domConfig = {
    _tag: 'button',
    _nodes: 'Click Me',
    _ref: 'button',
    mouseover: () => console.log('Mouse over button')
};

const dom = new DomSmith(domConfig, document.body);

dom.addEvent('button', 'click', () => console.log('Button clicked!')); // add another listener
dom.removeEvent('button', 'mouseover'); // removes all 'mouseover' events
dom.removeEvent('button'); // removes _all_ events
```

### 5. Node Replacement and Removal

Dynamically replace or remove nodes from the DOM tree. This process also cleans up any attached event listeners.

```javascript
const domConfig = {
    _nodes: [
        {
            _tag: 'p',
            _ref: 'message',
            _nodes: 'Old content'
        }
    ]
};

const dom = new DomSmith(domConfig, { ele: document.body });

// Replace the paragraph with new content
dom.replaceNode('message', {
    _tag: 'p',
    _ref: 'message',
    _nodes: 'New content'
});

// Remove the paragraph after 3 seconds
setTimeout(() => {
    dom.removeNode(dom.message);
}, 3000);
```

### 6. Multiple Root Nodes

This example demonstrates how to pass an array as the node definition so that multiple sibling nodes are created as the root. Each node is appended individually to the specified parent element, and the defined refs become direct properties on the instance.

```javascript
const domConfig = [
    {
        _tag: 'header',
        _nodes: 'Header Content',
    },
    {
        _tag: 'main',
        _ref: 'main',
        _nodes: [
            {
                _tag: 'p',
                _nodes: 'This is the main content.'
            }
        ]
    },
    {
        _tag: 'footer',
        _nodes: 'Footer Content'
    }
];
```

### 7. SVG

This example shows how DomSmith supports SVG elements, including the use of <foreignObject>. Child nodes within a <foreignObject> are created in the HTML namespace, while the rest of the SVG uses the SVG namespace:

```javascript
const domConfig = {
    _tag: 'svg',
    width: 300,
    height: 200,
    _nodes: [
        {
            _tag: 'rect',
            x: 10,
            y: 10,
            width: 280,
            height: 180,
            fill: 'lightblue'
        },
        {
            _tag: 'foreignObject',
            width: 100,
            height: 50,
            // Within a foreignObject, child nodes are created in the HTML namespace.
            _nodes: [
                {
                    _nodes: 'HTML inside foreignObject',
                    style: 'color: red; font-size: 14px;'
                }
            ]
        }
    ]
});
```

### 8. Plugin System

DomSmith includes a powerful plugin system that allows you to extend functionality. Plugins can hook into various lifecycle events and modify node definitions.

#### Built-in Plugins

DomSmith comes with two built-in plugins that are available as separate modules:

**Input Range Plugin**: Enhances `<input type="range">` elements with touch-drag support for mobile devices.

```javascript
// Automatically applied to all range inputs
const rangeConfig = {
    _tag: 'input',
    type: 'range',
    min: 0,
    max: 100,
    value: 50
    // Touch-drag support is automatically added
};

// Disable the plugin for specific elements
const disabledRangeConfig = {
    _tag: 'input',
    type: 'range',
    $rangeFixDisable: true // Plugin will be skipped for this element
};
```

**Select Wrapper Plugin**: Automatically wraps `<select>` elements for enhanced styling.

```javascript
// Automatically wrapped in .select-wrapper container
const selectConfig = {
    _tag: 'select',
    _nodes: [
        { _tag: 'option', _nodes: 'Option 1' },
        { _tag: 'option', _nodes: 'Option 2' }
    ]
};
```

#### Using Built-in Plugins

The built-in plugins are also available as separate modules for optional usage:

```javascript
import DomSmith from '@alphanull/domsmith';
import inputRangePlugin from '@alphanull/domsmith/plugins/domSmithInputRange.min.js';
import selectPlugin from '@alphanull/domsmith/plugins/domSmithSelect.min.js';

// Register plugins manually
DomSmith.registerPlugin(inputRangePlugin);
DomSmith.registerPlugin(selectPlugin);

// Now use DomSmith with plugin support
const dom = new DomSmith(config, { ele: document.body });
```

#### Custom Plugins

You can create custom plugins by implementing certain lifecycle hooks. Plugins are executed in priority order (higher priority runs first).

**Available Lifecycle Hooks:**

- `addNode(nodeDef)` - Called during node creation, can modify and return the node definition
- `removeNode(nodeDef)` - Called during node removal, can modify and return the node definition
- `mount(dom, mountContext)` - Called when DOM is mounted
- `unmount(dom, mountContext)` - Called when DOM is unmounted
- `destroy()` - Called when the DomSmith instance is destroyed

```javascript
const myPlugin = {
    addNode(nodeDef) {
        // Modify node definition during creation
        if (nodeDef._tag === 'button') {
            nodeDef.className = 'custom-button';
        }
        return nodeDef;
    },

    mount(dom, mountContext) {
        // Called when DOM is mounted
        console.log('DOM mounted:', mountContext);
    },

    destroy() {
        // Called when instance is destroyed
        console.log('Plugin cleanup');
    }
};

// Register plugin with priority (higher runs earlier)
DomSmith.registerPlugin(myPlugin, { priority: 10 });
```

#### Plugin Configuration with $ Variables

Plugins can be configured using `$`-prefixed properties in node definitions. These properties are not rendered to the DOM but are used by plugins for configuration.

```javascript
const myCustomPlugin = {
    addNode(nodeDef) {
        // Check for plugin-specific configuration
        if (nodeDef.$myPluginEnabled === false) return; // Skip processing

        if (nodeDef._tag === 'div' && nodeDef.$myPluginClass) {
            nodeDef.className = nodeDef.$myPluginClass;
        }

        return nodeDef;
    }
};

// Usage in node definitions
const config = {
    _tag: 'div',
    $myPluginEnabled: true,
    $myPluginClass: 'special-styling',
    _nodes: 'Content'
};
```

#### Plugin Chaining

Plugins are executed in sequence, allowing them to build upon each other's modifications:

```javascript
const plugin1 = {
    addNode(nodeDef) {
        if (nodeDef._tag === 'button') {
            nodeDef.className = 'base-button';
        }
        return nodeDef;
    }
};

const plugin2 = {
    addNode(nodeDef) {
        if (nodeDef._tag === 'button' && nodeDef.className === 'base-button') {
            nodeDef.className += ' enhanced-button';
        }
        return nodeDef;
    }
};

// Register plugins with different priorities
DomSmith.registerPlugin(plugin1, { priority: 10 }); // Runs first
DomSmith.registerPlugin(plugin2, { priority: 5 });  // Runs second

// Result: button will have className 'base-button enhanced-button'
```

**Important Notes:**

- Plugins are registered globally and affect all DomSmith instances
- Duplicate plugin instances are automatically ignored
- `$`-prefixed properties are automatically filtered out and not rendered to the DOM
- Plugin execution order is determined by priority (higher numbers run first)
- If a plugin hook returns `undefined`, the original node definition is preserved

### 9. Mount Options

DomSmith supports multiple insert modes for precise DOM placement:

```javascript
// Append (default) - adds to end of parent
const dom1 = new DomSmith(config, { ele: parent, insertMode: 'append' });
// Before - inserts before target element
const dom2 = new DomSmith(config, { ele: target, insertMode: 'before' });
// Replace - replaces target element
const dom3 = new DomSmith(config, { ele: target, insertMode: 'replace' });
// Top - inserts as first child of parent
const dom4 = new DomSmith(config, { ele: parent, insertMode: 'top' });
```

### 10. Unmount & Cleanup

Use `unmount()` to remove the DomSmith elements from the DOM while preserving event bindings, allowing you to remount the instance later.

```javascript
const dom = new DomSmith(domConfig, { ele: document.body });
dom.unmount();
// Later...
dom.mount(); // Re-mounts to original location
```

Use `destroy()` to completely remove the DomSmith instance, including all event listeners, mounted elements, and references.

```javascript
const dom = new DomSmith(domConfig, { ele: document.body });
dom.destroy(); // Complete cleanup
```

**Note**: The old `teardown()` method is deprecated and will show a warning. Use `destroy()` instead.

## Docs

For more detailed docs, see [JSDoc Documentation](docs/DomSmith.md)

## License

[MIT](https://opensource.org/license/MIT)

Copyright © 2016-present Frank Kudermann @ alphanull.de