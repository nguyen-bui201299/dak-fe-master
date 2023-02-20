const withOptimizedImages = require('next-optimized-images');

module.exports = {
  reactStrictMode: false,
  experimental: {
    concurrentFeatures: true,
    outputStandalone: true
  },
  withOptimizedImages: {
    optimizeImages : true,
    optimizeImagesInDev: true,
    handleImages: [/.*\.jpg$/, /.*\.png$/],
    imagesFolder: '/public/images',
  },
  //Set URL cho file iamge có URL ngoài folder public.
  images: {
    domains: ["storage.dakshow.com", "i.stack.imgur.com","test.com"],
  },
};
