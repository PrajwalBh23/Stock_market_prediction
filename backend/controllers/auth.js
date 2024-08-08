import User from '../model/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Check if all required fields are provided
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.phone) {
            return res.status(422).json({ error: "Please fill in all the fields properly" });
        }

        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            password: hash,
        });

        // Save the user and generate a token
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);

        res.status(200).json({ message: "User has been created", token });
    } catch (error) {
        next(error);
    }
}



export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in the data' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log("user not");
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        console.log("user is getting ");
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        // Send the token in the response
        res.cookie("JwtToken", token, {
            expires: new Date(Date.now() + 259200000)
        });

        return res.status(200).json({ message: "User Sign in Successfully", token });

    } catch (error) {
        next(error);
    }
};



export const isLogin = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (user) {
            console.log("getto user");
            return res.status(200).json({
                success: true,
            })
        } else {
            console.log("not getto user");
            return res.status(200).json({
                success: true,
            })
        }

    } catch (err) {
        console.log("all error");
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            console.log("success is half");
            return res.status(401).json({
                success: false,
                message: "Missing Token"
            })
        }

        jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
            if (err) {
                console.log("token is maa is aakq");
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            console.log("success is full");
            req.user = await User.findById(user.id)
            const gello = await User.findById(user.id);
            next()
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

