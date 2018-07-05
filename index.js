/*!
  N-Player. | © Nick Freear, 26-June-2018.
*/

const RSSParser = require('rss-parser'); // Or, window.RSSParser?!
const CONFIG = require('./src/configure');
const PODCAST = require('./src/podcast');
const PLAYER = require('./src/player');

CONFIG.query = window.location.search;

console.warn('N-player config:', CONFIG);

PLAYER.setConfig(CONFIG);

if (PODCAST.isPodcast(CONFIG)) {
  const promise = PODCAST.parse(CONFIG, RSSParser);

  console.warn('N-player, promise:', promise);

  promise.then(PLAYER.inject).catch(function (err) {
    console.error('N-player Error:', err);
    // console.dir(new Error('test'));
  });
} else {
  console.warn('N-player.', 'No podcast found in URL.');
}
