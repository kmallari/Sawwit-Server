-- !! VOTES ARE NOT IMPLEMENTED INTO THE API YET !!
-- TO DO: ADD SUBSTRACTING IN DELETES
-- CREATING THE TABLES
CREATE TABLE `users` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `profilePicture` VARCHAR(255) NOT NULL,
  `createdAt` BIGINT NOT NULL
);

CREATE TABLE `posts` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(21) NOT NULL,
  `username` VARCHAR(20) NOT NULL,
  `title` VARCHAR(300) NOT NULL,
  `body` VARCHAR(40000) NOT NULL,
  `subreddit` VARCHAR(20) NOT NULL,
  `subredditIcon` VARCHAR(255) NOT NULL,
  `commentsCount` INT NOT NULL,
  `upvotes` INT NOT NULL,
  `downvotes` INT NOT NULL,
  `createdAt` BIGINT NOT NULL
);

CREATE TABLE `comments` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(21) NOT NULL,
  `username` VARCHAR(20) NOT NULL,
  `userProfilePicture` VARCHAR (255) NOT NULL,
  `postId` VARCHAR(21) NOT NULL,
  `parentId` VARCHAR(21) NOT NULL,
  `body` VARCHAR(10000) NOT NULL,
  `createdAt` BIGINT NOT NULL,
  `level` INT NOT NULL,
  `childrenCount` INT NOT NULL,
  `upvotes` INT NOT NULL,
  `downvotes` INT NOT NULL
);

CREATE TABLE `subreddits` (
  `name` VARCHAR(20) NOT NULL PRIMARY KEY,
  `description` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(255) NOT NULL,
  `postCount` INT NOT NULL,
  `createdAt` BIGINT NOT NULL
);

-- NOT YET IMPLEMENTED SUBSCRIPTIONS AND VOTES
CREATE TABLE `subscriptions` (
  `userId` VARCHAR(21) NOT NULL,
  `subredditId` VARCHAR(21) NOT NULL,
  `createdAt` BIGINT NOT NULL
);

CREATE TABLE `postVotes` (
  `userId` VARCHAR(21) NOT NULL,
  `postId` VARCHAR(21) NOT NULL,
  `vote` TINYINT NOT NULL
);

CREATE TABLE `commentVotes` (
  `userId` VARCHAR(21) NOT NULL,
  `commentId` VARCHAR(21) NOT NULL,
  `vote` TINYINT NOT NULL
);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- CREATING INDEXES FOR USERS
ALTER TABLE
  `users`
ADD
  UNIQUE INDEX `username_index` (`username`);

ALTER TABLE
  `users`
ADD
  UNIQUE INDEX `email_index` (`email`);

ALTER TABLE
  `users`
ADD
  INDEX `createdAt_index` (`createdAt` DESC);

-- CREATING INDEXES FOR SUBREDDITS;
ALTER TABLE
  `subreddits`
ADD
  INDEX `createdAt_index` (`createdAt` DESC);

-- CREATING INDEXES FOR POSTS
ALTER TABLE
  `posts`
ADD
  INDEX `userId_index` (`userId`);

ALTER TABLE
  `posts`
ADD
  INDEX `subreddit_index` (`subreddit`);

ALTER TABLE
  `posts`
ADD
  INDEX `createdAt_index` (`createdAt` DESC);

-- CREATING INDEXES FOR COMMENTS
ALTER TABLE
  `comments`
ADD
  INDEX `postId_index` (`postId`);

ALTER TABLE
  `comments`
ADD
  INDEX `parentId_index` (`parentId`);

ALTER TABLE
  `comments`
ADD
  INDEX `createdAt_index` (`createdAt` DESC);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- CREATING THE STORED PROCEDURES FOR USERS
CREATE PROCEDURE GetAllUsers () BEGIN
SELECT
  *
FROM
  users;

END;

CREATE PROCEDURE RegisterUser (
  IN p_ID varchar(21),
  IN p_username varchar(20),
  IN p_email varchar(320),
  IN p_password varchar(255),
  IN p_profilepicture varchar(255),
  IN p_createdAt BIGINT
) BEGIN
INSERT INTO
  users (
    id,
    username,
    email,
    PASSWORD,
    profilePicture,
    createdAt
  )
VALUES
  (
    p_ID,
    p_username,
    p_email,
    p_password,
    p_profilepicture,
    p_createdAt
  );

