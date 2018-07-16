/*
  User-interface | © Nick Freear, 26-June-2018.
*/

const PlayerError = require('./player-error');

module.exports = {
  setConfig: setConfig,
  setQuery: setQuery,
  inject: inject
};

var CFG;
const QUERY = window.location.search;

function setConfig (config) {
  CFG = config;
}

function setQuery (config) {
  config.query_orig = QUERY;
  config.query = QUERY.replace(/%\d\d/g, '-');
}

function inject (entry) {
  const N_PLAYER = q(CFG.container);

  const PG_TITLE = q('head title');

  const TITLE = q('.np-title', N_PLAYER);
  const DESC = q('.np-desc', N_PLAYER);
  const AUTHOR = q('.np-author', N_PLAYER);
  const DATE = q('.np-date', N_PLAYER);
  const DURATION = q('.np-duration', N_PLAYER);
  const TRANS = q('.np-transcript', N_PLAYER);
  const DOWNLOAD = q('.np-download', N_PLAYER);
  const VIDEO = q('video', N_PLAYER);
  const AUDIO = q('audio', N_PLAYER);

  const DATA = q('.np-data', N_PLAYER);

  console.warn('Player:', CFG, N_PLAYER, entry);

  const IS_VIDEO = entry.enclosure.type.match(/^video\//);
  const IS_AUDIO = entry.enclosure.type.match(/^audio\//);

  if (IS_VIDEO) {
    N_PLAYER.className += ' video-player';

    VIDEO.setAttribute('src', entry.enclosure.url);
    VIDEO.setAttribute('poster', entry[ 'media:thumbnail' ][ '$' ].url);
  } else if (IS_AUDIO) {
    N_PLAYER.className += ' audio-player';

    AUDIO.setAttribute('src', entry.enclosure.url);
  } else {
    // TODO?
    throw new PlayerError('Unsupported MIME type.', 400.2, [ entry.enclosure.type, entry ]);
  }

  DOWNLOAD.setAttribute('href', entry.enclosure.url);
  // DOWNLOAD.setAttribute('title', 'Download (%s)'.replace(/%s/, entry.itunes.duration));

  PG_TITLE.innerText = entry.title;

  TITLE.innerText = entry.title;
  TITLE.setAttribute('title', entry.title);
  DESC.innerHTML = entry.content;
  AUTHOR.innerText = entry.itunes.author;
  DATE.innerText = entry.pubDate;
  DATE.setAttribute('title', entry.isoDate);
  DURATION.innerText = entry.itunes.duration;

  if (entry[ 'atom:link' ]) {
    TRANS.setAttribute('href', entry[ 'atom:link' ][ '$' ].href);
    TRANS.setAttribute('title', entry[ 'atom:link' ][ '$' ].title);
    TRANS.innerText = entry[ 'atom:link' ][ '$' ].title;
  }

  DATA.innerHTML = JSON.stringify({ feed: {}, entry: entry, config: CFG }, null, 2);
}

function q (selector, container) {
  return (container || document).querySelector(selector);
}
