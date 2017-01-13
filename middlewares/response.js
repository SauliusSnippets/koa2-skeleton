/*
* @Author: lizhonghui
* @Date:   2017-01-10 16:13:34
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-13 16:54:45
*/

const Errors = require('../libs/errors');
const config = require('../config');
const logger = require('../libs/logger');
const _ = require('lodash');

const codeMark = 'code';
const dataMark = 'data';
const msgMark = 'msg';

module.exports = async function(ctx, next) {
  try {
    await next();
    if(ctx.resBody) {
      ctx.body = ctx.resBody;
    }
    else if(ctx.resCode) {
      ctx.body = ctx.resBody = {
        [codeMark]: ctx.resCode,
        [msgMark]: ctx.resMsg || Errors.UnknownError.msg
      }
    } else if(ctx.resData) {
      ctx.body = ctx.resBody = {
        [codeMark]: 0,
        [dataMark]: ctx.resData
      }
    }
  }
  catch(err) {
    if(!err) {
      err = new Error(Errors.UnknownError.msg);
    }
    else if(_.isString(err)) {
      err = new Error(err);
    } else {
      logger.error(err.stack);
      if(!err.expose && !config.debug) {
        // 发生了内部错误，但不会暴露给客户端，可以在log里查看具体调用栈
        err.message = Errors.UnknownError.msg;
      }
    }
    ctx.type = 'application/json';
    ctx.status = err.code ? 200 : err.status || 500;
    ctx.body = ctx.resBody = {
      [codeMark]: err.code || Errors.UnknownError.code,
      [msgMark]: err.msg || err.message
    }
  }
}