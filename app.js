const express=require('express');
const app=express();
const port=8080;
const path = require("path");
app.set("view engine","ejs");
app.set("view cache", false);
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
const User = require("./models/user");
app.use(express.urlencoded({extended:true}));
const bcrypt = require("bcrypt");


const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/users";

main().then( () =>{
    console.log("connected to db");
}).catch( err =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/signup',(req,res)=>{
  res.render('signup');
});

app.post("/signup", async(req,res)=>{
    try{

      const hashedPassword =
            await bcrypt.hash(req.body.password,10);

            const user = new User({
                fullname:req.body.fullname,
                email:req.body.email,
                phone:req.body.phone,
                age:req.body.age,
                bloodGroup:req.body.bloodGroup,
                city:req.body.city,
                password:hashedPassword
            });

            await user.save();

        res.redirect("/dashboard");

    }
    catch(err){

        console.log(err);

        res.send("Error Occurred");

    }

});

app.get("/dashboard",async(req,res)=>{
  res.render('dashboard');
});

app.get("/receiver", (req, res) => {
    res.render("receiver");
});


app.post("/login", async (req, res) => {

    const { identity, password, role } = req.body;

    const user = await User.findOne({
        $or: [
            { email: identity },
            { phone: identity }
        ],
        role: role
    });

    if (!user) {
        return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        return res.send("Wrong password");
    }
    if(isMatch){
        if(role=="admin"){
            return res.render('admindashboard');
        }
        else return res.redirect("/dashboard");
    }

    
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

