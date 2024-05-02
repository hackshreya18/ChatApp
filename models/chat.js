const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    message:{
        type:String,
        maxLength: 40,
        require:true
    },
    created_at:{
        type:Date,
        required:true
    },  
})

const Chat= new mongoose.model("Chat",chatSchema);
// const chat1= new Chat({
//     from:"Shreya",
//     to:"Puneet",
//     message:"Are you doing well?",
//     created_at:new Date(),
// })
//     chat1.save().then((res)=>{
//             console.log(res);
//        }).catch((err)=>{
//             console.log(err);
//        })
module.exports=Chat; 

