import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const register = async (req,res)=>{
    try {
        const {name,email,password}= req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:'Please fill all fields'});
        }
        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({message:'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({name,email,password:hashedPassword});
        await user.save();
        res.status(201).json({message:'User registered successfully'});
    }
    catch (error) {
        console.error('Error in register controller:', error);
        res.status(500).json({message:'Server error'});
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:'Please fill all fields'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Invalid credentials'});
        }

    }
}