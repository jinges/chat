/*
 * @Author: 大明冯 
 * @Date: 2018-08-31 16:57:15 
 * @Last Modified by: 大明冯
 * @Last Modified time: 2018-09-04 17:47:25
 */

import IO from 'koa-socket-2';

const io = new IO();


export default (app) => {
  io.attach(app);

  io.on('connection', (ctx) => {
    const socket = ctx.socket;
    socket.emit('connect_ok', 'connect ok')
    
    socket.on('join_game', (data) => {
      let waiting_user = global.waiting_user;
      let playing_user = global.playing_user;
      console.log(data)
      if (playing_user && playing_user.includes(data.socketId)) {
        return false;
      }
      
      if (waiting_user && waiting_user.length) {
        const prev_game_user = waiting_user.shift();
        const houseId = prev_game_user.houseId;

        
        socket.join(`${houseId}`, () => {
          if (!playing_user) {
            global.playing_user = [];
          } 
          global.playing_user.push(data.socketId)
          io.to(`${houseId}`).emit('game_ready', {
            houseId,
            msg: 'start load game resource'
          });
        })
        return false;
      }
      
      //新加入成员等待对方加入
      const houseId = (new Date()).getTime();
      let obj = {
        houseId,
        msg: 'placese waitting other join.'
      }
      Object.assign(obj, data)
      if (!global.waiting_user) {
        global.waiting_user = [];
      }
      global.waiting_user.push(obj);
      socket.join(`${houseId}`, () => {
        io.to(`${data.socketId}`).emit('game_wait', obj);
      })
    })

    socket.on('game_push_msg', (data) => {
      io.to(data.houseId).emit('game_msg', data)
    })

    socket.on('disconnect', function (data) {
      console.log(data)
    })
  })
}
