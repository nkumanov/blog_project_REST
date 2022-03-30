
const blogModel = require('../models/Blog');



async function createBlog(blogData) {
    const newBlog = new blogModel(blogData);
    await newBlog.save();
    return newBlog;
}

async function getBlogs() {
    
    const blogs = await blogModel.find({}).populate('author').lean();
    
    return blogs;
}
async function getBlogById(id) {
    return await blogModel.findById(id).populate('author').lean()
}
async function deleteBlog(id) {
    return await blogModel.findByIdAndDelete(id)
}

async function getBlogsByCategory(category) {
    const blogs = await blogModel.find({ category: category }).populate('author').lean();
    return blogs
}


module.exports = {
    createBlog,
    getBlogs,
    deleteBlog,
    getBlogById,
    getBlogsByCategory
}