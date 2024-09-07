import express from "express";
 import isAuthenticated from "../middlewares/isAuthenticated.js";
import  {addViewToStory, createSory, getAllStorys}  from "../controllers/story.conroller.js";
import storage from "../middlewares/storage.js";

const router = express.Router();
const upload = storage('profile')

router.route('/create').post(upload.single('post'),isAuthenticated,createSory );
router.route('/get').get(getAllStorys );
router.route('/view/:storyId').post(isAuthenticated, addViewToStory );


export default router;