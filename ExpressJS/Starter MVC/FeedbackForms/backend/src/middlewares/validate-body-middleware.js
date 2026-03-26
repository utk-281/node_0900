export const validateBody = (schema) => {
  return (req, res, next) => {
    let { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      let errorMessages = error.details.map((err) => err.message);
      return res.status(400).json({
        success: false,
        errorMessages,
      });
    }
    req.body = value;
    next();
  };
};
