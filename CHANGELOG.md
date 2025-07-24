# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org) and follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

---

## [2.1.0] – 2025-07-24

### Added

- **Plugin System**: New extensible plugin architecture with `registerPlugin()` method
  - Plugins can hook into `addNode`, `removeNode`, `mount`, `unmount`, and `destroy` lifecycle events
  - Priority-based plugin execution order
  - Built-in plugins for enhanced functionality
- **Enhanced Mount/Unmount System**:
  - New insert modes: 'append' (default), 'before', 'replace', and 'top'
  - Improved mount context tracking for precise re-mounting
  - Better fragment-based batch insertion for multiple nodes
- **Input Range Plugin**: Touch-drag support for `<input type="range">` elements
  - Automatic pointer event handling for mobile devices
  - Preserves existing event handlers
  - Configurable via `$rangeFixDisable` property
- **Select Wrapper Plugin**: Automatic wrapping of `<select>` elements
  - Adds focus/blur styling support
  - Wraps selects in `.select-wrapper` container
  - Configurable via `$wrapped` property
- **Legacy Property Support**: Automatic migration from old property names
  - Deprecation warnings for `tag`, `text`, `ref`, `nodes`, `events`
  - Automatic conversion to underscore-prefixed versions (`_tag`, `_text`, etc.)
- **New destroy() Method**: Replaces deprecated `teardown()` method
  - Plugin-aware cleanup process

### Changed

- **Constructor API**: Now accepts options object instead of just parent node
  - `new DomSmith(nodeDef, options)` where options can be `{ ele, insertMode }`
  - Backward compatible with `new DomSmith(nodeDef, parentNode)`
- **Improved Event Handling**: Better event handler management and cleanup
- **Documentation**: Updated JSDoc comments and inline documentation
- **Code Quality**: Better error handling and validation

### Deprecated

- `teardown()` method - Use `destroy()` instead
- Legacy property names: `tag`, `text`, `ref`, `nodes`, `events` - Use `_tag`, `_text`, `_ref`, `_nodes`, `_events` instead
- Use of those properties is still possible, but will log a warning in the console

### Removed

- Static `getSupportedDomEvents()` method - Now private function
- Static `rootProps` and `nodeProps` arrays - Now private constants

## [2.0.1] – 2025-04-27

### Added

- **@alphanull/domsmith is on npm now!**

### Changed

- updated inline documentation
- updated README.md

## [2.0.0] – 2025-04-09

### Added

- This marks the first public release of **DomSmith**
- Declarative DOM Creation: Create complex DOM structures with simple JSON-like configurations.
- HTML & SVG Support: Automatically uses the correct namespace (including `<foreignObject>` support).
- Centralized Event Handling: Easily attach events and ensure proper cleanup.
- Direct References: Expose element references directly on the builder instance.
- Node Replacement & Removal: Dynamically update and remove parts of your DOM tree.
- Teardown: Fully clean up the DOM and internal state.

---