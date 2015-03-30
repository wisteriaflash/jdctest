var fs = require('fs')  //文件操作
    , http = require('http')    //http服务器
    , socketio = require('socket.io');    //socket.io，用来和前台进行交互

var server = http.createServer(function(req, res){
  res.writeHead(200, { 'Content-type': 'text/html' });

  //将index.html输出
  res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(3000, function(){
  console.log('Listening at: http://localhost:3000');
});


//连接成功的回调
socketio.listen(server).on('connection', function(socket){
  socket.on('message', function(msg){
    console.log('接收到', msg);
    //将信息发送给其他客户端
    socket.broadcast.emit('message', msg);
  });
});