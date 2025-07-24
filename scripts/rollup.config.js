import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';

const banner = `/*!
* DomSmith – Javascript Dom library
* @license MIT
* © 2016–present Frank Kudermann @ alphanull
*/`;

export default [
    {
        input: 'src/DomSmith.js',
        output: {
            file: 'dist/DomSmith.min.js',
            format: 'esm',
            sourcemap: false,
            banner
        },
        plugins: [
            del({ targets: 'dist/*' }),
            resolve(),
            terser()
        ]
    },
    {
        input: 'src/plugins/domSmithInputRange.js',
        output: {
            file: 'dist/plugins/domSmithInputRange.min.js',
            format: 'esm',
            sourcemap: false,
            banner
        },
        plugins: [
            resolve(),
            terser()
        ]
    },
    {
        input: 'src/plugins/domSmithSelect.js',
        output: {
            file: 'dist/plugins/domSmithSelect.min.js',
            format: 'esm',
            sourcemap: false,
            banner
        },
        plugins: [
            resolve(),
            terser()
        ]
    }
];
