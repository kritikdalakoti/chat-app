const users=[]
//add users //remove users //get users  //get users in a room

const adduser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase(),
    room =room.trim().toLowerCase()
    // validate the data
    if(!username||!room){
        return{
            error:'username and room are required'
        }
    }
    //check for existing user
    const existinguser=users.find((user)=>{
        return user.room===room&& user.username===username
    })
    //validate username
    if(existinguser){
        return{
            error:'username is in use!'
        }
    }
    //store the user
    const user={id,username,room}
    users.push(user)
    return{user}
}

const removeuser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)//-1 for no match and 0 or greater if matched

    if(index!==-1){
        return users.splice(index,1)[0]  // it would remove matching index from users splice takes the index and how many values to remove
            
    }
}

const getuser=(id)=>{
    return users.find((user)=> user.id===id
    )
}
const getusersinroom=(room)=>{
   return  users.filter((user)=> user.room===room)
}
module.exports={
    adduser,
    removeuser,
    getuser,
    getusersinroom
}

// console.log(getuser(40))
//console.log(getusersinroom('naughty'))
