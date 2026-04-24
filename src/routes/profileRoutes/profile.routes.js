import express from 'express'
import { createProfile, getProfile, updateProfile } from '../../controllers/profile.controller.js'


const router = express.Router()

router.post('/create-profile',createProfile)
router.get('/get-profile',getProfile)
router.put('/update-profile',updateProfile)

export default router