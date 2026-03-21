/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['i.scdn.co'],
  },
}

module.exports = nextConfig
