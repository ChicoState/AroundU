const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
  },
  webpack(config) {
    const svgRule = config.module.rules.find(
      (rule) =>
        rule.test && rule.test instanceof RegExp && rule.test.test('.svg'),
    );
    if (svgRule) {
      svgRule.exclude = /\.svg$/;
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
