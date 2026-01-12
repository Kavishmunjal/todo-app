const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const jwt_secret = "kavish"

app.use(express.json());

const users= [];
const todos = []
let currentid = 1;

//auth endpoint (signin ,signup )
app.post("/signup", function (req,res){
const username = req.body.username;
const password = req.body.password;

users.push({
      username,
      password
})

res.json({
    message : "you are sucessfully signup"
})
})

app.post("/signin", function (req,res){
const username = req.body.username;
const password = req.body.password;

let userfound = null
for(let i =0 ; i<users.length ; i++){
    if(users[i].username == username && users[i].password == password){
      userfound = users[i]
    }
}
if(userfound){
const token = jwt.sign({
    username : username
},jwt_secret)

userfound.token = token;
res.json({
    token : token
});

}

})

function auth(req,res,next){
     const token = req.headers.token;
     const decordedtoken = jwt.verify(token , jwt_secret);
     const username = decordedtoken.username;

     if(decordedtoken.username){
        req.token = decordedtoken.username;
        next(); 
     }
     else{
        res.json({
            message: "not yet loged in"
        })
     }

}

//todos creating,delete ,update ,delete 

app.get("/my-todo",auth, function (req,res){
       const mytodo= [];
       for(let i=0;i<todos.length; i++){
        if(todos[i].user === req.token) {
            myTodos.push(todos[i]);
        }
       }

       res.json(mytodo);
})

app.post("/create-todo" ,auth, function (req,res){
    let {task} = req.body;
    

    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }

      const newtodo = {
        id : currentid++,
        task : task,
        user: req.token
 }

    todos.push(newtodo);
    res.status(201).json(newtodo);
})

app.put("/update-todo",auth ,function (req,res){

})

app.delete("/delete-todo", auth , function (req,res){

})

app.listen(3000);