const express = require('express');
const router = express.Router();
const catchAsync =require('../helpers/catchAsync');
const ExpressError =require('../helpers/ExpressError');
const Bars = require('../models/bars');
const methodOverride = require('method-override');
const {isLoggedIn, isOwner} = require('../middleware');

//Create
router.get('/new', isLoggedIn, (req,res)=>{
    
    res.render('bars/new')
})

router.post('/', isLoggedIn,catchAsync( async(req,res)=>{
    // if(!req.body.bars) throw new ExpressError('Invalid Input Data',400);
   
    const bar = new Bars(req.body.bars);
    bar.author = req.user.id;
    await bar.save();
    req.flash('success','This is the flash message for success');
    res.redirect(`/bars/${bar._id}`);
}))

//Request
router.get('/',catchAsync(async(req,res)=>{
    const bars = await Bars.find({});
    res.render('bars/index',{bars});
}))

router.get('/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const bar = await Bars.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    console.log(bar)
    if(!bar){
        req.flash('error', 'Cannot find this bar');
        return res.redirect('/bars');
    }
    res.render('bars/show',{bar});
}))
//Update
router.get('/:id/edit', isLoggedIn, isOwner,    catchAsync(async(req,res)=>{
    const {id} =req.params;
    const bar = await Bars.findById(id);
    if(!bar){
        req.flash('error', 'Cannot find this bar to edit!');
        return res.redirect('/bars');
    }
    res.render('bars/edit',{bar});
}))

router.put('/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    const bar = await Bars.findByIdAndUpdate(id,{...req.body.bars});
    req.flash('success','Successfully Updated bars');
    res.redirect(`/bars/${bar._id}`);
}))

//Delete
router.delete('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const bar = await Bars.findByIdAndDelete(id);
    req.flash('success','Deleted!');
    res.redirect('/bars');
}))

module.exports = router;