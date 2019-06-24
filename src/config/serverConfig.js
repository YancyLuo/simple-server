module.exports = {
  root: process.cwd(),
  port: '3000',
  host: 'localhost',
  exclusive: true,
  compress: /\.(html|js|css|md|json)/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}