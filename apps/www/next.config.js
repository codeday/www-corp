/* eslint-disable node/no-process-env */
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { apiFetch } = require("@codeday/topo/utils");

module.exports = {
  turbopack: {
    rules: {
      "*.gql": {
        loaders: ["./gql-loader.js"],
        as: "*.js",
      },
    },
  },
  webpack: (config, { isServer }) => {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries["main.js"] && !entries["main.js"].includes("./src/polyfills.ts")) {
        entries["main.js"].unshift("./src/polyfills.ts");
      }

      return entries;
    };

    config.module.rules.push({
      test: /\.gql$/,
      exclude: /node_modules/,
      use: [require.resolve("./gql-loader.js")],
    });

    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        }),
      );
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "f2.codeday.org",
      },
    ],
  },
  async redirects() {
    const { cms } = await apiFetch("{ cms { regions { items { webname aliases } } } }");
    const webnames = (cms && cms.regions && cms.regions.items ? cms.regions.items : []).flatMap(
      (r) => [r.webname, ...(r.aliases || [])],
    );
    const staticRedirects = [
      {
        source: "/privacy/controls",
        destination: "/f/data-controls",
        permanent: false,
      },
      {
        source: "/legal/privacy/controls",
        destination: "/f/data-controls",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/legal/privacy",
        permanent: false,
      },
      {
        source: "/privacy/third-party",
        destination: "/legal/privacy",
        permanent: false,
      },
      {
        source: "/conduct",
        destination: "/legal/code-of-conduct",
        permanent: false,
      },
      {
        source: "/conduct/report",
        destination: "/f/conduct-report",
        permanent: false,
      },
      {
        source: "/volunteer/purchase",
        destination: "/f/purchasing",
        permanent: false,
      },
      {
        source: "/volunteer/paragon",
        destination: "/f/paragon",
        permanent: false,
      },
      {
        source: "/volunteer/swag",
        destination: "/f/swag",
        permanent: false,
      },
      {
        source: "/organize",
        destination: "https://event.codeday.org/organize",
        permanent: false,
      },
      {
        source: "/volunteers",
        destination: "/volunteer",
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
};
