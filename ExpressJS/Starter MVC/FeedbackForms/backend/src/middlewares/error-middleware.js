// middleware -> 3 (req, res, next)
// error middleware -> 4 (err, req, res, next)

const errorHandler = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  //? short circuiting

  if (err.code == 11000) {
    err.statusCode = 409;
    err.message = `${Object.keys(err.keyValue)[0].toUpperCase()} already in use`;
  } else if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = err.message;
  } else if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = "Invalid _id.";
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errLine: err.stack,
    // errObj: err.keyValue,
  });

  next();
};

export default errorHandler;

//! this will be a global error handler, if a error occurs anywhere, the error is forwarded to this middleware

//~ so this errorHandler() will be called for every error that occurs

//& go to the main file, and use this function inside app.use()

//& inside trycatch, next(error)
