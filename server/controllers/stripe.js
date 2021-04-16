import User from "../models/user";
import Stripe from "stripe";
import queryString from "query-string";
import Hotel from "../models/hotel";
import Order from "../models/order";

const stripeSecret = "sk_test_51IbjczCu4J6f0rVjIzFCp7BpedciaHL9w6CLk8y6uumULBV3SHw3GBsqYxn75oml90VMnOSgy9xhOn1UJmD5ZsKf00XPUElmXl";

const stripe = Stripe(stripeSecret);

let checkIn1="", checkOut1="", rooms1=0, totalPrice1=0, totalDays1=0;

export const createConnectAccount = async (req, res) => {
  // 1. find user from db
  const user = await User.findById(req.user._id).exec();
  // console.log("USER ==> ", user);
  // 2. if user don't have stripe_account_id yet, create now
  if (!user.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
    });
    // console.log("ACCOUNT ===> ", account);
    user.stripe_account_id = account.id;
    user.save();
  }
  // 3. create login link based on account id (for frontend to complete onboarding)
  let accountLink = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: "account_onboarding",
  });
  // prefill any info such as email
  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email || undefined,
  });
  // console.log("ACCOUNT LINK", accountLink);
  let link = `${accountLink.url}?${queryString.stringify(accountLink)}`;
  // console.log("LOGIN LINK", link);
  res.send(link);
  // 4. update payment schedule (optional. default is 2 days
};

const updateDelayDays = async (accountId) => {
  const account = await stripe.accounts.update(accountId, {
    settings: {
      payouts: {
        schedule: {
          delay_days: 7,
        },
      },
    },
  });
  return account;
};
 
export const getAccountStatus = async (req, res) => {
  // console.log("GET ACCOUNT STATUS");
  const user = await User.findById(req.user._id).exec();
  const account = await stripe.accounts.retrieve(user.stripe_account_id);
  // console.log("USER ACCOUNT RETRIEVE", account);
  // update delay days
  const updatedAccount = await updateDelayDays(account.id);
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      stripe_seller: updatedAccount,
    },
    { new: true }
  )
    .select("-password")
    .exec();
  // console.log(updatedUser);
  res.json(updatedUser);
};

export const getAccountBalance = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    // console.log("BALANCE ===>", balance);
    res.json(balance);
  } catch (err) {
    console.log(err);
  }
};

export const payoutSetting = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();

    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_account_id,
      {
        redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL,
      }
    );
    // console.log("LOGIN LINK FOR PAYOUT SETTING", loginLink);
    res.json(loginLink);
  } catch (err) {
    console.log("STRIPE PAYOUT SETTING ERR ", err);
  }
};
 
export const stripeSessionId = async (req, res) => {
  
  try { 
      
    const {hotelId, rooms, checkIn, checkout} = req.body;

    const day = 24 * 60 * 60 * 1000;
    const start = new Date(checkIn);
    const end = new Date(checkout); 
    const totalDays = Math.round(Math.abs((start - end) / day));

    // 2 find the hotel based on hotel id from db
    const item = await Hotel.findById(hotelId).populate("postedBy").exec();

    const totalPrice = item.price * totalDays * rooms;

    checkIn1 = checkIn, checkOut1 = checkout, totalDays1 = totalDays, rooms1 = rooms, totalPrice1 = totalPrice;


    // 3 20% charge as application fee
    const fee = (totalPrice * 20) / 100;
    // 4 create a session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // 5 purchasing item details, it will be shown to user on checkout
      line_items: [
        {
          name: item.title,
          amount: totalPrice * 100, // in cents
          currency: "usd",
          quantity: 1,
        },
      ],
      // 6 create payment intent with application fee and destination charge 80%
      payment_intent_data: {
        application_fee_amount: fee * 100,
        // this seller can see his balance in our frontend dashboard
        transfer_data: {
          destination: item.postedBy.stripe_account_id,
        },
      },
      // success and cancel urls
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${item._id}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    // 7 add this session object to user in the db
    await User.findByIdAndUpdate(req.user._id, { stripeSession: session }).exec();
    // 8 send session id as resposne to frontend
    res.send({
      sessionId: session.id,
    });

  } catch (error) {
      console.log("Session ID  Error **  ", error);
  }

  
};

export const stripeSuccess = async (req, res) => {
  try { 
    // 1 get hotel id from req.body
    const { hotelId } = req.body;
    // 2 find currently logged in user
    const user = await User.findById(req.user._id).exec();
    // check if user has stripeSession
    if (!user.stripeSession) return;
    // 3 retrieve stripe session, based on session id we previously save in user db
    const session = await stripe.checkout.sessions.retrieve(
      user.stripeSession.id
    );
    // 4 if session payment status is paid, create order
    if (session.payment_status === "paid") {
      // 5 check if order with that session id already exist by querying orders collection
      const orderExist = await Order.findOne({
        "session.id": session.id,
      }).exec();
      if (orderExist) {
        // 6 if order exist, send success true
        res.json({ success: true });
      } else {
        // 7 else create new order and send success true
        let newOrder = await new Order({
          hotel: hotelId,
          session,
          checkIn: checkIn1,
          checkOut: checkOut1,
          rooms: rooms1,
          totalPrice: totalPrice1,
          orderedBy: user._id,
        }).save();

        checkIn1="", checkOut1="", rooms1=0, totalPrice1=0, totalDays1=0;

        // 8 remove user's stripeSession
        await User.findByIdAndUpdate(user._id, {
          $set: { stripeSession: {} },
        });
        res.json({ success: true });
      }
    }
  } catch (err) {
    console.log("STRIPE SUCCESS ERR", err);
  }
};
