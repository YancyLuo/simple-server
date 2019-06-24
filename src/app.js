const http = require('http')
const chalk = require('chalk')
const route = require('./helper/route')
const conf = require('./config/serverConfig')
const open = require('./helper/open')

module.exports = class Server {
  constructor(config) {
    this.config = Object.assign({}, conf, config)
  }

  start() {
    const { host, port, exclusive } = this.config
    const addr = `http://${host}:${port}`
    const server =  http.createServer((req, res) => {
      route(req, res, this.config)
    })
  
    server.listen({host, port, exclusive}, () => {
      console.log(`server is started at ${chalk.green.underline(addr)}`)
      open(addr)
    })
  }
}


