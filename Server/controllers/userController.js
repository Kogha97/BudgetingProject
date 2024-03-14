import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendEmail from "../utils/sendRegistrationEmail.js";

export const handleRegister = async (req, res) => {
  try {
    console.log(req.body)
    const hash = await bcrypt.hash(req.body.password, 10)
    req.body.password = hash;

    const newUser = await User.create(req.body);
 
    const token = jwt.sign({ id: newUser._id}, process.env.SECRET, {
      expiresIn: "1d"
    });
    sendEmail(token)

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ error in register:", error.message);

    res.status(500).send({ success: false, error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  try {

    const user = await User.findOne({
      $or: [
        { username: req.body.emailOrUsername },
        { email: req.body.emailOrUsername },
      ],

    });


    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    if(!user.verified){
      return res.send({success: false, message:'User not verified'})
    }
    
    const passMatch = await bcrypt.compare(req.body.password, user.password);
    console.log("🚀 ~ handleLogin ~ passMatch:", passMatch);

  
    if (!passMatch) {
      return res.send({ success: false, message: "Invalid password" });
    }
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;


 
    const token = jwt.sign({id: user._id}, process.env.SECRET, {expiresIn: '30m'})

    res.cookie('userCookie', token)

    res.send({ success: true, user: userWithoutPassword });

  } catch (error) {
    console.log("🚀 ~ error in login:", error.message);

    res.status(500).send({ success: false, message: error.message });
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
  };

export const handleBudgetTargets = async (req, res) => {

  const { userId } = req.params;
  const {categoryName, targetAmount} = req.body
  try {
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).send('User not found')
    }
    const targetIndex = user.budgetTargets.findIndex(target => target.categoryName === categoryName);
    if (targetIndex !== -1){
      user.budgetTargets[targetIndex].targetAmount = targetAmount;
    } else {
      user.budgetTargets.push({ categoryName,targetAmount});
    }

    await user.save()
      
    res.status(200).json({success: true, budgetTargets: user.budgetTargets})
    
  } catch (error) {
    console.log('error in handleBudgetTargets',error.message)
    res.status(500).send('Error in handleBudgetTargets')
  }
};

export const handleGetBudgetTargets = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('budgetTargets -_id')
    if(!user){
      return res.status(404).json({ message:'User Not found'})
    }
    res.json({ budgetTargets: user.budgetTargets });
  } catch (error) {
    console.log('error in handleGetBudgetTargets:', error.message)
    res.status(500).send('Error in handleGetBudgetTargets')
  }
}

export const handleBudgetCurrent = async (req, res) => {
  try {

  const { userId } = req.params;

  if (!userId) return req.send({success: false, error: "userid undefined"})

  const {categoryName, currentAmount} = req.body
  const user = await User.findById(userId);

  if(!user){
    return res.status(404).send('User not found')
  }
  const currentIndex = user.budgetCurrent.findIndex(current => current.categoryName === categoryName);
  if (currentIndex !== -1){
    user.budgetCurrent[currentIndex].currentAmount = currentAmount;
  } else {
    user.budgetCurrent.push({ categoryName,currentAmount});
  }

  await user.save()
    
  res.status(200).json({success: true, budgetCurrent: user.budgetCurrent})
  
} catch (error) {
  console.log('error in handleBudgeCurrent',error.message)
  res.status(500).send({success: false, error:  error.message})
}
};

export const handleGetBudgetCurrent = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('budgetCurrent -_id')
    if(!user){
      return res.status(404).json({ message:'User Not found'})
    }
    res.json({ budgetCurrent: user.budgetCurrent });
  } catch (error) {
    console.log('error in handleGetBudgetCurrent:', error.message)
    res.status(500).send('Error in handleGetBudgetCurrent')
  }
}

export const handleLogout = async (req, res) => {
  try {
    console.log('this is logout')
    res.clearCookie('userCookie')
    res.send({success: true })
  } catch (error) {
    console.log("🚀 ~ handleLogout ~ error:", error)
    res.status(500).send({success: false, error: error.message})
  }
}

export const handleEmailConfirm = async (req, res) => {
  try {
    console.log(req.params)

    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.SECRET)

    const user = await User.findByIdAndUpdate(decoded.id, {verified: true}, {
      new: true
    })

    res.send({success: true})
  } catch (error) {
    res.status(500).send({success: false, errro: error.message})
  }
}