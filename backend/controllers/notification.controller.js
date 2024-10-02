// notification.controller.js

import { Notification } from "../models/notification.model.js";

export const getAllNotificationForSpecificUser = async (req, res) => {
    try {
      const userId = req.id;
      console.log("userId",userId);
  
      const notifications = await Notification.find({
        $and: [
          { fromUser: { $ne: userId } },
          { user: { $ne: userId } },  // Replace with your specific condition for `user`
        ]
      }).sort({ createdAt: -1 });
      
  
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
  
  export const seenNotification = async (req, res) => {
    try {
      const notificationId = req.params.id;  // Get notification _id from params
  
      // Update the specific notification by its _id
      await Notification.updateOne(
        { _id: notificationId },             // Match notification by _id
        { $set: {  read: true } }  // Set 'isSeen' and 'read' to true
      );
  
      return res.status(200).json({ success: true, message: 'Notification marked as seen.' });
    } catch (error) {
      console.error("Error updating notification:", error);
      return res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
    }
  };
  