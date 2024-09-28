import express from "express";
import { getAllNotificationForSpecificUser } from "../controllers/notification.controller.js";
// Wherever you are importing
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/all').get(isAuthenticated,getAllNotificationForSpecificUser);
 
export default router;