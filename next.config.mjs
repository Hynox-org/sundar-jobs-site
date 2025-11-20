/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      // This alias might be needed if `lucide-react` itself has a native specific entry point
      // or if it's being mis-interpreted.
      // However, the error is specifically about SVG attributes, not module resolution for lucide-react.
      // We will try to specifically address the `size` prop issue for lucide-react if aliases don't work.
    };

    // Rule to potentially transform lucide-react imports if they are explicitly using `size` prop
    // This is a more complex approach and might require a custom Babel plugin or loader,
    // which is beyond the scope of a simple webpack config.
    // For now, let's keep the `react-native-web` alias which often helps with cross-platform setups.

    return config;
  },
}

export default nextConfig
