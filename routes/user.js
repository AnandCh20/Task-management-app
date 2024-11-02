const express = require('express');
const router = express.Router(); //Bunch of routes or set of routes  with diffrent prefix
const User = require('../schema/user.schema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.get('/', (req, res)=>{
    res.send("Login Page....")
});

router.post('/register', async (req, res, next)=>{
    const saltRounds = 10;
    try{
        const { name, email, password } = req.body;
        console.log("register: ",req.body);
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send('User already exists');
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({
            name,
            email,
            password: hash
        });
        await user.save();
        const token = jwt.sign({_id:user._id}, process.env.JWT_PRIVATE_KEY);
        console.log(token)
        res.json({
            email: user.email,
            token
        })
        
    } catch (e) {
        next(e);
    }
})

// //get all users
// router.get(("/"), async (req, res) => {
//     const users = await User.find().select("-password -_id");
//     res.status(200).json(users);
// });

// //get user by email
// router.get("/:email", async (req, res) => {
//     const { email } = req.params;
//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
// });

//login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).send('email or password is wrong');
        }
        const validPass = bcrypt.compareSync(password, userExists.password);
        if (!validPass) {
            return res.status(400).send('email or password is wrong');
        }
        const token = jwt.sign({ _id: userExists._id }, process.env.JWT_PRIVATE_KEY);
        // After successful registration or login

        res.json({
            email: userExists.email,
            token
        })
    }
    catch (e) {
        return new Error(e.message);
    }
});

router.post("/verify", async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const verifiedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const userId = verifiedToken._id;
        const user = await User.findById(userId);
        res.json({
            email: user.email,
            name: user.name
        })
    }
    catch (e) {
        next(e);
    }
})


router.post('/updatepassword', async (req, res)=>{
    try{
        // We took the password and newPassword from the body
        const { email, password, newPassword} = req.body;
        const token = req.headers['authorization'];
        console.log("token",token)
        const userExists = await User.findOne({ email });
        console.log(userExists)
        if(!userExists){
            res.status(400).send({message: 'User doesnt exists'})
        }
        const valPassword = bcrypt.compareSync(password, userExists.password);
        if(!valPassword){
            res.status(400).send({message: 'Invalid Password'})
        }
        const verifiedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const userExistsToken = userExists._id.toString();
        console.log(verifiedToken)
        console.log(verifiedToken._id)
        console.log(userExistsToken)
        if(verifiedToken._id !== userExistsToken){
            res.status(400).send({message: 'Invalid Token'})
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newPassword, salt);
        await User.findOneAndUpdate(
            {email: userExists.email},
            {password: hash}
        )       
        res.json({message: 'Password Updated Successfully'})
    }catch(err){
        return new Error(err.message)
    }
})


module.exports = router;





// router.post('/login', async (req, res)=>{
//     try{
//         const { email, password} = req.body;
//         const userExists = await User.findOne({ email })
//         // console.log(userExists)
//         if(!userExists){
//             res.status(400).send({message: 'User doesnt exists'})
//         }
//         const valPassword = bcrypt.compareSync(password, userExists.password);
//         if(!valPassword){
//             res.status(400).send({message: 'Invalid Password'})
//         }
//         const token = jwt.sign({_id:userExists._id}, process.env.JWT_PRIVATE_KEY);
//         res.json({
//             email: userExists.email,
//             token
//         })
        
//     }catch(err){
//         return new Error(err.message)
//     }
// })


// module.exports = router;