/** @type {import('next').NextConfig} */
const { withPlausibleProxy } = require("next-plausible");

const nextConfig = {
    compiler: {
        styledComponents: true,
    },
};

module.exports = withPlausibleProxy()(nextConfig);
