/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not set `webpack.cache = false` in dev, and do not set env
  // `NEXT_DISABLE_WEBPACK_CACHE=1` in npm scripts: both break hashed CSS/chunk
  // resolution (`layout.css` 404, missing `./682.js` in webpack-runtime).
  // `npm run dev` clears `.next` + `node_modules/.cache` for a clean graph instead.
};

export default nextConfig;
