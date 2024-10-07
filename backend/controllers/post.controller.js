import sharp from "sharp";
// import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
// import {io} from '../index.js'
import { register } from "./user.controller.js";
import { Notification } from "../models/notification.model.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        // if (!image) return res.status(400).json({ message: 'Image required' });

        // // image upload 
        // const optimizedImageBuffer = await sharp(image.buffer)
        //     .resize({ width: 800, height: 800, fit: 'inside' })
        //     .toFormat('jpeg', { quality: 80 })
        //     .toBuffer();

        // buffer to data uri
        // const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        // const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: image.path,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });
        await Notification.create({
            user: authorId,
            type: 'post',
            fromUser: authorId,
            post: post._id,
            message:`${user.username} has posted a new post`
        })
        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author',  })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username, profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username, profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;  // User ID from request (assumed extracted from JWT or session)
        const postId = req.params.id;  // Post ID from route parameters
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        // Like logic
        const alreadyLiked = post.likes.includes(likeKrneWalaUserKiId);
        if (alreadyLiked) {
            return res.status(400).json({ message: 'Post already liked', success: false });
        }

        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });

        // Get the details of the user who liked the post
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');

        // If the post owner is not the user who liked it, send a notification
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKrneWalaUserKiId) {
            // Emit a real-time notification via Socket.IO
            const notification = {
                type: 'like',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Your post was liked',
            };

            const postOwnerSocketId = getReceiverSocketId(postOwnerId); // Assuming getReceiverSocketId is implemented
            io.to(postOwnerSocketId).emit('notification', notification); // Send notification via Socket.IO
        }

        // Save the notification to the database
        await Notification.create({
            user: postOwnerId,  // Post owner's ID
            type: 'like',  // Notification type
            fromUser: likeKrneWalaUserKiId,  // The user who liked the post
            post: post._id,  // Post reference
            message: `${user.username} liked your post`,  // Notification message
        });

        // Return a success response
        return res.status(200).json({ message: 'Post liked', success: true });

    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error liking post:', error);
        return res.status(500).json({ message: 'An error occurred', success: false });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKrneWalaUserKiId){
            // emit a notification event
            const notification = {
                type:'dislike',
                userId:likeKrneWalaUserKiId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }
        await Notification.create({
            user: postOwnerId,  // Post owner's ID
            type: 'dislike',  // Notification type
            fromUser: likeKrneWalaUserKiId,  // The user who disliked the post
            post: post._id,  // Post reference
            message: `${user.username} disliked your post`,  // Notification message
        });


        return res.status(200).json({message:'Post disliked', success:true});
    } catch (error) {

    }
}
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id; // Post ID from route parameters
        const commentKrneWalaUserKiId = req.id; // User ID from request (JWT or session)

        const { text } = req.body;

        // Validate that the text field is present
        if (!text) {
            return res.status(400).json({ message: 'Text is required', success: false });
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        // Create a new comment
        const comment = await Comment.create({
            text,
            author: commentKrneWalaUserKiId,
            post: postId
        });

        // Populate the author field with the username and profile picture
        await comment.populate({
            path: 'author',
            select: "username profilePicture"
        });

        // Push the new comment's ID to the post's comments array and save the post
        post.comments.push(comment._id);
        await post.save();

        // Get the post owner's ID
        const postOwnerId = post.author.toString();

        // Send notification only if the commenter is not the post owner
        if (postOwnerId !== commentKrneWalaUserKiId) {
            const user = await User.findById(commentKrneWalaUserKiId).select('username profilePicture');

            // Save the notification to the database
            await Notification.create({
                user: postOwnerId,  // Post owner's ID
                type: 'comment',  // Notification type
                fromUser: commentKrneWalaUserKiId,  // The user who commented
                post: post._id,  // Post reference
                message: `${user.username} commented on your post`,  // Notification message
            });

            // Emit a real-time notification via Socket.IO (if implemented)
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);  // Assuming getReceiverSocketId is implemented
            io.to(postOwnerSocketId).emit('notification', {
                type: 'comment',
                userId: commentKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Your post received a new comment',
            });
        }

        // Return the response with the comment details
        return res.status(201).json({
            message: 'Comment Added',
            comment,
            success: true
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'An error occurred', success: false });
    }
};

export const getCommentsOfPost = async (req,res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate('author', 'username profilePicture');

        if(!comments) return res.status(404).json({message:'No comments found for this post', success:false});

        return res.status(200).json({success:true,comments});

    } catch (error) {
        console.log(error);
    }
}
export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        // check if the logged-in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(403).json({message:'Unauthorized'});

        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:'Post deleted'
        })

    } catch (error) {
        console.log(error);
    }
}
export const bookmarkPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // already bookmarked -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

        }else{
            // bookmark krna pdega
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
        }

    } catch (error) {
        console.log(error);
    }
}

export const _explorePosts = async (req, res) => {
    const { type, limit, tag } = req.query;

    try {
        let query = {};
      console.log(type)
        // Filter by tags if provided
        if (tag) {
            query.tags = tag;
        }

        // Ensure limit is a number and default to 10 if not provided
        const postLimit = parseInt(limit) || 10;

        let posts;

        switch (type) {
            case 'random':
                // Fetch random posts
                posts = await Post.aggregate([{ $sample: { size: postLimit } }]);
                break;
            case 'most_liked':
                // Fetch posts sorted by likes in descending order
                posts = await Post.find(query).sort({ likes: -1 }).limit(postLimit);
                break;
            case 'most_viewed':
                // Fetch posts sorted by views in descending order
                posts = await Post.find(query).sort({ views: -1 }).limit(postLimit);
                break;
            default:
                // Default case: fetch recent posts
                posts = await Post.find(query).limit(postLimit);
                break;
        }

        res.json(posts);
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).json({ message: 'Server Error' });
    }
};

export const explorePosts = async (req, res) => {
    try {
        const loggedInUserId = req.id; // Assuming user ID is in req.user.id

        // Fetch posts excluding those authored by the logged-in user
        const posts = await Post.find();

        return res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
