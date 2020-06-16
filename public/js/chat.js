const socket=io()
//elements
const messageform=document.querySelector('#message-form')
const messageforminput=messageform.querySelector('input')
const messageformbutton=messageform.querySelector('button')
const messages=document.querySelector('#messages')

//templates
const messagetemplate=document.querySelector('#message-template').innerHTML//this innerhtml will give access to the html prop.
const locationtemplate=document.querySelector('#location-template').innerHTML
const sidebartemplate=document.querySelector('#sidebartemplate').innerHTML
//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})//by default is false would ignore ?

const autoscroll=()=>{
    //new message element
    const newmessage=messages.lastElementChild//new msg that came
    const newmsgstyles=getComputedStyle(newmessage)
    //height of new msg
    const newmessagemargin=parseInt(newmsgstyles.marginBottom)//converting 16 px to int as 16
    const newmessageheight=newmessage.offsetHeight+newmessagemargin
//visible height it will not change this is theheight we see normally and for height above this we have to scroll

const visibleheight=messages.offsetHeight

//height of messages container
const containerheight=messages.scrollHeight//total height to scroll
//how far i have scrolled
const scrolloffset=messages.scrollTop+visibleheight//this func scrolltop returns a no of how much we have scrolled

    if(containerheight-newmessageheight<=scrolloffset){//confirming we were at the bottom and read latest msg
        messages.scrollTop=messages.scrollHeight//set the value of scroll top thus pushing us to bottom page
    }

    console.log(newmessageheight)
}

socket.on('message',(msg)=>{
    console.log(msg)
    const html=Mustache.render(messagetemplate,{
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a'),
        username:msg.username
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationmessage',(url)=>{
    const html=Mustache.render(locationtemplate,{
        url:url.url,
        createdAt:moment().format('h:mm a'),
        username:url.username
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomdata',({room,users})=>{
    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html //we r selecting the sidebar div where we'll show all this sidebar data 
})

messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    const msg2=e.target.elements.message.value//this is done just for if a form has more than one input.
    //here target refers to the form and message is the name given to the particular input.
    // console.log(msg2.value)
    messageformbutton.setAttribute('disabled','disabled')

    socket.emit('sendmessage',msg2,(error)=>{
        messageformbutton.removeAttribute('disabled')
        messageforminput.value=''
        messageforminput.focus()
        if(error)
        return console.log(error)
        console.log('message delivered!')
    })
})

const locationbutton=document.querySelector('#sendlocation')
locationbutton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    return alert('geolocation is not supported by your browser!')

    locationbutton.setAttribute('disabled','disable')

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('send location',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            locationbutton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})



