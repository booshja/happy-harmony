import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";

const nextConfig: NextConfig = {
    images: {},
    async redirects() {
        return [];
    },
};

export default withPlausibleProxy()(nextConfig);
