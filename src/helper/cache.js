// Expires(Absolute time of caching), Cache-Control(Relative time of caching)
// If-Modified-Since / Last- Modified (Check trough time)
// If-None-Match/ ETag

const { cache } = require('../config/serverConfig.js')

const init = (stats, res) => {
  const {maxAge, expires, cacheControl, lastModified, etag} = cache

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  }

  if(expires) {
    res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString())
  }

  if(lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString())
  }

  if(etag) {
    res.setHeader('Etag', `${stats.size}-${ stats.mtime}`)
  }
}

module.exports = (stats, req, res) => {
  init(stats, res)
  const lastModified = req.headers['if-modified-since']
  const etag = req.headers['if-none-match']
  if (!lastModified && !etag) {
    return false //get new resource
  }
  
  if ( lastModified && lastModified !== res.getHeader('Last-Modified') ) {
    return false 
  }

  if ( etag && etag !== res.getHeader('Etag')) {
    return false
  }

  return true // 304
}