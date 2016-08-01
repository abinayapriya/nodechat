var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//require node modules (see package.json)
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var fs = require('fs');
users = [];
connections = [];

app.get('/', function(req, res){
  
    
  res.sendFile(__dirname + '/index.html');
  
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('\n\n%s sockets connected',connections.length);
 

  socket.on('disconnect', function(){
    users.splice(users.indexOf(socket.users),1);
    updateusernames();
    connections.splice(connections.indexOf(socket),1);
	 
    console.log(socket.users+' has disconnected.\n %s sockets are connected',connections.length);
	console.log('\n==>'+socket.users+' LOGGED OUT');
	var moder='offline';
	updateoffline(socket.users,moder);
   });
   
   
   
   
   
  
  
  socket.on('newuser',function(data){
      if(users.indexOf(data)!=-1){
        io.sockets.emit('err','username is already in use!! Try another');
      }
      else{
		 console.log('\n==>'+data+' LOGGED IN');
      socket.users = data;
      users.push(socket.users);
	  var moder='online';
      updateusernames();
      updateusers(socket.users);
	  updateonline(socket.users,moder);
    }
	
  });

  function updateusers(user,mode){
			//connect away //mongoDB
			MongoClient.connect('mongodb://127.0.0.1:27017/user', function(err, db) {
			if (err) throw err;

			db.collection('users').deleteOne( { username: user } );
		   console.log("online record deleted");
			
           			//simple json record
			var document = {username:user,status:mode};
           
			//insert record
			db.collection('users').insert(document, function(err, records) {
			if (err) throw err;
			console.log("user Record added");
			
			
			
	});
});


//mongoDB end
  }
	
	function updateusernames(){
    io.sockets.emit('username',users);
	
  }
  

 
  socket.on('texting', function(data){
  io.sockets.emit('resp',{user:socket.users,msg:data});
   
 }); 
 

});

server.listen(3000,"192.168.0.18");
console.log('server running..');