const router = require('express').Router();
const userService = require('../service/user')

const { isGuest, isUser } = require('../service/guards')

router.patch('/bookmark/:id', isUser(), async (req, res) => {
    try {
        await userService.addToBookmarks(req.params.id, req.user._id)
        res.status(200).json({ "message": "successfully added to Bookmarks" })
    } catch (error) {
        res.status(401).json({ "error-message": error.msg })
        console.log(error)
    }
})
router.delete('/bookmark/:id', isUser(), async (req, res) => {
    try {
        await userService.removeFromBookmarks(req.params.id, req.user._id)
        res.status(200).json({ "message": "successfully removed from Bookmarks" })
    } catch (error) {
        res.status(401).json({ "error-message": error.msg })
        console.log(error)
    }
})
router.get('/bookmarked',isUser(),  async (req, res) => {
    try {
        const bookmarks = await userService.getBookmarks(req.user._id);
        
        bookmarks.forEach(x => {
            x.author = x.author.username;

            x.createdAt = x.createdAt.toISOString().split('T')[0];

            x.readTime = Math.ceil(x.description.split(' ').length / 200)

        })
        
        res.status(200).json(bookmarks)
    } catch (error) {
        res.status(400).json({ "error-message": error.message })
        console.log(error)
    }
})
module.exports = router;