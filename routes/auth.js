const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    // Validate the data
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if user is already in the DB
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedpassword
    });
    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    }catch (err){
        res.status(400).send(err);
    }
});

// Login

router.post('/login', async (req,res) => {
    // Validate the data
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Check if the email exist
    const user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('Email or password is wrong');
    // Password is correct
    const validPass = await bcrypt.compare(req.body.pass, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token)

    res.send('login')
});

module.exports = router;