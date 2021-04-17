import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middleware
import { requireSignin, hotelOwner } from "../middleware/index.js";
// controllers
import {
  sellerHotels,
  userHotelBookings,
} from "../controllers/hotel.js";

router.get("/mybooking", requireSignin, userHotelBookings);
router.get("/myowned", requireSignin, sellerHotels); 

export default router;
