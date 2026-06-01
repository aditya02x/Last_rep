import mongoose from 'mongoose';

const weightSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight:{
        type:Number,
        required:true,
        min:1
    },
    date:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

export default mongoose.model('Weight',weightSchema);