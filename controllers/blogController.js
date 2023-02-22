import BlogsModel from "../models/BlogsModel.js";
import { BadRequestError,NotFoundError, UnAuthenticatedError} from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const createBlog=async (req,res)=>{
    let {title,summary,description,image}=req.body

    if(!title || !summary || !description || !image){
        throw new BadRequestError("Please Prvide all the values to proceed")
    }

    req.body.user=req.user.userId

    let Blog=await BlogsModel.create(req.body)

    res.status(StatusCodes.CREATED).json({msg:"success",Blog})
}


export const updateBlog=async (req,res)=>{

    let {blogId}=req.params

    let updateBlog=await BlogsModel.findOne({_id:blogId})

    if(!updateBlog){
        throw new NotFoundError("The Blog with this id is not present")
    }

    let isAuthenticatedUser=await BlogsModel.findOne({user:req.user.userId,_id:blogId})
    if(!isAuthenticatedUser){
        throw new UnAuthenticatedError("Soory this blog is not yours")
    }


    const updatedBlog = await BlogsModel.findByIdAndUpdate(
        blogId,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(StatusCodes.OK).json({msg:"Success",updatedBlog})
}



export const getAllBlogs=async (req,res)=>{
    let Blogs=await BlogsModel.find({}).populate({path:"user",select:"-password"})
    res.status(StatusCodes.OK).json({Blogs})
}

export const deleteBlog=async (req,res)=>{
    let {blogId}=req.params
    let blog=await BlogsModel.findOne({_id:blogId})
    if(!blog){
        throw new BadRequestError("The Blog is not present")
    }

    let authenticatedUser=await BlogsModel.findOne({_id:blogId,user:req.user.userId})

    if(!authenticatedUser){
        throw new UnAuthenticatedError("This is an UnAuthorized Request")
    }

    await blog.remove()

    res.status(StatusCodes.OK).json({msg:"The Blog is deleted Successfullly"})
}

export const getSingleBlog=async (req,res)=>{
  let {blogId}=req.params
  
  let Blog=await BlogsModel.findOne({_id:blogId}).populate({path:"user",select:"-password"})

  if(!Blog){
    throw new BadRequestError("The Blog is not there")
  }

  res.status(StatusCodes.OK).json({Blog})
}

export const updateVotes=async (req,res)=>{
    let {blogId}=req.params

    console.log(blogId)
    let Blog=await BlogsModel.findOne({_id:blogId})

    if(!Blog){
      throw new BadRequestError("The Blog is not there")
    }

    if(!Blog.votes.includes(req.user.userId)){
        await BlogsModel.updateOne({_id:blogId},{$push:{votes:req.user.userId}})
    }
    
    else{
        await BlogsModel.updateOne({_id:blogId},{$pull:{votes:req.user.userId}})
    }

    res.status(StatusCodes.OK).json({msg:"Success"})

}