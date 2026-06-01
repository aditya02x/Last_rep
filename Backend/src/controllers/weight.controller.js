import mongoose from 'mongoose';
import  Weight from '../models/weight.model.js';
export const addWeight = async (req,res)=>{
    try{
        const {weight} = req.body;

        if(!weight){
            return res.status(400).json({
                message:'Weight is required'
            });
        }

        const weightEntry = new Weight({
            user:req.user._id,
            weight,
        });

        await weightEntry.save();

        res.status(201).json({
            success:true,
            message:'Weight logged successfully',
            weightEntry
        });

    } catch(error){
        console.error('Error in addWeight controller:', error);

        res.status(500).json({
            success:false,
            message:'Server error'
        });
    }
}