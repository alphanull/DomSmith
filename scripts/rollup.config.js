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
    }
];
