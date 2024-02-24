import User from "../models/User.js";

export const handleRegister = async (req, res) => {
  try {
    console.log("this is register", req.body);

    const newUser = await User.create(req.body);
    console.log("🚀 ~ newUser:", newUser);

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ error in register:", error.message);

    res.status(500).send({ success: false, error: error.message });
  }
};

export const handleLogin = async (req, res) => {
    try {
      console.log("this is login", req.body);
  
      const user = await User.findOne({
        $or: [
          { username: req.body.emailOrUsername },
          { email: req.body.emailOrUsername },
        ],
        password: req.body.password,
      }).select("-password");
    
  
      if (!user) {
        return res.send({ success: false });
      }
  
      res.send({ success: true, user });
    } catch (error) {
      console.log("🚀 ~ error in login:", error.message);
  
      res.status(500).send(error.message);
    }
  };

  export const handleUpdate = async (req, res) => {
    try {
      

      const { firstName, lastName, phoneNumber, email, userId } = req.body;

      const avatarUrl = req.file ? req.file.path : undefined;
  
      const updatedUser = await User.findByIdAndUpdate(userId, 
        { $set: { firstName, lastName, phoneNumber, email, ...(avatarUrl && { avatarUrl }) } },
        { new: true }
      );
  
      if (updatedUser) {
        res.json({ success: true, user: updatedUser });
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).send('Server error during profile update.');
    }
  }
