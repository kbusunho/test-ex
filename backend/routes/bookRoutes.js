const router = require("express").Router();
const Books = require("../models/Book");



router.post("/", async (req, res) => {
    try {
        const newBook = new Books(req.body)
        const saved = await newBook.save()
        res.status(201).json(saved)
    } catch (error) {
        res.status(400).json({ message: '작성실패', error })
    }
})
router.get("/", async (req, res) => {
    try {
        const books = await Books.find().sort({createdAt:-1})
        res.status(201).json(books)
    } catch (error) {
        res.status(400).json({ message: '불러오기 실패', error })
    }
})
router.get("/:id", async (req, res) => {
    try {

        const book = await Books.findById(req.params.id)
        if (!book) return res.status(404).json({ message: '수정할 책 없음' })
        res.status(201).json(book)
    } catch (error) {
        res.status(400).json({ message: '1개 불러오기 실패', error })
    }
})

router.put("/:id", async (req, res) => {
    try {

        const updated = await Books.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        )
        if (!updated) return res.status(404).json({ message: '수정할 글 없음' })
        res.status(201).json(updated)
    } catch (error) {
        res.status(400).json({ message: '1개 불러오기 실패', error })
    }
})
router.delete("/:id", async (req, res) => {
    try {

        const deleted = await Books.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ message: '삭제할 책 없음' })
        res.status(201).json({message:"삭제 할 책",book: deleted})
    } catch (error) {
        res.status(400).json({ message: '1개 불러오기 실패', error })
    }
})
module.exports = router;