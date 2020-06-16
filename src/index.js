
const express= require('express')
const {generatemessage,generatelocation} =require('./utils/messages')
const http=require('http')//just a refactoring this is also creating a server only like express.

const socket=require('socket.io')
const Filter=require('bad-words')
const app=express()

const server=http.createServer(app)
const io=socket(server)//thats why we created a raw http server as socket.io requires that only so that it could fit here with express server it was not possible.
//and this above created server called 'server ' is same as the express server and also now supports socket.io
const port=process.env.PORT||3000
const path=require('path')
console.log(__dirname)
const publicdirpath=path.join(__dirname,'../public')
const {adduser,removeuser,getuser,getusersinroom}=require('./utils/users.js')

io.on('connection',(socket)=>{
    console.log('new websocket connection up !!')

    

    socket.on('join',({username,room},callback)=>{
        const {error,user}=adduser({id:socket.id,username,room})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generatemessage('admin','welcome!'))
    socket.broadcast.to(user.room).emit('message',generatemessage(user.username+' has joined'))
        //io.to.emit-> sends messages to specific room ,socket.broadcast.to.emit-> sends to everyone except the sender and also in a particular room
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getusersinroom(user.room)
        })

        callback()
    })
    
    socket.on('sendmessage',(msg3,callback)=>{
        const filter=new Filter()

        if(filter.isProfane(msg3))
        return callback('profanity is not allowed!')
        
        const user=getuser(socket.id)

        io.to(user.room).emit('message',generatemessage(user.username,msg3))
         callback()
         })

        socket.on('send location',(loc,callback)=>{
            const user=getuser(socket.id)
            socket.broadcast.to(user.room).emit('locationmessage',generatelocation(user.username,'https://google.com/maps?q='+loc.latitude +','+ loc.longitude))

            callback()
        }) 

        
            socket.on('disconnect',()=>{

            const user=removeuser(socket.id)

            if(user){
                io.to(user.room).emit('message',generatemessage('admin',user.username +' has left! '))

                io.to(user.room).emit('roomdata',{
                    room:user.room,
                    users:getusersinroom(user.room)
                })
            }
        })

})

app.use(express.static(publicdirpath))
app.get('',(req,res)=>{
    res.render('index',()=>{
        
    })
})


server.listen(port,()=>{
     console.log('server is up at port 3000')
 })