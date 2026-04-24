import dotenv from 'dotenv'
import http from 'http'
import connectDB from './utils/dbConnect.js'
import app from './index.js'
dotenv.config()

const server = http.createServer(app)

const PORT = process.env.PORT || 8000 

const startServer = async() => { 
    try {
        await connectDB() 

        console.log("Database Connected Successfully") 

        server.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Error starting server:", error)
    }
}

startServer()
const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down...`)

    server.close(() => {
        console.log("HTTP server closed")

        // 👉 if you have mongoose:
        // mongoose.connection.close(false, () => {
        //     console.log("MongoDB connection closed")
        //     process.exit(0)
        // })

        process.exit(0)
    })
}

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err)
    process.exit(1)
})

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err)
    process.exit(1)
})


// listen to signals
process.on("SIGINT", shutdown)   // Ctrl + C
process.on("SIGTERM", shutdown)  // system kill