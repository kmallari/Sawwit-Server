var express = require("express");
var router = express.Router();

const knex = require("../repositories/db.config.js");
const subredditsRepository =
  require("../repositories/subreddits.repository.js")(knex);
const subredditController = require("../controllers/subreddit.controller.js")(
  subredditsRepository
);

router.get("/", subredditController.getAllSubreddits);
router.get("/search", subredditController.searchSubreddit);
router.get("/:subreddit", subredditController.getSubredditInfo);
router.post("/", subredditController.postSubreddit);
router.put("/:subreddit", subredditController.putSubreddit);

module.exports = router;
