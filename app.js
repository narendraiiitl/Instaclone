var express = require('express');
var app= express();
var nodemailer= require('nodemailer') 
var path = require('path');
var crypto = require('crypto'),
mongoose = require('mongoose'),
multer = require('multer'),
gridfsstorage = require('multer-gridfs-storage'),
grid = require('gridfs-stream'),
methodoverride = require('method-override');
var passport=require('passport');
var localstrategy=require('passport-local');
var passportlocalmongoose=require('passport-local-mongoose');
var session = require("express-session")
var str = require("./models/one");
var methodoverride = require('method-override');
var bodyparser = require('body-parser');
var one = require('./routes/one');
var mw = require('./middleware/middle');
app.set("view engine","ejs");
app.use(methodoverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/semantic'));
// app.use(express.static(__dirname + '/views'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
// app.use('/api/one',one);
var User=require('./models/user');  
const mongoURI = 'mongodb://localhost/upload';
const conn = mongoose.createConnection(mongoURI,{ useNewUrlParser: true,useUnifiedTopology: true });

// using less




var lessMiddleware = require('less-middleware');

// app.configure(function(){
//   //other configuration here...  
  // app.use(lessMiddleware({
  //   src      : `${__dirname}/public`,
  //   compress : true
  // }));












//using less
































///node mailer

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'lcs2019015@iiitl.ac.in',
         pass: 'test1234'
     }
 });

function sendmail(mail,password){
 
  const mailOptions = {
   from: 'lcs2019015@iiitl.ac.in', 
   to: mail,
   subject: 'test msg', 
   html: password
 };
transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)
  else
    console.log(info);
});
}






//node mailer


app.use(session({
  secret:"this will be used for decoding the password",
  resave:false,
  saveUninitialized:false

}));




app.use(passport.initialize());
app.use(passport.session());

app.use(bodyparser.urlencoded({extended:true}));

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




function isLoggedIn( req, res, next){
  if(req.isAuthenticated()){
      return next();  
  }
  res.redirect("/login");
} 


// app.get("/fac",function(req,res){
//   res.render("login")
// })
// app.get("/fac2",function(req,res){
//   res.render("signup")
// })



app.get("/otp",function(req,res){
  res.render("otp");
});

app.post("/register",function(req,res){
  var val= Math.floor((Math.random()*1000000));
  const otp= 'your otp is ' + val;
  var data = { username:req.body.username , email: req.body.email ,password: req.body.password, otp:val}
   sendmail(req.body.email,otp);
   res.render("otp",{data:data});
})


app.get("/login",function(req,res){
  res.render("upandin");
});
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/")
});


app.post("/otp",function(req,res){
  if(req.body.otp===req.body.yourotp)
  {
    req.body.username = req.body.username.trim();
    console.log(req.body.username);
    User.register(new User({username:req.body.username , email:req.body.email}),req.body.password ,function(err,user){
      if(err)
      { 
          console.log(err);
          return res.render('upandin');
      }
      passport.authenticate("local")(req,res, function(){
        var data = {user: req.user.username};
          res.render('landing',{data:data});
      })
  });
  }
  else{
    console.log("authentication failed");
    res.redirect('/login');
  }
})

app.post("/login",passport.authenticate("local"),function(req,res){
  var data= {user:req.user.username};
  console.log(data);
res.render("landing",{data: data});

});





const storage = new gridfsstorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'upload'
        };
        resolve(fileInfo);
      });
    });
  }
});
const uplaod = multer({ storage });



let gfs;
conn.once('open', () => {
     gfs = grid(conn.db, mongoose.mongo);
     gfs.collection('upload');
  });




  app.get("/images/",isLoggedIn,(req,res)=>{
    console.log(req.session);
    gfs.files.find().toArray((err,files)=>{
      if(!files||files.length === 0)
      {
       
        return res.status(404).json({
          err: 'no files exist'
        });
        
      }
      else{
        files.map(file =>{
           
          if(file.contentType === 'image/jpeg' || file.contentType === 'image/png')
          {
            file.isImage = true; 
          }
          else{
            file.isImage = false; 
          }
        });
        
      
        res.render('index',{files:files})
      }
  
    });
    
  });
  
     
  
  app.get("/images/:filename",isLoggedIn,(req,res)=>{
    gfs.files.findOne({filename:req.params.filename},(err,file) => {
      if(!file||file.length === 0)
      {
        res.render('index',{files: false});
      }
      
      if(file.contentType === 'image/jpeg' || file.contentType === 'image/png')
      {
         const readstream = gfs.createReadStream(file.filename);
         readstream.pipe(res);  
      }
      else{
        res.status(404).json({
         err: 'not an image'
        });
      }
     });
   });
  


app.get("/",function(req,res){
  var data = null;
  res.render('landing',{data : data});
})
app.get("/empty",isLoggedIn,function(req,res){
  res.render('index',{files: false});
})

app.delete('/files/:id',isLoggedIn,(req,res) => {
    
  gfs.remove({_id: req.params.id, root:'upload'},(err,gridstore)=>{
    if(err) {
      return res.status(404).json({err: err});
    }
    res.redirect('/images');
  });
});





app.get("/files",isLoggedIn,(req,res)=>{
  gfs.files.find().toArray((err,file)=>{
    if(!file||file.length === 0)
    {
      res.render('index',{files:false})
      
    }
    else{ 
      file.map(file =>{
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png')
        {
          file.isImage = true; 
        }
        else{
          file.isImage = false; 
        }
      });
      res.render('index',{files:file})
    }

  });
});


app.get("/files/:filename",isLoggedIn,(req,res)=>{
  gfs.files.findOne({filename:req.params.filename},(err,file) => {
    if(!file||file.length === 0)
    {
      return res.status(404).json({
        err: 'no file exist'
      });
    }
    return res.json(file);
  });
});




app.post("/upload",uplaod.single('file'),isLoggedIn,function(req,res){
      var name = req.body.name;
      var img= req.file.filename;
       var newpost = {
          name: name ,
          image:img
      };
  
       str.data.create(newpost,function(err,images){
           if(err)
           {
               console.log(err);
           }
           else{
            res.redirect("/images");
           }
       });
    });
    



app.listen(4000,function(){
        console.log("ready port 4000")
});
