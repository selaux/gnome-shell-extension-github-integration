import R from 'ramda';
import commonConfig from './rollup.common';

export default R.merge(commonConfig, {
  entry: 'src/prefs.js',
  dest: 'dist/prefs.js'
});
