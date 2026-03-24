// generating a token
import jwt from "jsonwebtoken";

export const generateJWT = (payload) => {
  let token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

// jwt.sign({"payload"}, "secret_key", {expiresIn:"time"})
