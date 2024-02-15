//subscriber- Sending(emit)&receiving(on) on the client side initialization
class ChatEngine{
    constructor(chatBoxId,userEmail){   //Id of chatbox, email of user who's initiating the connection
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.socket=io.connect('http://65.0.89.246:5000');    //socket residing via io global variable
                    //sending to observer to connect
        if(this.userEmail){
            this.connectionHandler();
        }
    }
    connectionHandler(){
        let self=this;
        this.socket.on('connect',function(){    //for recieving from the observer
            console.log('Connection established using sockets...!', self.socket.id);

            //after connected
            self.socket.emit('join_room',{  //data to be sent to observer/listener chatsocket server
                user_email:self.userEmail,
                chatroom:'Sociamroom'   //room to which join
            });
            //detect the event 
            self.socket.on('user_joined',function(data){  //data received from the chatsocket server
                console.log('A user joined',data);
            })

            //send message on clicking on the send button
            $('#send-button').click(function(){
                let msg=$('#chat-message-input').val();
                if(msg!=''){
                    self.socket.emit('send_message',{
                        message:msg,
                        user_email:self.userEmail,
                        chatroom:'Sociamroom'
                    });
                }
            });

            //detect recieve message and create msg box
            self.socket.on('receive_message',function(data){
                console.log('Message Received',data.message);
                //construct another li and append to ul
                let newMessage=$('<li>');
                //check embedded email id along the message to categorize self|other
                let messageType='other-message';
                if(data.user_email==self.userEmail){
                    messageType='self-message'
                }
                newMessage.append($('<p>',{
                    'html':data.message
                }));
                newMessage.append($('<sub>',{
                    'html':data.user_email
                }));
                newMessage.addClass(messageType);
                newMessage.addClass('chat');
                $('#chatlogs').append(newMessage);
                document.getElementById('chatlogs').scrollTop = document.getElementById('chatlogs').scrollHeight;
            })
        })
    }
}