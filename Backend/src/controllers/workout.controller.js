import Workout from "../models/Workout.model.js";


export const createWorkout = async (req,res)=>{
    try{
        const {workoutName, exercises} = req.body;
        if(!workoutName || !exercises || exercises.length === 0){
            return res.status(400).json({message:'Please fill all fields and add at least one exercise'});
        }
        const workout = new Workout({
            user: req.user._id,
            workoutName,
            exercises,
        });
        await workout.save();
        res.status(201).json({message:'Workout created successfully', workout});


    }
    catch(error){
        console.error('Error in createWorkout controller:', error);
        res.status(500).json({message:'Server error'});
    }
}

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error("Error in getWorkouts controller:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getWorkoutLastSession = async (req, res) => {
  try {
    const { exerciseName } = req.params;

    const lastWorkout = await Workout.findOne({
      user: req.user._id,
      "exercises.exerciseName": exerciseName,
    }).sort({ createdAt: -1 });

    if (!lastWorkout) {
      return res.status(404).json({
        success: false,
        message: "No previous session found",
      });
    }

    const exercise = lastWorkout.exercises.find(
      (ex) => ex.exerciseName === exerciseName
    );

    res.status(200).json({
      success: true,
      exercise,
      workoutDate: lastWorkout.createdAt,
      workoutName: lastWorkout.workoutName,
    });
  } catch (error) {
    console.error(
      "Error in getWorkoutLastSession controller:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      });
    }

    res.status(200).json({
      success: true,
      workout,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};