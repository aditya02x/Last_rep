import User from '../models/user.model.js';

export const getProfile = async (req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        
        res.json(user);
    } catch (error) {    
            console.error(error);
        res.status(500).json({message:'Server error'});
    }
}