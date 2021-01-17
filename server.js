const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = require("./app")

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION !! SHUTTING DOWN");
    console.log(err.name, err.message)
    console.log(err)
    process.exit(1)
})

dotenv.config({ path: "./config.env" })


const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    // mongoose.connect(DATABASE_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
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


