import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import ApiResponse from "../utils/ApiResponse.handler.js";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email is already in use. Please try a different one.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Send success response
        res.status(200).json(new ApiResponse(200, { newUser }, "Account created successfully.",
        ))


    } catch (error) {

        if (error.code === 11000) {
            console.log('Duplicate Key Error:', Object.keys(error.keyValue)[0]);
            const field = Object.keys(error.keyValue)[0];
            console.log(field.charAt(0).toUpperCase() + field.slice(1))
            const message = `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use. Please try a different one.`;

            return res.status(400).json({
                message,
                success: false,
            });
        }

        console.error('Unhandled Error:', error);

        // Send error response
        return res.status(500).json({
            message: "An error occurred during registration.",
            error: error.message,
            success: false,
        });
    }
};


// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(401).json({
//                 message: "Something is missing, please check!",
//                 success: false,
//             });
//         }
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 message: "Incorrect email or password",
//                 success: false,
//             });
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatch) {
//             return res.status(401).json({
//                 message: "Incorrect email or password",
//                 success: false,
//             });
//         };

//         const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

//         // populate each post if in the posts array
//         const populatedPosts = await Promise.all(
//             user.posts.map( async (postId) => {
//                 const post = await Post.findById(postId);
//                 if(post.author.equals(user._id)){
//                     return post;
//                 }
//                 return null;
//             })
//         )
//         user = {
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             profilePicture: user.profilePicture,
//             bio: user.bio,
//             followers: user.followers,
//             following: user.following,
//             posts: populatedPosts
//         }
//         return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
//             message: `Welcome back ${user.username}`,
//             success: true,
//             user
//         });

//     } catch (error) {
//         console.log(error);
//     }
// };

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Populate user's posts if they exist
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                return post.author.equals(user._id) ? post : null;
            })
        );

        // Prepare the user data to send back
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts.filter(post => post !== null) // Filter out any null values
        };

        // Set the token as a cookie and also send it in the response headers
        return res
            .header('Authorization', `Bearer ${token}`)
            .cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 })
            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user
            })
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
            success: false,
        });
    }
}
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        let user = await User.findById(userId)
            .populate({ path: 'posts', createdAt: -1 }).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        console.log(profilePicture)
        let cloudResponse;

        // if (profilePicture) {
        // const fileUri = getDataUri(profilePicture);
        // cloudResponse = await cloudinary.uploader.upload(fileUri);
        // const fileUri=;
        // }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (req.file) user.profilePicture = req.file.path;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // patel
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}



export const getUserRelations = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the user by ID
        const user = await User.findById(userId).select('followers following');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Populate the followers and following lists with user details
        const followers = await User.find({ _id: { $in: user.followers } }).select('username _id profilePicture');
        const following = await User.find({ _id: { $in: user.following } }).select('username _id profilePicture');

        res.status(200).json({
            success: true,
            message: 'User relations fetched successfully',
            followers,
            following
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while fetching user relations',
            success: false
        });
    }
};


export const searchUser = async (req, res) => {
    try {
        console.log(req.query);
        const { query } = req.query;

        // Basic validation to check if the query exists
        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Search query cannot be empty' });
        }

        // Perform search in the username and email fields
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        // Check if users were found
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Return the found users
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

