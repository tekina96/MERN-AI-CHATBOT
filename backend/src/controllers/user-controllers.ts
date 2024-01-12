import { NextFunction, Request, Response } from "express";
import user from "../models/user.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    // get all users from DataBase
    try {
        const users = await user.find();
        return res.status(200).json({message: "OK", users});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "ERROR", cause: error.message});
    }
}

export const userSignup = async (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    // user signup
    try {
        const {name, email, password} = req.body;
        const existingUser = await user.findOne({email});
        if(existingUser) {
            return res.status(401).send("User already registered");
        }
        const hashedPassword = await hash(password, 10);
        const User = new user({name, email, password: hashedPassword});
        await User.save();

        // Create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(User._id.toString(), User.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/", 
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(201).json({message: "OK", name: User.name, email: User.email});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "ERROR", cause: error.message});
    }
}
export const userLogin = async (

    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    // user Login
    try {
        const {email, password} = req.body;
        const User = await user.findOne({email})
        if(!User) {
            return res.status(401).send("User not registered");
        }
        const ispasswordcorrect = await compare(password, User.password);
        if(!ispasswordcorrect) {
            return res.status(403).send("password is incorrect.");
        }

        // change cookie
        res.clearCookie(COOKIE_NAME, {
            path: "/", 
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        const token = createToken(User._id.toString(), User.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/", 
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(200).json({message: "OK", name: User.name, email: User.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "ERROR", cause: error.message});
    }
};

export const verifyUser = async (

    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    
    try {
        // User token check
        const User = await user.findById(res.locals.jwtData.id);
        if(!User) {
            return res.status(401).send("User not registered OR Token Malfunctioned");
        }
        console.log(User._id.toString(), res.locals.jwtData.id);
        if(User._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        return res.status(200).json({message: "OK", name: User.name, email: User.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "ERROR", cause: error.message});
    }
};
export const userLogout = async (

    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    
    try {
        // User token check
        const User = await user.findById(res.locals.jwtData.id);
        if(!User) {
            return res.status(401).send("User not registered OR Token Malfunctioned");
        }
        console.log(User._id.toString(), res.locals.jwtData.id);
        if(User._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        res.clearCookie(COOKIE_NAME, {
            path: "/", 
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        return res.status(200).json({message: "OK", name: User.name, email: User.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "ERROR", cause: error.message});
    }
};