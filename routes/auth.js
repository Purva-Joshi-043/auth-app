const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //Let's validate the data before we make a user
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user is already in db
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Register a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  //Let's validate the data before we login the user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");
  //password is correct
  const validPass = await bcrypt.compare(req.body.password,user.password);
  if(!validPass) return res.status(400).send('Invalid password')
  //Create and assign a token
  const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token)

});

module.exports = router;
