import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    hotel: {
      type: ObjectId,
      ref: "Hotel",
    },
    session: {},

    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      // required: true,
    },
    rooms: {
      type: Number,
      required: "Rooms is Required"
    },
    totalPrice: {
      type: Number,
      required: "Total Price is required",
      trim: true,
    },
    orderedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
