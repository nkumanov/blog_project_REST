
const router = require('express').Router();
const blogService = require('../service/blogs')
const { isGuest, isUser } = require('../service/guards')
const fs = require('fs')
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, '.uploads/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage: storage})


router.get('/', async (req, res) => {
    try {
        const blogs = await blogService.getBlogs();
        
        blogs.forEach(x => {
            x.author = x.author.username;

            x.createdAt = x.createdAt.toISOString().split('T')[0];

            x.readTime = Math.ceil(x.description.split(' ').length / 200)

        })
        res.status(201).json(blogs)
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ "error-message": error.message })
    }

})
router.get('/category/:category', async (req, res) => {
    
    
    try {
        const blogs = await blogService.getBlogsByCategory(req.params.category);
        
        blogs.forEach(x => {
            x.author = x.author.email;

            x.createdAt = x.createdAt.toISOString().split('T')[0];

            x.readTime = Math.ceil(x.description.split(' ').length / 200)

        })
        res.status(201).json(blogs)
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ "error-message": error.message })
    }

})

router.post('/', upload.single('image'),  async (req, res) => {
    
    console.log(req.file)
    
    const blogData = {
        title: req.body.title,
        subTitle: req.body.subTitle,
        category: req.body.category,
        image: req.body.image,
        description: req.body.description,
        author: req.user._id
    }

    try {
        if (blogData.title.length < 2) {
            throw new Error('The title must be at least 2 characters long!')
        }
        if (blogData.category == undefined) {
            throw new Error('Category is mandatory')
        }
        if (blogData.description.length < 8) {
            throw new Error('The description must be at least 50 characters long!')
        }

        await blogService.createBlog(blogData)
        res.status(200).json({ "message": "successfully created record" })
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ "error-message": error.message })
    }
})

router.get('/:id', async (req, res) => {
    
    try {
        const blog = await blogService.getBlogById(req.params.id);
        
        blog.author = blog.author.username;

        blog.createdAt = blog.createdAt.toISOString().split('T')[0];

        blog.readTime = Math.ceil(blog.description.split(' ').length / 200)

        res.status(200).json(blog)
    } catch (error) {
        console.log(error);
        res.status(400).json({ "error-message": error.message })
    }
})
router.delete('/:id', isUser(), async (req, res) => {
    try {
        await blogService.deleteBlog(req.params.id);
        res.status(200).send('Successfully deleted record!')
    } catch (error) {
        console.log(error);
        res.status(400).json({ "error-message": error.message })
    }
})

module.exports = router;