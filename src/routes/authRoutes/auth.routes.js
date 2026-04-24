import express from 'express' 
import { userSignUp,userSignIn,userSignOut } from '../../controllers/auth.controller.js'


const router = express.Router() 

router.post('/register',userSignUp)
router.post('/login',userSignIn)
router.post('/logout',userSignOut)

export default router