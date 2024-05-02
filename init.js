const mongoose=require("mongoose");
const Chat=require("./models/chat");

main()
.then(()=>{
    console.log("Connection built");
}).catch((err)=>{
    console.log("error found",err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ChatApp');
}

let allChats=[
    {
        from:"Mahi",
        to:"Sachin",
        message:"How are you brother??",
        created_at:new Date(),
    },
    {
        from:"Rohan",
        to:"Raj",
        message:"Send me the notes for exam",
        created_at:new Date(),
    },
    {
        from:"Ridhi",
        to:"Shreya",
        message:"When are you going to join the team?",
        created_at:new Date(),
    },
    {
        from:"Ram",
        to:"Pankaj",
        message:"Are you joining us tonight?",
        created_at:new Date(),
    },
    {
        from:"Rama",
        to:"Shrey",
        message:"I am very excited for upcoming matches.",
        created_at:new Date(),
    },

]

Chat.insertMany(allChats);

