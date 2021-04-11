const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require('cookie-parser');
const nocache = require('nocache')
const authController = require("./controllers/authController.js");
const userRouter = require("./routes/userRoutes");
const mailRouter = require("./routes/mailRoutes");
const viewRouter = require("./routes/viewRoutes");
const blogRouter = require("./routes/blogRoutes");
const coursesRouter = require("./routes/courseRoutes");

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//  Middlewares

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//  });
// to set security headers
app.use(helmet());

// for cookies
app.use(cookieParser());

// to set no cache headers
app.use(nocache());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// logging requests using morgan
if (process.env.NODE_ENV === "development"
    // || process.env.NODE_ENV === "production"
) {
    app.use(morgan("dev"));
}

// limiting the [req.body] size to 10kb
app.use(express.json({ limit: "10kb" }));

// preventing NoSQL injection using [express-mongo-sanitize]
app.use(mongoSanitize());

// cleaning html/js code using [xss-clean]
app.use(xss());

// prevent HTTP Parameter Pollution using [hpp]
// add parameter names to whitelist so as to accept duplicates in the query string
app.use(hpp({ whitelist: [] }));

const tryingOut = process.env.tryingOut;
var origin;
if (process.env.NODE_ENV === "development" && tryingOut === "true") origin = `https://www.saavishkaara.com`;
else if (process.env.NODE_ENV === "development") origin = `localhost:${process.env.PORT}`;
else origin = `https://www.saavishkaara.com`;

app.options(cors());
app.use(
    cors({
        credentials: true,
        origin,
        preflightContinue: false,
    })
);



//  ROUTES
app.all("*", authController.addUserToRequest)
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/mail", mailRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/courses", coursesRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;