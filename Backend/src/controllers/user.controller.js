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

export const updateProfile = async (req,res)=>{
    try{
        const {age ,gender, height, currentWeight, goalWeight, goal, activityLevel} = req.body;
        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({message:'User not found'});

        }
        user.age = age ?? user.age;
        user.gender = gender ?? user.gender;
        user.height = height ?? user.height;
        user.currentWeight = currentWeight ?? user.currentWeight;
        user.goalWeight = goalWeight ?? user.goalWeight;
        user.goal = goal ?? user.goal;
        user.activityLevel = activityLevel ?? user.activityLevel;

        user.isOnboarded = true;

        await user.save();
        const updatedUser = await User.findById(req.user._id).select('-password');
         res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
}