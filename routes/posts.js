var express = require("express");
var router = express.Router();
const { upload } = require("../controllers/storage");
const db = require("../repositories/db.config.js");
const redis = require("../repositories/redis.config");

const postsRepository = require("../repositories/posts.repository.js")(db);
const postController = require("../controllers/post.controller.js")(
  postsRepository
);

const commentsRepository = require("../repositories/comments.repository.js")(
  db,
  redis
);
const commentController = require("../controllers/comment.controller.js")(
  commentsRepository
);

router.get("/", postController.getAllPosts);
// !! REFACTOR TO IMPLEMENT IN POST POST
router.post("/media", upload.single("imgfile"), postController.testMedia);
//
router.get("/subreddit/:subreddit", postController.getPostsFromSubreddit);
router.get("/user/:userId", postController.getUserPosts);
router.post("/submit", postController.postPost);
router.get("/:postId", postController.getOnePost);
router.post("/:postId", postController.votePost);
router.put("/:postId", postController.putPost);
router.delete("/:postId", postController.deletePost);

// comments
router.post("/:postId/comments", commentController.postComment);
router.get(
  "/:postId/parentComments",
  commentController.getParentCommentsFromPost
);
router.get("/:postId/comments", commentController.getPostComments);
router.get("/:postId/comments/next", commentController.getNextComments);
router.get("/:postId/comments/:commentId", commentController.getOneComment);
router.put("/:postId/comments/:commentId", commentController.putComment);
router.delete("/:postId/comments/:commentId", commentController.deleteComment);

module.exports = router;
