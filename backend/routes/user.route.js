import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, getUserRelations, login, logout, register ,searchUser} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
// import upload from "../middlewares/multer.js";
import storage from "../middlewares/storage.js";

const router = express.Router();
const upload = storage('profile')

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/getFollowingOrFollower/:id').get(isAuthenticated, getUserRelations);
router.route('/search').get(isAuthenticated,searchUser );

export default router;