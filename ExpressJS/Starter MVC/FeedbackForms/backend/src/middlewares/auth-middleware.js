import jwt from "jsonwebtoken";
import UserModel from "../models/user-model.js";

export const authenticate = async (req, res, next) => {
  console.log(req.cookies);
  let { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  //! decode the token
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //   console.log("decodedToken: ", decodedToken);

  let userId = decodedToken.payload;

  //! find the user
  let user = await UserModel.findById(userId); //{_id: to ever}
  if (!user)
    return res.status(401).json({
      success: false,
      message: "Invalid session, please login again",
    });

  //! modify the req object
  req.myUser = user;
  next();
};

/* 
decodedToken:  {
  payload: '69c210b15e6ee7af6f17811a',
  iat: 1774414120, // issued at (create)
  exp: 1774500520 // expiry (timestamps)
}

req = {
  body:{},
  cookies:{},
  methods:{},
  url:{},
  myUser:{}

}
*/

//? middlewares
//! built in
//! error middlewares
//! global or app
//! third party
//! router level
