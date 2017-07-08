var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');
var ChatlistModel = require('./model/chatlist.js');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = mongoose.connect("mongodb://localhost/chat");
// var db = mongoose.connect("mongodb://AccessKeyID:195d0fc9cb9a4b2692de7e7bffae234f@localhost:8908/blog");
db.connection.on("error", function(error) {
  console.log("数据库连接失败：" + error);
});
db.connection.on("open", function() {
  console.log("——数据库连接成功！——");
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.sockets.on('connection', function(socket) {
  socket.on('login', function(nickname) { //接收登录
    if (nickname) {
      socket.nickname = nickname;
    } else {
      socket.nickname = socket.id;
    }
    socket.emit('loginSuccess', socket.id);
    // io.sockets.emit('online', socket.nickname); //广播
    io.sockets.emit('send.message', '欢迎' + socket.nickname + '进入聊天室', '0', new Date().getTime(), '小子二', '0000');
  });
  socket.on('send.message', function(msg, img, time) {
    io.sockets.emit('send.message', msg, img, time, socket.nickname, socket.id);
    saveChatList(msg, img, time, socket.nickname, socket.id);
    if (msg.indexOf('@r') > -1) {
      var data = {
        key: '7af4c8f6026e48fa9c67bde4c9a357d1',
        info: msg.split('@r')[1],
        userid: socket.nickname
      };
      request.post(
        'http://www.tuling123.com/openapi/api', {
          json: data
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (body.code == '100000') {
              io.sockets.emit('send.message', body.text, '0', new Date().getTime(), '小子二', '0000');
              saveChatList(body.text, '0', new Date().getTime(), '小子二', '0000');
            }
          }
        }
      );
    }

  });
  socket.on('disconnect', function(name) {
    // console.log(socket.nickname + '走了');
    io.sockets.emit('leave', socket.nickname);
  });

  socket.on('count',function(){
    ChatlistModel.find().count().exec(function(err,doc){
      if(err){
        console.log("error :" + err);
      }else{
        socket.emit('getcount',doc);
      }
    });
  });

  socket.on('getlist',function(count){
    var num  = count - 10;
    num = num < 0?0:num;
    ChatlistModel.find().skip(num).limit(10).exec(function(err,docs){
      socket.emit('sendlist',docs,num);
    });
  });
});

function saveChatList(msg, img, time, nickname, id) {
  var ChatlistEntity = new ChatlistModel({
    msg: msg,
    time: time,
    img: img,
    nickname: nickname,
    id: id,
  }).save(function(err, doc) {
    if (err) {
      console.log("error :" + err);
    }else{
      // console.log('储存成功')
    }
  });
}




server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
