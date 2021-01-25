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
// const authController = require("./controllers/authController.js");
const userRouter = require("./routes/userRoutes");
const mailRouter = require("./routes/mailRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//  Middlewares
// to set security headers
app.use(helmet());

// for cookies
app.use(cookieParser());

// to set no cache headers
app.use(nocache());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// logging requests using morgan
if (process.env.NODE_ENV === "development") {
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


app.use(
    cors({
        credentials: true,
        origin: `http://localhost:${process.env.PORT}`,
        preflightContinue: true,
    })
);


app.options("*", cors());

//  ROUTES
app.use("/", viewRouter);
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/mail/", mailRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;