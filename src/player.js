/*
  User-interface | © Nick Freear, 26-June-2018.
*/

module.exports = {
  setConfig: setConfig,
  inject: inject
};

var CFG;

function setConfig (config) {
  CFG = config;
}

function inject (entry) {
  const N_PLAYER = q(CFG.container);

  const PG_TITLE = q('head title');

  const TITLE = q('.title', N_PLAYER);
  const DESC = q('.desc', N_PLAYER);
  const AUTHOR = q('.author', N_PLAYER);
  const DATE = q('.date', N_PLAYER);
  const TRANS = q('.transcript', N_PLAYER);
  const VIDEO = q('video', N_PLAYER);
  const AUDIO = q('audio', N_PLAYER);

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
  }

  PG_TITLE.innerText = entry.title;

  TITLE.innerText = entry.title;
  DESC.innerHTML = entry.content;
  AUTHOR.innerText = entry.itunes.author;
  DATE.innerText = entry.pubDate;
  DATE.setAttribute('title', entry.isoDate);

  if (entry[ 'atom:link' ]) {
    TRANS.setAttribute('href', entry[ 'atom:link' ][ '$' ].href);
    TRANS.setAttribute('title', entry[ 'atom:link' ][ '$' ].title);
    TRANS.innerText = entry[ 'atom:link' ][ '$' ].title;
  }
}

function q (selector, container) {
  return (container || document).querySelector(selector);
}
