import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs"
import generateToken from "../utils/createToken.js";

// User Creation
const createUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body
	console.log(username);
	
	if( !username || !email || !password ){
		throw new Error ("Please fill all the inputs")
	}
	
	const  userExists = await User.findOne({ email })
	if(userExists){
		throw new Error ("User Already Exists!")
	}

	const salt = await bcrypt.genSalt(5);
	const hashedPassword = await bcrypt.hash(password, salt)

	const newUser = new User({
		username, email, password:hashedPassword
	})

	try {
		await newUser.save()
		generateToken(res, newUser._id);
		res.status(201).json({_id : newUser._id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin})
	} catch (error) {
		res.status(400)
		throw new Error("Invalid user data")
	}
	
	res.status(200)
});

//  User Login
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body; // get username and password
	if (!email || !password) {
		res.status(400).json({ message: "No Email or Password was provided" })
	}

	const userExists = await User.findOne({ email }) // check for existing user
	if (userExists) {
		const isPasswordValid = await bcrypt.compare(password, userExists.password) // if user exists, compare password with hashed password
		if (isPasswordValid) {
			generateToken(res, userExists._id) // if password is valid, generate token
			res.status(200).json({ _id: userExists._id, username: userExists.username, email: userExists.email, isAdmin: userExists.isAdmin }) // send success response to the client. 
		} else {
			res.status(400).json({ message: "Fuck off" })
		}
	}
});

// User Logout
const logoutUser = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0)
	});

	res.status(200).json({ message: "Logged Out Successfully" })

});

// Password Reset
const resetPassword = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	const isEmailValid = await User.findOne({ email })

	const salt = await bcrypt.genSalt(5);
	const hashedPassword = await bcrypt.hash(password, salt)
	

	if (isEmailValid) {
		const updatedPassword = await User.findByIdAndUpdate(isEmailValid._id, { password: hashedPassword }, { new: true })
		console.log(updatedPassword)
		res.status(200).json({ message: updatedPassword })
	} else {
		res.status(400).json({ message: "Fuck Off Pussy" })
	}
	
});


export {createUser, loginUser, resetPassword, logoutUser};