const yargs = require('yargs')
const Server = require('./app.js')
const argv = yargs.usage('simpleserver[options]')
                  .option('p', {
                    alias: 'port',
                    describe: 'Port of server',
                    defalult: '3000'
                  })
                  .option('h', {
                    alias: 'host',
                    describe: 'Host of server',
                    defalult: 'localhost'
                  })
                  .version()
                  .alias('v' ,'version')
                  .help()
                  .argv

const server = new Server(argv)
server.start()