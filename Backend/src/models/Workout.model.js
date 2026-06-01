import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    excerciseName: {
        type:String,
        required:true
    },
    sets:{
        type:Number,
        required:true,
    },
    reps:{
        type:Number,
        required:true,
    },
    weight:{
        type:Number,
        required:true,
    },
},{
    timestamps:true
} );

export default mongoose.model('workout',workoutSchema);