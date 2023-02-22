// import jwt from 'jsonwebtoken';
// import { UnAuthenticatedError } from '../errors/index.js';

// const auth = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     throw new UnAuthenticatedError('Authentication Invalid');
//   }
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const testUser = payload.userId === '63628d5d178e918562ef9ce8';
//     req.user = { userId: payload.userId, testUser };
//     next();
//   } catch (error) {
//     throw new UnAuthenticatedError('Authentication Invalid');
//   }
// };

// export default auth;


import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnAuthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];
  console.log(token)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    const testUser = payload.userId === '62f801d0510a7c1ed2312d52';
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication invalid');
  }
};

export default auth