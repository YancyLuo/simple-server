const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const mime = require('mime')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const compressFunc = require('./compress')
const rangeFunc = require('./range')
const cacheFunc = require('./cache')

module.exports = async function (req, res, config) {
  const {host, port, root, compress} =config
  const addr = `http://${host}:${port}`
  const filepath = path.join(root, req.url)
  try {
    const stats = await stat(filepath)
    const useCache = cacheFunc(stats, req, res)
    if (useCache) {
      res.statusCode = 304
      res.end()
      return
    }
    if (stats.isFile()) {
      res.setHeader('Content-type', mime.getType(filepath) ? mime.getType(filepath) : 'text/plain')
      // fs.readFile(filepath, (err, data) => {
      //   if (err) throw err
      //   res.end(data)
      // })
      const range = rangeFunc(stats.size, req, res)
      let rs = null
      if (range.code === 200) {
        res.statusCode = 200
        rs = fs.createReadStream(filepath)
      }
      if (range.code === 206) {
        res.statusCode = 206
        rs = fs.createReadStream(filepath, {
          start: range.start,
          end: range.end
        })
      }
      if (filepath.match(compress)) {
        rs = compressFunc(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) {
      res.statusCode = 200
      res.setHeader('Content-type', 'text/html')
      const files = await readdir(filepath)
      let items = files.map( async (file) => {
        let href = addr + req.url + '/' + file
        let newHref = href.replace(/([^:])\/{2}/g, '$1/')
        let type = ''
        const fileStats = await stat(filepath + '/' + file)
        if (fileStats.isDirectory()) {
          type = 'folder'
        }
        if (fileStats.isFile()) {
          type = mime.getType(filepath + '/'+ file) ? mime.getExtension(mime.getType(filepath + '/'+ file)) : 'unknow'
        }
        return `<li>[${type}]&nbsp;&nbsp;<a href='${newHref}'>${file}</a></li>`
      })
      Promise.all(items).then(lis => {
        res.end(`<title>${path.basename(filepath)}</title><ul>${lis.join(' ')}</ul>`)
      })
      
    }
  } catch (err) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    console.error(chalk.redBright(err.toString()))
    res.end('No resources were found')
  }
  
}