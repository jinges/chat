/*
 * @Author: 大明冯 
 * @Date: 2018-08-30 16:14:49 
 * @Last Modified by: 大明冯
 * @Last Modified time: 2018-09-03 17:38:23
 */

import Koa from 'koa';
import socket from './socket';

const app = new Koa();

socket(app)

app.listen(process.env.PORT || 3000, () => {
  console.log('open localhost: 3000')
});