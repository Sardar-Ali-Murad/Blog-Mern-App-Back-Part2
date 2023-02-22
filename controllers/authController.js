import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import User from '../models/User.js';

const register = async (req, res) => {
  const { email, password, firstName,lastName,title,image } = req.body;

  if (!firstName || !email || !password || !lastName || !title) {
    throw new BadRequestError('please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ firstName, email, password,lastName,title,image });

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
     user:user,
     token:token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user,token });
};


const getCurrentUser=async (req,res)=>{
   let currentUser=await User.findOne({_id:req.user.userId})
   res.status(StatusCodes.OK).json({user:currentUser})
}

const getAllUsers=async (req,res)=>{
   let allUsers=await User.find({})
   res.status(StatusCodes.OK).json({user:allUsers})
}

export { register, login,getAllUsers,getCurrentUser};


