if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require('express');
const app=express();
const path=require('path');
const ejs=require('ejs');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');
const cookieParser=require("cookie-parser");
const crypto = require('crypto');
const bcrypt = require('bcrypt');


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
const Review=require('./models/review.js');
const Appointment=require('./models/appointment.js');
const {isLoggedIn,saveRedirectUrl,checkUserInfo}=require('./middleware.js');

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

app.use(cookieParser())

app.use(session(sessionOption));
app.use(flash());

////-------------------------------------------for passport means login 
app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy(User.authenticate()));
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

app.get('/doctor/login',(req,res)=>{
    res.render('frontSite/doctorLogin.ejs');
})

app.post('/doctor/login',async (req,res)=>{

    try {
        let doctor=await Register.find({username:req.body.username});

        const password = req.body.password;

        const storedHash = doctor[0].password; 

        bcrypt.compare(password, storedHash, function(err, result) {
            if (err) {
                res.redirect("/doctor/login");
            } else {
                if (result) {
                    res.redirect(`/medifind/${doctor[0]._id}`);
                } else {
                    res.redirect("/doctor/login");
                }
            }
        });
    }catch(e){
        res.redirect('/doctor/login');
    }

})


    app.post('/login', saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login', failureFlash:true}), async (req,res)=>{
        let redirectUrl=res.locals.redirectUrl || '/home';
        res.redirect(redirectUrl);
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
            username:req.body.username,
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

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        newDoc.password = hash;

        let newDoctor=await newDoc.save();

        res.redirect('/home');
})

app.post('/newUser',async (req,res,next)=>{
    try {
        const newUser=new User({
            username:req.body.username,
            name:req.body.name,
            contactNumber:req.body.contactNumber,
            email:req.body.email,
            gender:req.body.gender,
            mobile:req.body.mobileNumber,
            dob:req.body.dob,
        });
    
        let newU=await User.register(newUser,req.body.password);
        req.login(newU,(err)=>{
            if(err){
                next(err)
            }
            res.redirect('/home');
        });
    }catch(e){
        console.log(e);
        res.redirect('/register');
    }

})

//-----------------------------------------------------------

app.get('/doctor/:id', isLoggedIn, async (req,res)=>{
    let review=await Review.find({doctor:req.params.id}).populate({
        path: 'reviewRating.user',
        model: 'User'
    });

    let appointments=await Appointment.find({doctor:req.params.id}).populate({
        path:'appointmentDetail.user',
        model:'User'
    });

    let doctor=await Register.find({_id:req.params.id});
    if(doctor.length!=0){
        const todayDate = new Date().toISOString().split('T')[0]; 
        res.render('frontSite/doctorInfo.ejs',{doctor:doctor[0],review:review[0],appointment:appointments[0], todayDate});
    }
    else {
        res.redirect("/home");
    }

})

app.get('/doctor-listing', isLoggedIn,  async (req,res)=>{
    let title=req.query.department;
    // let data=await Register.find({specialisation:title});
    let data=await Register.find({
        $or: [
                {specialisation:title} ,
                {department:title}
        ]
    });
    res.render('frontSite/doctor-listing.ejs',{title,data});
})

//--------------------------------------------------------------

app.post('/review/:id',async (req,res)=>{
    let newReview=await Review.findOne({doctor: req.params.id});

    let date=new Date();
    date.toLocaleDateString('en-IN',  { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        timeZone: 'Asia/Kolkata'
    });

    if(!newReview){
         newReview=new Review({doctor: req.params.id,reviewRating:[]});
    }
    newReview.reviewRating.push({review:req.body.review, rating:req.body.rating , user:req.user.id, date:date});
    await newReview.save();
    res.redirect(`/doctor/${req.params.id}`);
})

//-----------------------------------------------------------

app.get('/appointment/:id', isLoggedIn, async (req,res)=>{
    let doctor=await Register.find({_id:req.params.id});
    if(!doctor){
       res.redirect('/home');
    }else {
        res.render("frontSite/appointment.ejs",{doctor});
    }
})

app.post('/appointment/:id', async (req,res)=>{

    let appointments=await Appointment.find({
        doctor:req.params.id,
        'appointmentDetail.date':req.body.date,
        'appointmentDetail.user':req.user.id
    });
    if(appointments.length>0){
        return res.redirect(`/doctor/${req.params.id}`);
    }

    const todayDate = new Date().toISOString().split('T')[0];
    let appointment=await Appointment.find({
        doctor: req.params.id,
        'appointmentDetail.time': req.body.time,
        'appointmentDetail.date': todayDate,
    });
    if(appointment.length>6){
        return res.redirect(`/doctor/${req.params.id}`);
    }

    let newAppoint=await Appointment.findOne({doctor:req.params.id});

    if(!newAppoint){
        newAppoint=new Appointment({doctor:req.params.id, appointmentDetail:[]});
    }
    newAppoint.appointmentDetail.push({date:req.body.date, time:req.body.time, disease:req.body.disease, user:req.user.id});
    await newAppoint.save();
    
    let doctor=await Register.find({_id:req.params.id});
 
    let n=newAppoint.appointmentDetail.length;

    res.render('frontSite/appointmentShow.ejs',{doctor,newAppoint:newAppoint.appointmentDetail[n-1]});
})

//-----------------------------------------------------------

app.get('/medifind/:id',async (req,res)=>{
    // console.log(req.params.id);
    let appointments=await Appointment.findOne({doctor:req.params.id}).populate({
        path:'appointmentDetail.user',
        model:'User'
    }).populate('doctor');
    // console.log(appointments.appointmentDetail);
    res.render('appointmentControl.ejs',{appointments});
})

app.get('/deleteAppointment/:userId/:appointId',async (req,res)=>{
    let appointment=await Appointment.updateOne(
        {_id:req.params.appointId,'appointmentDetail.user':req.params.userId,},
        {$set:{'appointmentDetail.$[elem].checked':'yes',}},
        { arrayFilters: [{ 'elem.user': req.params.userId }] }
    );
    let appointments=await Appointment.find({_id:req.params.appointId});
    // console.log(appointments);
    res.redirect(`/medifind/${appointments[0].doctor}`);
})

//-----------------------------------------------------------


app.all('*',(req,res)=>{
    res.redirect('/home');
})

app.use((err,req,res,next)=>{   
    let {status=404,message="Page not found"}=err;
    // res.status(status).send(message);
    res.status(status).send(err);
})