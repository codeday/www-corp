module.exports = {
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
