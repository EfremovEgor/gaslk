import path from "path";
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
	turbopack: {},
	output: "standalone",
	webpack(config) {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			"@components": path.resolve(__dirname, "app/components"),
			"@lib": path.resolve(__dirname, "app/lib"),
		};
		return config;
	},
};

export default withPWA({
	dest: "public",
	register: true,
	skipWaiting: true,
	sw: "sw.js",
})(nextConfig as never);
