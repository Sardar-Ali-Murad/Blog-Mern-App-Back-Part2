import express from "express"
let router=express.Router()

import {createBlog,updateBlog,deleteBlog,getSingleBlog,getAllBlogs,updateVotes}  from "../controllers/blogController.js"


router.route("/").post(createBlog).get(getAllBlogs)
router.route("/vote/:blogId").get(updateVotes)
router.route("/:blogId").patch(updateBlog).delete(deleteBlog).get(getSingleBlog)

export default router