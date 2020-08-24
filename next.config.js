/* eslint-disable node/no-process-env */

if (process.env.ANALYZE === 'true') {
  module.exports = require('@next/bundle-analyzer')({
    enabled: true,
  })({});
}
