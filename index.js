const express=require("express");
const app=express();
const path=require("path");
const port=8080;
const mongoose=require("mongoose");
const Chat=require("./models/chat");
const methodOverride = require('method-override');
const ExpressError=require("./ExpressError");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname , '/public')));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));

main()
.then(()=>{
    console.log("Connection built");
}).catch((err)=>{
    console.log("error found",err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ChatApp');
}

app.listen(port,()=>{
    console.log("Server is listening to 8080 port");
});

// //Home Route:
app.get("/",(req,res)=>{
    res.render("home.ejs");
})

//Index Route:
app.get("/chats",asyncWrap(async(req,res,next)=>{
    // try{
        let chats= await Chat.find(); //asynchronous function(so use await and make function async)
        res.render("index.ejs",{chats});
    // }catch(err){
    //     next(err);
    // }   
})
);

//New Route:
app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404,"Page not found");
    res.render("new.ejs");
})

//Create Route:
app.post("/chats",asyncWrap( async(req,res,next)=>{
    // try{ 
        let {from,message,to}=req.body;
        let newChat =new Chat({
        from:from,
        to:to,
        message:message,
        created_at:new Date(),
    });
    await newChat.save();
    res.redirect("/chats",);
    // }
    // catch(err){
    //     // next(new ExpressError(404,"data is required"));
    //     // or
    //     next(err);
    // }
})
);
// if we are using asyncWrap no need to use try-catch:

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

//NEW-Show Route:
app.get("/chats/:id/show",asyncWrap(async(req,res,next)=>{  
        let {id}=req.params;
        let chat= await Chat.findById(id);
        if(!chat){
           next(new ExpressError(404,"Chat not found"));
        } //or with try-catch as well
        res.render("show.ejs",{chat});      
    })
);

//Edit Route:
app.get("/chats/:id/edit",asyncWrap(async(req,res)=>{
        let {id}= req.params;
        let chat= await Chat.findById(id);
        res.render("edit.ejs",{chat});   
})
);

//Update Route:
app.put("/chats/:id",asyncWrap(async(req,res)=>{
        let {id}=req.params;
        let {message}=req.body;
        updateChat= await Chat.findByIdAndUpdate(
            id,
            {message:message},
            {runValidator:true,new:true}
          );
        res.redirect("/chats");
    })
);

//Delete Route:
app.delete("/chats/:id",asyncWrap( async (req,res)=>{
    
        let {id}=req.params;
        const chat=await Chat.findByIdAndDelete(id);
        console.log(`deleted:${chat}`);
        res.redirect("/chats");
        
   })
);

const handleValidator=(err)=>{
    console.log("This was a Validation Error.Follow the rules carefully.");
    console.log(err.message);
    return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
       err= handleValidator(err);
    }
    next(err);
})

//Error handling MiddleWare
app.use((err,req,res,next)=>{
    let {status=500,message="Access Denied"}=err;
    res.status(status).send(message);
});