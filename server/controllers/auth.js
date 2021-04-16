import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");
    // register
    const user = new User(req.body);

    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log("CREATE USER FAILED", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user with that email exist
    let user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("User with that email not found");
    // compare password
    user.comparePassword(password, (err, match) => {
      if (!match || err) return res.status(400).send("Wrong password");
      // GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT
      let token = jwt.sign({ _id: user._id }, "DSKLAKLEW092385OI2J3I90FEIJ2H9OS0WIEH", {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.stripe_account_id,
          stripe_seller: user.stripe_seller,
          stripeSession: user.stripeSession,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(400).send("Signin failed");
  }
};


export const updateProfile = async (req, res) => {
  try {

    const { id, name, email, password } = req.body;

    const user = await User.findById(id);

    if(user)
    {
        user.name = name || user.name;
        user.email = req.body.email || user.email;
        if(password)
        {
            user.password = password;
        }

        const updatedUser = await user.save();

        let token = jwt.sign({ _id: user._id }, "DSKLAKLEW092385OI2J3I90FEIJ2H9OS0WIEH", {
          expiresIn: "7d",
        });

        res.json({
            token,
            user: updatedUser
        })
        
    }
    else
    {
        res.status(404);
        throw new Error('User Not Found');
    }


  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(400).send("Signin failed");
  }
};
