import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import removeProcess from './pipeline/removeProcess';

export default {
  format: 'es6',
  plugins: [
    nodeResolve({ jsnext: true, main: true, preferBuiltins: false }),
    commonjs({
      include: 'node_modules/**',
      exclude: [ 'node_modules/flux/**' ]
    }),
    babel({
      plugins: [ removeProcess ],
      exclude: [ 'node_modules/ramda/**' ]
    }),
    babel({
      "presets": ["es2015-rollup"],
      include: 'src/**'
    })
  ]
};
