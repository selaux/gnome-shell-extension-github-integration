import R from 'ramda';
import commonConfig from './rollup.common';

export default R.merge(commonConfig, {
  entry: 'src/extension.js',
  dest: 'dist/extension.js'
});
