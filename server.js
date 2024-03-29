const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
const app = require("./app")

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION !! SHUTTING DOWN");
    console.log(err.name, err.message)
    console.log(err)
    process.exit(1)
})



const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    // mongoose.connect(process.env.DATABASE_LOCAL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }).then((con) => {
        console.log(" DB Connection Successful")
        console.log(" Waiting for Requests......")
    })
    
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION !! SHUTTING DOWN");
    console.log(err.name, err.message)
    console.log(err)
    process.exit(1)
})


