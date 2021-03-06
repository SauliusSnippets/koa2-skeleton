/*
* @Author: lizhonghui
* @Date:   2016-09-06 13:36:08
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-16 22:05:28
*/

const _ = require("lodash");
const fs = require("fs");
const path = require('path');

let config = require('./base');

let env = 'dev', debug = false;
switch(process.env.NODE_ENV) {
  case 'dev':
  case 'development':
    env = 'dev';
    debug = true;
    break;
  case 'test':
    env = 'test';
    break;
  case 'uat':
    env = 'uat';
    break;
  default:
  case 'prod':
  case 'production':
    env = 'prod';
    break;
}

let envFilePath = path.join(__dirname, `env/${env}.js`);
if(fs.existsSync(envFilePath)) {
  try {
    let envConfig = require(envFilePath);
    if(envConfig) {
      _.merge(config, envConfig);
    }
    config.debug |= debug;
    config.env = env;
  }
  catch(_) {
    console.error(`failed to load ${env} config file!`);
  }
}

module.exports = Object.freeze(config);

