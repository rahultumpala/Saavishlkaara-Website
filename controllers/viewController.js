const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getContactPage = catchAsync(async (req, res, next) => {
    res.status(200).render('contact');
})