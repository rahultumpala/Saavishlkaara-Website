const UserModel = require("../models/user-model")
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const BlacklistedTokens = require("../models/blacklisted-tokens");
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    currentToken = token;
    const cookieOptions = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 1000
        ),
        sameSite: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    res.locals.loggedInUser = user;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
exports.login = catchAsync(async (req, res, next) => {
    const { phoneNumber, password } = req.body;
    /// ------------------ we need to do it with either email/password or phoneNumber/password ---------
    // ------------ For now lets stick with phoneNumber/password ------------
    // 1) Check if email and password exist
    if (!phoneNumber || !password) {
        return next(
            new AppError("Please provide Mobile Number and Password!", 400)
        );
    }
    // 2) Check if user exists && password is correct
    const user = await UserModel.findOne({ phoneNumber: parseInt(phoneNumber, 10) }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect Mobile Number or Password", 401));
    }
    // For view Controller
    req.user = user;
    // this will change the header to [logout] from [login]
    res.locals.loggedInUser = user;
    //// --------------- not needed because the users wont be using the dashboard ---------------
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
    const { firstName, email, lastName, username, password, passwordConfirm, phoneNumber, collegeName, branchName, qualification, userDescription } = req.body;
    const newUser = await UserModel.create({
        firstName, email, lastName, username, password, passwordConfirm, phoneNumber, collegeName, branchName, qualification, userDescription
    });
    // console.log(newUser);
    if (newUser) {
        req.user = newUser;
        createSendToken(newUser, 200, res);
    } else {
        throw new AppError(400, "Request Failed")
    }
})

exports.logout = async (req, res) => {
    if (
        req.cookies ||
        (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer"))
    ) {
        let token;
        if (req.cookies) token = req.cookies.jwt;
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        )
            token = req.headers.authorization.split(" ")[1];
        else if (req.headers.cookie) {
            token = req.headers.cookie.split("=")[1]
        }
        const blacklisted = await BlacklistedTokens.create({
            token,
        });
    }
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: false,
    });
    res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.cookie) {
        token = req.headers.cookie.split("jwt=")[1];
    }
    if (!token) {
        return next(
            new AppError("You are not logged in! Please log in to get access.", 401)
        );
    }
    const blacklisted = await BlacklistedTokens.findOne({ token });
    if (blacklisted) {
        return next(
            new AppError("You are not logged in! Please log in to get access. Token No longer in use.", 401)
        );
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this token does no longer exist.",
                401
            )
        );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    req.requestTime = Date.now();
    next();
});

exports.addUserToRequest = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.cookie) {
        token = req.headers.cookie.split("jwt=")[1];
    }
    if (!token) {
        return next();
    } else {
        const blacklisted = await BlacklistedTokens.findOne({ token });
        if (blacklisted) {
            return next();
        } else {
            let decoded;
            try {
                decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            } catch (error) {
                if (error) return next();
            }
            const currentUser = await UserModel.findById(decoded.id);
            if (currentUser) {
                req.user = currentUser;
                req.requestTime = Date.now();
                return next();
            }
        }
    }
    return next();
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("You do not have permission to perform this action", 403)
            );
        }
        next();
    };
};


exports.verifyToken = catchAsync(async (req, res, next) => {
    try {
        let token = req.body.token;
        // 0) Check if the token is blacklisted
        const blacklisted = await BlacklistedTokens.findOne({
            token,
        });
        if (blacklisted) {
            return next(
                new AppError("You are not logged in! Please log in to get access.", 401)
            );
        }

        // 1) verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError("Details No Longer Valid", 404));
        }
    } catch (err) {
        return next(new AppError("User Not Logged in", 401));
    }
    res.status(200).json({
        status: "success",
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, req, res);
});
