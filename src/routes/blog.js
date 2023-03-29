const router = require('express').Router();
const Blog = require('../models/Blog')

// Your routing code goes here


router.get("/blog", pagination(Blog), (req, res) => {
    res.json(res.paginationResult)
})

router.post("/blog",async (req,res)=>{
    try{
        const blog=await Blog.create(req.body)
        console.log(blog)
        res.json({
            status:"success",
            result:blog
        })
    }
    catch(err){
        res.json({error:err.message})
    }
})

router.put("/blog/:id",async (req,res)=>{
    try{
        const {id} =req.params
        const blog= await Blog.findByIdAndUpdate(id,{topic:"nodejs"},{new:true})
        res.json({
            status:"success",
            result:blog
        })
    }
    catch(err){
        res.json({error:err.message})
    }
})

router.delete("/blog/:id",async (req,res)=>{
    try{
        const {id} = req.params
        const blog =await Blog.findByIdAndDelete(id)
        res.json({
            status:"success",
            result:blog
        })
    }
    catch(err){
        res.json({error:err.message})
    }
})


function pagination(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const topic = req.query.search
        const recordsFrom = (page - 1) * 5;
        // const recordsTo = page * 5;
        let result = {}
        try {
            result.result = await Blog.find({ "topic": topic }).skip(recordsFrom).limit(5)
            if (result.result.length === 0) {
                // res.paginationResult =  res.status(500).json({status:"Failed"})
                res.paginationResult = res.status(400).json({ status: "Failed", message: "We cannot found your query" })
                next()
            }
            res.paginationResult = { status: "success", result }
            next()
        } 
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}



module.exports = router;