END;

CREATE PROCEDURE CheckIfUsernameExists(p_username VARCHAR(20)) BEGIN
SELECT
  COUNT(username)
FROM
  users
WHERE
  username = p_username;

END;

CREATE PROCEDURE CheckIfEmailExists(p_email VARCHAR(320)) BEGIN
SELECT
  COUNT(email)
FROM
  users
WHERE
  email = p_email;

END;

CREATE PROCEDURE CheckIfIDExists(p_ID VARCHAR(21)) BEGIN
SELECT
  id,
  username,
  profilePicture
FROM
  users
WHERE
  id = p_ID;

END;

CREATE PROCEDURE LoginUser(
  p_email VARCHAR(320),
  p_username VARCHAR(20)
) BEGIN
SELECT
  id,
  username,
  email,
  profilePicture,
  PASSWORD,
  createdAt
FROM
  users
WHERE
  email = p_email
  OR username = p_username;

END;

CREATE PROCEDURE GetUserInformation(p_id VARCHAR(21)) BEGIN
SELECT
  id,
  username,
  email,
  profilePicture,
  createdAt
FROM
  users
WHERE
  id = p_id;

END;

CREATE PROCEDURE UpdateUsername(p_id VARCHAR(21), p_username VARCHAR(20)) BEGIN
UPDATE
  users
SET
  username = p_username
WHERE
  id = p_id;

END;

CREATE PROCEDURE UpdateEmail(p_id VARCHAR(21), p_email VARCHAR(320)) BEGIN
UPDATE
  users
SET
  email = p_email
WHERE
  id = p_id;

END;

CREATE PROCEDURE UpdateProfilePicture(p_id VARCHAR(21), p_profilepicture VARCHAR(255)) BEGIN
UPDATE
  users
SET
  profilePicture = p_profilepicture
WHERE
  id = p_id;

END;

CREATE PROCEDURE UpdatePassword(p_id VARCHAR(21), p_password VARCHAR(255)) BEGIN
UPDATE
  users
SET
  PASSWORD = p_password
WHERE
  id = p_id;

END;

CREATE PROCEDURE DeleteUser(p_id VARCHAR(21)) BEGIN
DELETE FROM
  users
WHERE
  id = p_id;

END;

-- CREATING STORED PROCEDURES FOR POSTS
CREATE PROCEDURE GetAllPosts () BEGIN
SELECT
  *
FROM
  posts
ORDER BY
  createdAt DESC;

END;

CREATE PROCEDURE GetPostsFromSubreddit(p_name VARCHAR(20)) BEGIN
SELECT
  *
FROM
  posts
WHERE
  subreddit = p_name
ORDER BY
  createdAt DESC;

END;

CREATE PROCEDURE CheckIfPostExists(p_id VARCHAR(21)) BEGIN
SELECT
  COUNT(id)
FROM
  posts
WHERE
  id = p_id;

END;

CREATE PROCEDURE CreatePost(
  IN p_ID VARCHAR(21),
  IN p_userId VARCHAR(21),
  IN p_username VARCHAR(20),
  IN p_title VARCHAR(300),
  IN p_body VARCHAR(40000),
  IN p_subreddit VARCHAR(20),
  IN p_subredditIcon VARCHAR(255),
  IN p_createdAt BIGINT
) BEGIN
INSERT INTO
  posts (
    id,
    userId,
    username,
    title,
    body,
    subreddit,
    subredditIcon,
    createdAt,
    commentsCount,
    upvotes,
    downvotes
  )
VALUES
  (
    p_ID,
    p_userId,
    p_username,
    p_title,
    p_body,
    p_subreddit,
    p_subredditIcon,
    p_createdAt,
    0,
    0,
    0
  );

UPDATE
  subreddits
SET
  postCount = postCount + 1
WHERE
  name = p_subreddit;

END;

CREATE PROCEDURE UpdatePostBody(p_id VARCHAR(21), p_body VARCHAR(40000)) BEGIN
UPDATE
  posts
SET
  body = p_body
WHERE
  id = p_id;

END;

CREATE PROCEDURE GetOnePost(p_id VARCHAR(21)) BEGIN
SELECT
  *
FROM
  posts
WHERE
  id = p_id;

END;

CREATE PROCEDURE GetUserPosts(p_userid VARCHAR(21)) BEGIN
SELECT
  *
