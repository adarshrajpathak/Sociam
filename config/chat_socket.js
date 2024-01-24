//observer- Sending(emit)&receiving(on) on the server side
module.exports.chatSockets=function(socketServer){  //receiving chatSockets here
    let io=require('socket.io')(socketServer, {
        cors: {
          origin: '*',
        }
      });

    io.sockets.on('connection',function(socket){
        console.log('New connection recieved',socket.id);

        socket.on('disconnect',function(){
            console.log('Socket Disconnected');
        })

        socket.on('join_room',function(data){ //detect the event sent by the client chatSocket
            console.log('joining request rec.',data);

            socket.join(data.chatroom); //if exits?connected:create new room
            
            io.in(data.chatroom).emit('user_joined',data);  //notify all user in the chatroom(sociam) of new user joind
        })

        //detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){
          io.in(data.chatroom).emit('receive_message',data);
        })
    })

}