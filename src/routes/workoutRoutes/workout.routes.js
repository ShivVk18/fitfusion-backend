import express from 'express' 
import { deleteWorkoutPlan, generateWorkoutPlanController, getWorkoutPlanById, getWorkoutPlans } from '../../controllers/workout.controller.js'

const router = express.Router() 

router.post('/generate-workout',generateWorkoutPlanController)
router.get('/get-workout',getWorkoutPlans) 
router.get('/get-workout/:planId',getWorkoutPlanById)
router.delete('/delete-workout/:planId',deleteWorkoutPlan)


export default router