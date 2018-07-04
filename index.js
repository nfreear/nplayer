/*!
  N-Player. | © Nick Freear, 26-June-2018.
*/

const CONFIG = require('./src/configure');
const PODCAST = require('./src/podcast');
const PLAYER = require('./src/player');

PLAYER.setConfig(CONFIG);

const promise = PODCAST(CONFIG);

console.warn('Promise:', promise);

promise.then(PLAYER.inject).catch(function (err) {
  console.error('Error:', err);
});
