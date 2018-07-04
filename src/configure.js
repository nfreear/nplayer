/*
  Configuration | © Nick Freear, 26-June-2018.
*/

const DEFAULTS = {
  container: '#n-player',
  // Note: some RSS feeds can't be loaded in the browser due to CORS security.
  // To get around this, you can use a proxy.
  cors_proxy: 'https://cors-anywhere.herokuapp.com/',
  debug: true,
  providers: [
    {
      name: 'OU Podcasts',
      regex: /\?oup(?:odcast)?:([a-z0-9-]+)\/([\w-]+)(?:&|$)/,
      rss_url: 'https://podcast.open.ac.uk/feeds/%s/rss2.xml',
      // url: 'https://podcast.open.ac.uk/feeds/%s/player.xml'
      opml_url: 'https://podcast.open.ac.uk/rss/opml.xml',
      example: {
        p: [ null, 'thoughtexperiments-01', 'Achilles-and-the-Tortoise' ],
        query: '?oup:thoughtexperiments-01/Achilles-and-the-Tortoise',
        url: 'https://podcast.open.ac.uk/feeds/thoughtexperiments-01/rss2.xml'
      }
    }, {
      name: 'BBC Podcasts',
      regex: /\?bbc:(p[a-z0-9-]{7})\/([\w-]+)(?:&|$)/,
      rss_url: 'https://podcasts.files.bbci.co.uk/%s.rss',
      opml_url: 'https://www.bbc.co.uk/podcasts.opml',
      example: {
        p: [ null, 'p02nrvdq', 'Neil-s-photo-fiasco-and-other-tales---', 'Neil\'s photo fiasco and other tales...' ],
        query: '?bbc:p02nrvdq/Neil-s-photo-fiasco-and-other-tales---',
        url: 'https://podcasts.files.bbci.co.uk/p02nrvdq.rss'
      }
    }
  ]
};

console.warn('Config:', DEFAULTS);

module.exports = /* extends ... */ DEFAULTS;
