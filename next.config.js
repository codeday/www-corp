const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: (config, {
    isServer,
  }) => {
    // eslint-disable-next-line node/no-process-env
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
    return [
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
    ];
  },
};
