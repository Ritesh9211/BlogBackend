const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const nodemailer = require("nodemailer");

const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors")
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//   app.use((req,res,next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next()
// })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/send", async(req,res)=>{
  let{name,email,phone,message} = req.body;

  try{

        
    const transporter = nodemailer.createTransport({
      host:  process.env.MAIL_HOST, //replace with your email provider
      port:  process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });
    
    await transporter.sendMail({
      from: `${email}`,
      to:"riteshsaj8958@gmail.com",
      subject:"Blog Contact Form Enquiry",
      html:`<div>
      
      <h1>Name-${name}<h1/>
      <h1>Email- ${email}<h1/>
      <h1>Phone- ${phone}<h1/>
      <h1>Message- ${message}<h1/>
      
      <div/>
      `,
      
    })
      res.status(201).json({message : "Mail sent sucessfuly"});
     
  }catch(err){
    console.log(req.body)
    res.status(500).json(err);
  }
  
  
})

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});




app.use("/api/auth",cors(),authRoute);  //api overwrite

app.use("/api/users",cors(),userRoute);  //to use particular api
app.use("/api/posts",cors(),postRoute);
app.use("/api/categories",cors(),categoryRoute);


app.listen("5000", () => {
  console.log("Backend is running.");
});
