import * as Post from '../models/Post.js';
import * as Notification from '../models/Notification.js';
import { validatePost } from '../utils/validators.js';
import { AppError } from '../middleware/errorHandler.js';

export const createPost = async (req, res, next) => {
  try {
    const { content, club_id } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    validatePost({ content, image });

    const postId = await Post.createPost({ user_id: req.user.id, content, image, club_id });
    const post = await Post.getPostById(postId, req.user.id);
    res.status(201).json(post);
  } catch (err) { next(err); }
};

export const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Post.getFeed(req.user.id, page, limit);
    res.json({ posts, page, hasMore: posts.length === limit });
  } catch (err) { next(err); }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const posts = await Post.getUserPosts(userId, req.user.id, page);
    res.json({ posts, page, hasMore: posts.length === 10 });
  } catch (err) { next(err); }
};

export const toggleLike = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const liked = await Post.toggleLike(req.user.id, postId);

    // Notify post owner on like
    if (liked) {
      const post = await Post.getPostById(postId, req.user.id);
      if (post && post.user_id !== req.user.id) {
        await Notification.createNotification({
          user_id: post.user_id,
          type: 'like',
          reference_id: postId,
          content: `${post.username || 'Someone'} liked your post`,
        });
        // Push via socket if available
        const io = req.app.get('io');
        if (io) io.to(`user_${post.user_id}`).emit('notification', { type: 'like', postId });
      }
    }

    res.json({ liked });
  } catch (err) { next(err); }
};

export const addComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const { content } = req.body;
    if (!content) throw new AppError('Comment content is required');

    const commentId = await Post.addComment({ user_id: req.user.id, post_id: postId, content });

    // Notify post owner
    const post = await Post.getPostById(postId, req.user.id);
    if (post && post.user_id !== req.user.id) {
      await Notification.createNotification({
        user_id: post.user_id,
        type: 'comment',
        reference_id: postId,
        content: `Someone commented on your post`,
      });
      const io = req.app.get('io');
      if (io) io.to(`user_${post.user_id}`).emit('notification', { type: 'comment', postId });
    }

    res.status(201).json({ id: commentId, message: 'Comment added' });
  } catch (err) { next(err); }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Post.getComments(parseInt(req.params.id));
    res.json(comments);
  } catch (err) { next(err); }
};

export const deletePost = async (req, res, next) => {
  try {
    const deleted = await Post.deletePost(parseInt(req.params.id), req.user.id);
    if (!deleted) throw new AppError('Post not found or unauthorized', 404);
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
};
