import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middleware
import { requireSignin, hotelOwner } from "../middleware";
// controllers
import {
  sellerHotels,
  userHotelBookings,
} from "../controllers/hotel";

router.get("/mybooking", requireSignin, userHotelBookings);
router.get("/myowned", requireSignin, sellerHotels); 

export default router;
