'use strict';

const {protocol} = require('electron')
const path = require('path')

protocol.registerStandardSchemes(['atom'])

const jsonresponse = (data) => {
  return {
    mimeType: 'application/json',
    data: new Buffer(JSON.stringify(data))
  }
}

const Routes = [{
  path: 'rawdata',
  exec: (cb) {
    let res = {};
    return cb(jsonresponse(res));
  }
}]


module.exports = function register() {
  protocol.registerBufferProtocol('atom', (request, callback) => {
    const url = request.url.substr(7)

    for (let {path, exec} of Routes) {
      if (url === path)
        return exec(callback);
    }

    callback({path: path.normalize(`${__dirname}/${url}`)})
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })
}
