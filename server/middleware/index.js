import expressJwt from "express-jwt";
import Hotel from "../models/hotel";

// req.user
export const requireSignin = expressJwt({
  // secret, expiryDate
  secret: "DSKLAKLEW092385OI2J3I90FEIJ2H9OS0WIEH",
  algorithms: ["HS256"],
});

export const hotelOwner = async (req, res, next) => {
  let hotel = await Hotel.findById(req.params.hotelId).exec();
  let owner = hotel.postedBy._id.toString() === req.user._id.toString();
  if (!owner) {
    return res.status(403).send("Unauthorized");
  }
  next();
};
