/*
  Parse podcast RSS feeds | © Nick Freear, 26-June-2018.
*/

const RSSParser = require('rss-parser');

module.exports = function (CFG) {
  const promise = new Promise(function (resolve, reject) {
    var bMatch = false;

    CFG.providers.forEach(function (POD, idx, AR) {
    // for (idx = 0; idx < CFG.providers.length; idx++) {

      // const POD = CFG.providers[ idx ];

      const qm = window.location.search.match(POD.regex);

      // const POD = CFG.oupodcast;

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

      TRY_ID.title = TRY_ID.tid; /// .replace(/-/g, ' ');

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

      parser.parseURL(CFG.cors_proxy + RSS_URL, function (err, feed) {
        if (err) {
          // TODO:
          reject(err);
          return;
        }

        console.log(feed.title, ':', feed.items.length, feed.image.url[ 0 ]);

        const FOUND_ITEM = feed.items.find(function (entry) {
          const TRY_TITLE = entry.title.replace(/[^\w]/g, '-');

          return TRY_TITLE === TRY_ID.title;
        });

        if (FOUND_ITEM) {
          console.warn('A match!', FOUND_ITEM);

          resolve(FOUND_ITEM);
        } else {
          reject(new Error([ 'Item not found in RSS feed. ', TRY_ID.title, RSS_URL ]));
        }

        /* feed.items.forEach(function (entry) {
          const TRY_TITLE = entry.title.replace(/[^\w]/g, '-');

          if (TRY_TITLE === TRY_ID.title) {
            console.warn('A match!', entry);

            bMatch = true;

            resolve(entry);
          }
          else {
            console.warn('No match!!', TRY_ID, TRY_TITLE);
          }
          // console.log(entry.title + ':' + entry.link);
        }); */
      });
    }); // CFG.providers.forEach()

    if (!bMatch) {
      // TODO: reject( 'ERROR 01' );
    }
  }); // new Promise.

  return promise;
};
