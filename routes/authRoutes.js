import express from 'express';
const router = express.Router();
import auth from "../middleware/auth.js"

import {
  register,
  login,
  getCurrentUser,
  getAllUsers,
} from '../controllers/authController.js';


router.route('/register').post( register);
router.route('/login').post(login);
router.route('/getCurrentUser').get(auth,getCurrentUser);
router.route('/getAllUsers').get(auth,getAllUsers);

export default router;
