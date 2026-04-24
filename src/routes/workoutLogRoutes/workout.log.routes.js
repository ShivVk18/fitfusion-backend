import express from 'express' 
import { deleteWorkoutLogController, getWorkoutLogByIdController, getWorkoutLogsController, logWorkoutController } from '../../controllers/workout.log.controller.js'


const router = express.Router() 

router.post('/log-workout',logWorkoutController)
router.get('/get-logs',getWorkoutLogsController)
router.get('/get-logs/:logId',getWorkoutLogByIdController)
router.delete('/delete-log/:logId',deleteWorkoutLogController)

export default router 

