var express = require('express');
var app = express();
var nodemailer = require('nodemailer')
var path = require('path');
var crypto = require('crypto'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  gridfsstorage = require('multer-gridfs-storage'),
  grid = require('gridfs-stream'),
  methodoverride = require('method-override');
var passport = require('passport');
var localstrategy = require('passport-local');
var passportlocalmongoose = require('passport-local-mongoose');
var session = require("express-session")
var postdetails = require("./models/one");
var methodoverride = require('method-override');
var bodyparser = require('body-parser');
var one = require('./routes/one');
var mw = require('./middleware/middle');
var userroutes= require('./routes/one')
app.set("view engine", "ejs");
app.use(methodoverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/semantic'));
// app.use(express.static(__dirname + '/views'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
// app.use('/api/one',one);
app.use('/api/users',userroutes);
var User = require('./models/user');
// const mongoURI = 'mongodb://localhost/upload';
const mongoURI = 'mongodb+srv://narendraiiitl:narendraiiitl@upload-y1od8.mongodb.net/test?retryWrites=true&w=majority';
// mongodb+srv://narendraiiitl:<password>@upload-y1od8.mongodb.net/test?retryWrites=true&w=majority
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });




/////////////////////node mailer//////////////////

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lcs2019015@iiitl.ac.in',
    pass: 'Narendra@03'
  }
});

function sendmail(mail, password) {

  const mailOptions = {
    from: 'lcs2019015@iiitl.ac.in',
    to: mail,
    subject: 'test msg',
    html: password
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });
}

/////////////////////node mailer//////////////////


////////passpport js////////////////////

app.use(session({
  secret: "this will be used for decoding the password",
  resave: false,
  saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({ extended: true }));
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

///////////// passport js////////////////////////


/////////////storage engine/////////////////////

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

/////////////storage engine/////////////////////

///////////////get request////////////////////
app.get("/otp", function (req, res) {
  res.render("otp");
});
 
app.get("/covid",function(req,res){
  res.render("covid")
});

app.get("/login", function (req, res) {
  res.render("upandin");
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/")
});

app.get("/upload",isLoggedIn,function(req,res){
  res.render('index');
});

app.get("/images/",(req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist'
      });
    }
    else {
      files.map(file => {

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          file.isImage = true;
        }
        else {
          file.isImage = false;
        }
      });
      res.render('landing')
    }
  });
});

app.get("/images/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    
    if (!file || file.length === 0) {
      res.send("no files to show");
    }
   else if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
    else {
      res.status(404).json({
        err: 'not an image'
      });
    }
  });
});

app.get("/", function (req, res) {
  res.render('landing');
});

app.get("/empty", isLoggedIn, function (req, res) {
  res.render('index', { files: false });
});

// app.get("/files", isLoggedIn, (req, res) => {
//   gfs.files.find().toArray((err, file) => {
//     if (!file || file.length === 0) {
//       res.render('index', { files: false })

//     }
//     else {
//       file.map(file => {
//         if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//           file.isImage = true;
//         }
//         else {
//           file.isImage = false;
//         }
//       });
//       res.render('landin', { files: file })
//     }

//   });
// });

app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'no file exist'
      });
    }
    return res.json(file);
  });
});

app.get("/api/:user",function(req,res){
  res.json(req.user);
})

///////////////get request////////////////////


///////////////Post request////////////////////

app.post("/register", function (req, res) {
  var val = Math.floor((Math.random() * 1000000));
  const otp = 'your otp is ' + val;
  var data = { username: req.body.username, email: req.body.email, password: req.body.password, otp: val }
  sendmail(req.body.email, otp);
  var files = { data : data , isImage: null }
  res.render("otp", { files: files });
});

app.post("/otp", function (req, res) {
  if (req.body.otp === req.body.yourotp) {
    req.body.username = req.body.username.trim();
    User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        return res.render('upandin');
      }
      passport.authenticate("local")(req, res, function () {
        var data = { user: req.user.username };
        var files= [{ data :data}];
        res.render('landing');
      })
    });
  }
  else {
    console.log("authentication failed");
    res.redirect('/login');
  }
})

app.post("/login", passport.authenticate("local"), function (req, res) {
  var data = { user: req.user.username };
  var files = [{data:data}];
  res.render("landing", { files: files });
});

app.post("/upload", uplaod.single('file'), isLoggedIn, function (req, res) {
  var content = req.body.name;
  var tag = req.body.tag;
  var img = req.file.filename;
  var user = req.user.username;
  var newpost = {
    image: img,
    content: content,
    tag: tag,
    user:user
  };
  postdetails.data.create(newpost, function (err, images) {
    if (err) {
      console.log(err);
    }
    else {
      User.findOneAndUpdate(
        { username: req.user.username }, 
        { $push: { posts: images } },
        {new:true},
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 console.log(success);
             }
         });
    }
  });
  res.redirect("/images");
});

app.delete('/files/:id', isLoggedIn, (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'upload' }, (err, gridstore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.redirect('/images');
  });
});

///////////////Post request////////////////////

app.listen(4000, function () {
  console.log("ready port 4000")
});
