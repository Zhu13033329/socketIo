var express = require('express')
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//socket服务器监听链接，表示已经建立
var count =  0;
var allPeople='';
io.on('connection', function (socket) {
  socket.on('login',function(data){
  	//把用户名存到对象上
  	socket.username = data;
  	allPeople=`${allPeople},${data}`
  	console.log(allPeople)
  	console.log(data + "登入了")
  	//更新房间人
  	count = count + 1;
  	console.log(count)
  	socket.emit('count',count)
  	socket.emit('allPeople',allPeople)
  })
  //监听客户端发送过来的事件
  socket.on('send', function (data) {
  	//向客户端发送信息
  	//向所有客户端
    io.emit('msg',{user:socket.username,msg:data});
  });
  //当有人推出链接时
  socket.on('disconnect',function(){
  	count--;
  	socket.emit('count',count)
  })
})


app.get('/',function(req,res){
	res.send('Hello World')
})
//静态文件中间件
app.use(express.static(__dirname + "/static"))




app.get('*',function(req,res){
	//发送文件  参数是文件路劲  __dirname:表示的是根路径
	//在则表示F:\tryCode\chatroom
	res.sendFile(__dirname + '/view/1.html')
})
server.listen(3000)