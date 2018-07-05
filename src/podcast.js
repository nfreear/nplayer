/*
  Parse podcast RSS feeds | © Nick Freear, 26-June-2018.
*/

// const RSSParser = require('rss-parser');
const PlayerError = require('./player-error');

module.exports = {
  isPodcast: isPodcast,
  parse: parse
};

function isPodcast (CFG) {
  return /\?[a-z]{2,}:\w+/.test(CFG.query);
}

function parse (CFG, RSSParser) {
  const promise = new Promise(function (resolve, reject) {
    var bMatch = false;

    CFG.providers.forEach(function (POD, idx, AR) {
    // for (idx = 0; idx < CFG.providers.length; idx++) {

      // const POD = CFG.providers[ idx ];

      const qm = CFG.query.match(POD.regex);

      console.debug('Each:', idx, POD, qm);

      if (!qm) {
        return;

        /* console.debug('Redirecting to example:', POD.example);
        window.location = window.location + POD.example.query;
        return; */
      }

      const TRY_ID = {
        provider: POD.name,
        collection: qm[ 1 ] || POD.example.p[ 1 ],
        tid: qm[ 2 ] || POD.example.p[ 2 ]
      };

      TRY_ID.title = prepareTitle(TRY_ID.tid);

      console.debug('Try:', qm, TRY_ID);

      const RSS_URL = POD.rss_url.replace(/%s/, TRY_ID.collection);
      // const REDDIT_URL = 'https://www.reddit.com/.rss';

      console.debug('RSS:', RSS_URL);

      let parser = new RSSParser({
        customFields: {
          feed: [ 'image', 'itunes:image' ],
          item: [ 'atom:link', 'itunes:duration', 'oupod:iframe', 'oup:aspect_ratio', 'media:thumbnail' ]
        }
      });

      parser.parseURL(CFG.corsProxy + RSS_URL, function (err, feed) {
        if (err) {
          // TODO:
          reject(err);
          return;
        }

        console.log(feed.title, ':', feed.items.length, feed.image.url[ 0 ]);

        const FOUND_ITEM = feed.items.find(function (entry) {
          return prepareTitle(entry.title) === TRY_ID.title;
        });

        if (FOUND_ITEM) {
          console.warn('A match!', FOUND_ITEM);

          resolve(FOUND_ITEM);
        } else {
          reject(new PlayerError('Item not found in RSS feed.', 404.1, [ TRY_ID.title, RSS_URL ]));
        }
      });
    }); // CFG.providers.forEach()

    if (!bMatch) {
      // TODO: reject( 'ERROR 01' );
    }
  }); // new Promise.

  function prepareTitle (title) {
    // const RE_SIZE = new RegExp('^(.+){4,%s}'.replace('%s', CFG.titleCompSize));
    // title.replace(/\.+$/, '').replace(/[^\w]/g, '-').replace(RE_SIZE, '$&');

    const TRY_TITLE = title.substr(0, CFG.titleCmpSize).replace(/\.+$/, '').replace(/[^\w]/g, '-');

    console.warn('prepareTitle:', [ title, TRY_TITLE ]);

    return TRY_TITLE;
  }

  return promise;
}
