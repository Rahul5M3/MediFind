if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require('express');
const app=express();
const path=require('path');
const ejs=require('ejs');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');

const { v4: uuidv4 } = require('uuid');


const session=require('express-session');
const flash=require('connect-flash');
const passport=require("passport");
const LocalStrategy=require('passport-local');
const methodOverride=require('method-override');
const multer=require('multer');

const upload = multer({ dest: './public/images/' })

const Register=require('./models/register.js');
const User=require('./models/user.js');

app.set('view engine','ejs');
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,'/public')));
app.set('views',path.join(__dirname,'/views'));


app.listen(8080,()=>{
    console.log("server connected");
})

main()
.then(()=>{
    console.log('database connected');
})
.catch(()=>{
    console.log("error occured , database not connected");
})

async function main(){
    mongoose.connect(process.env.DBURL);
}

const sessionOption={
    // store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    }
}

app.use(session(sessionOption));
app.use(flash());

////-------------------------------------------for passport means login 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())


//----------------------------------------------------------

app.get('/',(req,res)=>{
    res.redirect('/home');
})

app.get('/home',async (req,res)=>{
    let data= await Register.find({});
    res.render('frontSite/home.ejs',{data});
})

app.get('/register',(req,res)=>{
    res.render("frontSite/register.ejs");
})

app.get('/login',(req,res)=>{
    res.render('frontSite/login.ejs');
})

app.post("/login",async (req,res)=>{
    let user= await User({username:req.body.name,password:req.body.password,email:req.body.email});
    if(user!=null){
        res.redirect("/home");
    }
    else {
        res.redirect('/login');
    }
})

//-----------------------------------------------------------

app.post('/newDoctor',upload.single('docImage'),async (req,res)=>{
        const newDoc=new Register({
            name:req.body.name,
            contactNumber:req.body.contactNumber,
            active:req.body.option,
            registerNumber:req.body.registerNumber,
            registerDate:req.body.registerDate,
            activeFrom:req.body.activeFrom,
            activeTo:req.body.activeTo,
            email:req.body.email,
            username:uuidv4(),
            specialisation:req.body.Specialisation,
            department:req.body.Department,
            location:req.body.location,
            price:req.body.price,
            startTime:req.body.startTime,
            endTime:req.body.endTime,
        });

        if(req.file!=='undefined' && req.file!==undefined){
            newDoc.photo= {
                url:req.file.path,
                filename:req.file.filename,
            }
        }

        let newDoctor=await Register.register(newDoc,req.body.password);

        res.redirect('/home');
})

app.post('/newUser',async (req,res)=>{
    const newUser=new User({
        name:req.body.name,
        contactNumber:req.body.contactNumber,
        email:req.body.email,
        username:uuidv4(),
        gender:req.body.gender,
        mobile:req.body.mobileNumber,
        dob:req.body.dob,
    });

    let newU=await newUser.save();
    res.redirect('/home');
})

//-----------------------------------------------------------

app.get('/doctor/:id', async (req,res)=>{
    let doctor=await Register.find({_id:req.params.id});
    if(doctor.length!=0){
        res.render('frontSite/doctorInfo.ejs',{doctor:doctor[0]});
    }
    else {
        res.redirect("/home");
    }
})

app.get('/doctor-listing/', async (req,res)=>{
    let title=req.query.department;
    let data=await Register.find({specialisation:title});
    res.render('frontSite/doctor-listing.ejs',{title,data});
})

//-----------------------------------------------------------