const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  const {username,email,password,cpassword}= req.body;
  if(password!== cpassword){
    return res.status(422).json({error:"Password Does not match"})
  }
  const emailExist = await User.findOne({email:email});
    const userExist = await User.findOne({username:username});
    console.log("emailExist",emailExist)
    if(emailExist){
      return res.status(422).json({error:"Email Already Exists"});
    }
    else if(userExist){
      return res.status(422).json({error:"User Already Exists"});
    }
    console.log("userExist",userExist)
  try {
   

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    const user = await newUser.save();
    return res.status(201).json({message: "User registered Successfully"});
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});






//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json({error:"Invalid credentials!"});

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json({error:"Invalid credentials!"});

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
