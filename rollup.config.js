import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import packageJSON from './package.json';

const extensions = ['.ts', '.js'];

export default {
  input: 'index.ts',
  output: {
    file: packageJSON.main,
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [
    json(),
    builtins(),
    resolve({
      extensions,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
    commonjs(),
  ],
};
