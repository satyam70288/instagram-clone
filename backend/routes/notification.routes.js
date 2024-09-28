import express from "express";
import { getAllNotificationForSpecificUser, seenNotification } from "../controllers/notification.controller.js";
// Wherever you are importing
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/all').get(isAuthenticated,getAllNotificationForSpecificUser);
router.route('/update/:id').patch(isAuthenticated,seenNotification);

export default router;