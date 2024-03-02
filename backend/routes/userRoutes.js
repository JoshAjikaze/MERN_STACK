import express from "express";
import { createUser, loginUser, resetPassword, logoutUser } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.route('/').post(createUser);
userRoutes.route('/auth').post(loginUser);
userRoutes.route('/logout').post(logoutUser);
userRoutes.route('/resetPwd').put(resetPassword);

export default userRoutes;