FROM
  posts
WHERE
  userId = p_userid
ORDER BY
  createdAt DESC;

END;

CREATE PROCEDURE DoesPostExist(p_id VARCHAR(21)) BEGIN
SELECT
  COUNT(id)
FROM
  posts
WHERE
  id = p_id;

END;

CREATE PROCEDURE DeletePost(p_id VARCHAR(21)) BEGIN
DELETE FROM
  posts
WHERE
  id = p_id;

END;

-- STORED PROCEDURES FOR SUBREDDITS
CREATE PROCEDURE GetAllSubreddits () BEGIN
SELECT
  *
FROM
  subreddits;

END;

CREATE PROCEDURE GetSubredditInfo (p_name VARCHAR(21)) BEGIN
SELECT
  *
FROM
  subreddits
WHERE
  name = p_name;

END;

CREATE PROCEDURE CheckIfSubredditExists(p_subreddit VARCHAR(20)) BEGIN
SELECT
  name,
  icon,
  postCount
FROM
  subreddits
WHERE
  name = p_subreddit;

END;

CREATE PROCEDURE CreateSubreddit (
  p_name VARCHAR(20),
  p_description VARCHAR(255),
  p_icon VARCHAR(255),
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  subreddits (
    name,
    description,
    icon,
    createdAt,
    postCount
  )
VALUES
  (
    p_name,
    p_description,
    p_icon,
    p_createdAt,
    0
  );

END;

CREATE PROCEDURE UpdateSubredditDescription (
  p_name VARCHAR(21),
  p_description VARCHAR(255)
) BEGIN
UPDATE
  subreddits
SET
  description = p_description
WHERE
  name = p_name;

END;

CREATE PROCEDURE SearchSubreddit (p_name VARCHAR(20)) BEGIN
SELECT
  *
FROM
  subreddits
WHERE
  name LIKE p_name;

END;

-- STORED PROCEDURES FOR COMMENTS
CREATE PROCEDURE GetAllComments () BEGIN
SELECT
  *
FROM
  comments
ORDER BY
  createdAt DESC;

END;

CREATE PROCEDURE CreateComment(
  IN p_id VARCHAR(21),
  IN p_userid VARCHAR(21),
  IN p_username VARCHAR(20),
  IN p_userProfilePicture VARCHAR(255),
  IN p_postid VARCHAR(21),
  IN p_parentid VARCHAR(21),
  IN p_body VARCHAR(10000),
  IN p_createdAt BIGINT,
  IN p_parentLevel INT
) BEGIN
INSERT INTO
  comments (
    id,
    userId,
    username,
    userProfilePicture,
    postId,
    parentId,
    body,
    createdAt,
    LEVEL,
    childrenCount,
    upvotes,
    downvotes
  )
VALUES
  (
    p_id,
    p_userid,
    p_username,
    p_userProfilePicture,
    p_postid,
    p_parentid,
    p_body,
    p_createdAt,
    p_parentLevel + 1,
    0,
    0,
    0
  );

UPDATE
  posts
SET
  commentsCount = commentsCount + 1
WHERE
  id = p_postid;

UPDATE
  comments
SET
  childrenCount = childrenCount + 1
WHERE
  id = p_parentid;

END;

CREATE PROCEDURE GetPostComments(p_postid VARCHAR(21)) BEGIN
SELECT
  *
FROM
  comments
WHERE
  postId = p_postid
ORDER BY
  createdAt DESC;

END;

CREATE PROCEDURE DeleteComment(p_id VARCHAR(21)) BEGIN
DELETE FROM
  comments
WHERE
  id = p_id;

END;

CREATE PROCEDURE GetOneComment(p_id VARCHAR(21)) BEGIN
SELECT
  *
FROM
  comments
WHERE
  id = p_id;

END;

CREATE PROCEDURE GetNextComments (p_parentid VARCHAR(21)) BEGIN
SELECT
  *
FROM
  comments
WHERE
  parentId = p_parentid
ORDER BY
  createdAt DESC;

END;

CREATE PROCEDURE ChangeComment(
  IN p_id VARCHAR(21),
  IN p_body VARCHAR(10000)
) BEGIN
UPDATE
  comments
SET
  body = p_body
WHERE
  id = p_id;

END;

CREATE PROCEDURE CheckIfCommentExists(p_id VARCHAR(21)) BEGIN
SELECT
  COUNT(id)
FROM
  comments
WHERE
  id = p_id;

END;

-- STORED PROCEDURES FOR POST VOTES
CREATE PROCEDURE CheckIfUserVotedPost(p_userId VARCHAR(21), p_postId VARCHAR(21)) BEGIN
SELECT
  vote
FROM
  postVotes
WHERE
  userId = p_userId
  AND postId = p_postId;

END;

CREATE PROCEDURE CreatePostVote (
  p_userId VARCHAR(21),
  p_postId VARCHAR(21),
  p_vote TINYINT
) BEGIN
INSERT INTO
  postVotes (userId, postId, vote)
VALUES
  (p_userId, p_postId, p_vote);

UPDATE
  posts
SET
  upvotes = upvotes + p_vote
WHERE
  id = p_postId
  AND p_vote = 1;

UPDATE
  posts
SET
  downvotes = downvotes - p_vote
WHERE
  id = p_postId
  AND p_vote = -1;

END;

CREATE PROCEDURE DecrementPostUpvote (p_postId VARCHAR(21)) BEGIN
UPDATE
  posts
SET
  upvotes = upvotes - 1
WHERE
  id = p_postId;

END;

CREATE PROCEDURE DecrementPostDownvote (p_postId VARCHAR(21)) BEGIN
UPDATE
  posts
SET
  downvotes = downvotes - 1
WHERE
  id = p_postId;

END;

CREATE PROCEDURE DeletePostVote (
  p_userId VARCHAR(21),
  p_postId VARCHAR(21)
) BEGIN
DELETE FROM
  postVotes
WHERE
  userId = p_userId
  AND postId = p_postId;

END;

-- STORED PROCEDURES FOR COMMENT VOTES
CREATE PROCEDURE CheckIfUserVotedComment (p_userId VARCHAR(21), p_commentId VARCHAR(21)) BEGIN
SELECT
  vote
FROM
  commentVotes
WHERE
  userId = p_userId
  AND commentId = p_commentId;

END;

CREATE PROCEDURE CreateCommentVote (
  p_userId VARCHAR(21),
  p_commentId VARCHAR(21),
  p_vote INT
) BEGIN
INSERT INTO
  commentVotes (userId, commentId, vote)
VALUES
  (
    p_userId,
    p_commentId,
    p_vote
  );

UPDATE
  comments
SET
  upvotes = upvotes + p_vote
WHERE
  id = p_commentId
  AND p_vote = 1;

UPDATE
  comments
SET
  downvotes = downvotes - p_vote
WHERE
  id = p_commentId
  AND p_vote = -1;

END;

CREATE PROCEDURE DecrementCommentUpvote (p_commentId VARCHAR(21)) BEGIN
UPDATE
  comments
SET
  upvotes = upvotes - 1
WHERE
  id = p_commentId;

END;

CREATE PROCEDURE DecrementCommentDownvote (p_commentId VARCHAR(21)) BEGIN
UPDATE
  comments
SET
  downvotes = downvotes - 1
WHERE
  id = p_commentId;

END;

CREATE PROCEDURE DeleteCommentVote (
  p_userId VARCHAR(21),
  p_commentId VARCHAR(21)
) BEGIN
DELETE FROM
  commentVotes
WHERE
  userId = p_userId
  AND commentId = p_commentId;

END;

-- STORED PROCEDURES FOR SUBSCRIPTIONS
CREATE PROCEDURE GetUserSubscriptions(p_userId VARCHAR(21)) BEGIN
SELECT
  *
FROM
  subscriptions
WHERE
  userId = p_userId
ORDER BY
  createdAt DESC;

END;

-- MAKE SURE TO CHANGE SUBREDDIT ID
CREATE PROCEDURE Subscribe (
  p_userId VARCHAR(21),
  p_subredditId VARCHAR(21),
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  subscriptions (
    userId,
    subredditId,
    createdAt
  )
VALUES
  (
    p_userId,
    p_subredditId,
    p_createdAt
  );

END;

CREATE PROCEDURE Unscubscribe (
  p_userId VARCHAR(21),
  p_subredditId VARCHAR(21)
) BEGIN
DELETE FROM
  subscriptions
WHERE
  userId = p_userId
  AND subredditId = p_subredditId;

END;