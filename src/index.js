import express from 'express'
import connectDB from './utils/dbConnect.js'

import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.middleware.js'
import cookieParser from 'cookie-parser'


const app = express() 

app.use(cors({
   origin:"*"
}))

app.use(express.json({limit:"10mb"}))
app.use(cookieParser())

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

import routes from './routes/index.js'


app.use("/api/v1",routes)

app.use(errorHandler)

export default app