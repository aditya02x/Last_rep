import User from '../models/user.model.js';

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

        const user = new User({name,email,password});
        await user.save();
        res.status(201).json({message:'User registered successfully'});
    }
    catch (error) {
        console.error('Error in register controller:', error);
        res.status(500).json({message:'Server error'});
    }
}