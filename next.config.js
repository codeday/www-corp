/* eslint-disable node/no-process-env */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { apiFetch } = require('@codeday/topo/utils');

module.exports = {
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // eslint-disable-next-line node/no-process-env

    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./src/polyfills.js')) {
        entries['main.js'].unshift('./src/polyfills.js');
      }

      return entries;
    };

    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        }),
      );
    }
    return config;
  },
  images: {
    domains: ['f2.codeday.org'],
  },
  async redirects() {
    const { cms } = await apiFetch('{ cms { regions { items { webname } } } }');
    const webnames = (cms && cms.regions && cms.regions.items ? cms.regions.items : []).map((r) => r.webname);
    const staticRedirects = [
      {
        source: '/privacy/controls',
        destination: '/f/data-controls',
        permanent: false,
      },
      {
        source: '/conduct/report',
        destination: '/f/conduct-report',
        permanent: false,
      },
      {
        source: '/volunteer/purchase',
        destination: '/f/purchasing',
        permanent: false,
      },
      {
        source: '/volunteer/paragon',
        destination: '/f/paragon',
        permanent: false,
      },
      {
        source: '/volunteer/swag',
        destination: '/f/swag',
        permanent: false,
      },
      {
        source: '/organize',
        destination: 'https://event.codeday.org/organize',
        permanent: false,
      },
      {
        source: '/volunteers',
        destination: '/volunteer',
        permanent: false,
      },
    ];

    return [
      ...staticRedirects,
      ...webnames.map((webname) => ({
        source: `/${webname}`,
        destination: `https://event.codeday.org/${webname}`,
        permanent: false,
      })),
    ];
  },
  serverRuntimeConfig: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
    },
    postmark: {
      serverToken: process.env.POSTMARK_SERVER_TOKEN,
    },
    airtable: {
      token: process.env.AIRTABLE_TOKEN,
      base: process.env.AIRTABLE_BASE,
    },
  },
};
