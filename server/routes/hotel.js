import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middleware
import { requireSignin, hotelOwner } from "../middleware";
// controllers
import {
  create,
  hotels,
  image,
  sellerHotels,
  remove,
  read,
  update,
  userHotelBookings,
  searchListings,
} from "../controllers/hotel";

router.post("/", requireSignin, formidable(), create);
router.get("/", hotels);
router.get("/image/:hotelId", image);
router.delete("/:hotelId", requireSignin, hotelOwner, remove);
router.get("/:hotelId", read);
router.put("/:hotelId",requireSignin,hotelOwner,formidable(),update);
router.get("/mybooking", requireSignin, userHotelBookings);
router.get("/own", requireSignin, sellerHotels); 
router.post("/search-listings", searchListings);

export default router;
