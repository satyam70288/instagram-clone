// notification.controller.js

import { Notification } from "../models/notification.model.js";

export const getAllNotificationForSpecificUser = async (req, res) => {
    try {
      const userId = req.id;
      console.log("userId",userId);
  
      const notifications = await Notification.find({ fromUser: { $ne: userId } })
        .sort({ createdAt: -1 });
  
      return res.status(200).json({
        notifications,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message,
      });
    }
  };
  