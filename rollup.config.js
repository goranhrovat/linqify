import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

import pkg from './package.json';

export default [
    {
        input: 'src/linqify.js',
        output: {
            file: pkg.browser,
            name: 'window',
            //format: 'iife',
            format: 'umd',
            extend: true,
            sourcemap: true,
            // noConflict: true,
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                babelrc: false,
                runtimeHelpers: true,
                presets: [
                    ['@babel/preset-env', {modules: false}]
                ],
                "plugins": [["@babel/transform-runtime"]]
            }),
            terser(), // minimize
        ],
    },
    {
        input: 'src/linqify.js',
        output: {
            file: pkg.main,
            format: 'cjs',
            sourcemap: false,
        },
        plugins: [
            commonjs(),
        ],
    },
    {
        input: 'src/linqify.js',
        output: {
            file: pkg.module,
            format: 'esm',
            sourcemap: false,
        },
        plugins: [
            commonjs(),
        ],
    },
];
