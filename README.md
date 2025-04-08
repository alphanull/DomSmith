![License](https://img.shields.io/github/license/alphanull/domsmith)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
[![JSDoc](https://img.shields.io/badge/docs-JSDoc-blue)](./docs/DomSmith.md)
![Size](https://img.shields.io/badge/gzipped~2kb-brightgreen)

# @alphanull/domsmith

**DomSmith** is a lightweight and declarative DOM builder for JavaScript that enables you to create, update, and remove DOM trees with an intuitive API. It supports both HTML and SVG elements with automatic namespace handling (including `<foreignObject>` support) and centralized event management with proper cleanup. By also providing direct access to element references via the instance, DomSmith aims to simplify UI component creation for modern web applications.

## Features

- **Declarative DOM Creation:** Create complex DOM structures with simple JSON-like configurations.
- **HTML & SVG Support:** Automatically uses the correct namespace (including `<foreignObject>` support).
- **Centralized Event Handling:** Easily attach events and ensure proper cleanup.
- **Direct References:** Expose element references directly on the builder instance.
- **Node Replacement & Removal:** Dynamically update and remove parts of your DOM tree.
- **Teardown:** Fully clean up the DOM and internal state.

---

## Installation

### via NPM

**ATTN: Package is not on npm yet due to namespace clearance!**

```bash
npm install @alphanull/domsmith
```

### via CDN

**Also, no CDN (yet)**

[Download latest version](https://??????) from ????????

### via GitHub

[Download release](https://github.com/alphanull/domsmith/releases) from GitHub

------

## Usage

### 1. Basic Usage

Create a simple DOM tree with nested children. The resulting DOM tree is immediately mounted to `document.body`.

```javascript
import DomSmith from '@alphanull/domsmith';

const domConfig = {
    tag: 'div', // 'div' is default and can be omitted.
    nodes: [ // nodes array contains child nodes
        {
            tag: 'header', // The tag name
            nodes: [
                {
                    tag: 'h1',
                    // Use a string as a nodes definition to create a single text node
                    nodes: 'Welcome to DomSmith!'
                }
            ]
        },
        {
            tag: 'section',
            nodes: [
                {
                    tag: 'p',
                    // You can also use a string for text node(s) in an nodes array
                    nodes: [
                        {
                            tag: 'span',
                            nodes: 'This is a basic usage example. '
                        },
                        'Second Text Node'
                    ]
                }
            ]
        }
    ]
};

const dom = new DomSmith(domConfig, document.body);

// Alternatively, if you omit the second parameter, the DOM is not mounted immediately
const dom2 = new DomSmith(domConfig);
// ... later, you can mount manually:
dom2.mount(document.body);
```

------

### 2. Attributes and Properties

Assign attributes and properties directly in the configuration.

```javascript
const domConfig = {
    tag: 'button',
    id: 'myButton', // Will be set as an attribute or property.
    className: 'btn-primary', // Will be set as an attribute or property.
    'style.backgroundColor': 'skyblue', // Dot notation for nested properties.
    nodes: 'I am a Button'
};
```

DomSmith automatically determines wether to use `setAttribute()` or set the value directly on the property. If the property exists, direct assignment is used. If the property is not found or assignement fails (for example, due to being readonly on svg elements) `setAttribute()` is used. Also, especially for `style` properties you can use dot notation.

**Please note:**  
It is strongly recommended to avoid properties beginning with an underscore to prevent conflicts with internal properties.

---

### 3. References

Expose direct references to DOM elements by specifying the `ref` property for easy access and further manipulation:

```javascript
const domConfig = {
    ref: 'container',
    nodes: [
        {
            tag: 'p',
            nodes: 'Paragraph 1'
        },
        {
            tag: 'p',
            ref: 'secondParagraph',
            nodes: 'Paragraph 2'
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
    ref: 'container',
    nodes: [
        {
            ref: 'myText',
            text: 'A referenced TextNode'
        }
    ]
};

const dom = new DomSmith(domConfig, document.body);

dom.myText.nodeValue = 'Changed Text'; // direct access to TextNode
```

**Please note:**  
You can use almost any string as a reference name, but since the refs are exposed on the root of the instance, certain names (especially those reserved for the API) cannot be used. It is also recommended to avoid refs beginning with an underscore to prevent conflicts with internal properties. Additionally, refs must be unique within each instance; duplicate refs will throw an error.

---

### 4. Events

#### Using the shortcut notation

Attach event listeners directly within the node definition. These event listeners will be automatically removed when `teardown()` or `removeNode()` is called, so manual cleanup is usually unecessary.

```javascript
const domConfig = {
    tag: 'button',
    nodes: 'Click Me',
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
    tag: 'input',
    events: {
        compositionupdate: () => console.log('Composition updated')
    }
};
```

#### Manually adding and removing events

You can also add or remove events manually after creating the DomSmith Instance by using a reference:

```javascript
const domConfig = {
    tag: 'button',
    nodes: 'Click Me',
    ref: 'button',
    mouseover: () => console.log('Mouse over button')
};

const dom = new DomSmith(domConfig, document.body);

dom.addEvent('button', 'click', () => console.log('Button clicked!')); // add another listener
dom.removeEvent('button', 'mouseover'); // removes all 'mouseover' events
dom.removeEvent('button'); // removes _all_ events
```
---

### 5. Node Replacement and Removal

Dynamically replace or remove nodes from the DOM tree. This process also cleans up any attached event listeners.

```javascript
const domConfig = {
    nodes: [
        {
            tag: 'p',
            ref: 'message',
            nodes: 'Old content'
        }
    ]
};

const dom = new DomSmith(domConfig, document.body);

// Replace the paragraph with new content
dom.replaceNode('message', {
    tag: 'p',
    ref: 'message',
    nodes: 'New content'
});

// Remove the paragraph after 3 seconds
setTimeout(() => {
    dom.removeNode(dom.message);
}, 3000);
```
---

### 6. Multiple Root Nodes

This example demonstrates how to pass an array as the node definition so that multiple sibling nodes are created as the root. Each node is appended individually to the specified parent element, and the defined refs become direct properties on the instance.

```javascript
const domConfig = [
    {
        tag: 'header',
        nodes: 'Header Content',
    },
    {
        tag: 'main',
        ref: 'main',
        nodes: [
            {
                tag: 'p',
                nodes: 'This is the main content.'
            }
        ]
    },
    {
        tag: 'footer',
        nodes: 'Footer Content'
    }
];
```
---

### 7. SVG

This example shows how DomSmith supports SVG elements, including the use of <foreignObject>. Child nodes within a <foreignObject> are created in the HTML namespace, while the rest of the SVG uses the SVG namespace:

```javascript
const domConfig = {
    tag: 'svg',
    width: 300,
    height: 200,
    nodes: [
        {
            tag: 'rect',
            x: 10,
            y: 10,
            width: 280,
            height: 180,
            fill: 'lightblue'
        },
        {
            tag: 'foreignObject',
            width: 100,
            height: 50,
            // Within a foreignObject, child nodes are created in the HTML namespace.
            nodes: [
                {
                    nodes: 'HTML inside foreignObject',
                    style: 'color: red; font-size: 14px;'
                }
            ]
        }
    ]
});
```
---

### 8. Unmount & Teardown

Use `unmount()` to remove the DomSmith elements from the DOM while preserving event bindings, allowing you to remount the instance later.

```javascript
const dom = new DomSmith(domConfig, document.body);
dom.unmount(); 
```

Use `teardown()` to completely remove the DomSmith instance, including all event listeners, mounted elements, and references.

```javascript
const dom = new DomSmith(domConfig, document.body);
dom.teardown();
```

---

## Docs

For more detailed docs, see [JSDoc Documentation](docs/DomSmith.md)

## License

[MIT](https://opensource.org/license/MIT) 

Copyright © 2016-present Frank Kudermann @ alphanull.de