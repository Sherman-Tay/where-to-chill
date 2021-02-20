const Bars = require('../models/bars');

module.exports.index = async(req,res)=>{
    const bars = await Bars.find({});
    res.render('bars/index',{bars});
};

module.exports.newForm = (req,res)=>{
    res.render('bars/new')
};

module.exports.create = async(req,res,next)=>{
    // if(!req.body.bars) throw new ExpressError('Invalid Input Data',400);
    const bar = new Bars(req.body.bars);
    bar.images = req.files.map(f=>({url:f.path, filename: f.filename}));
    bar.author = req.user.id;
    await bar.save();
    req.flash('success','This is the flash message for success');
    res.redirect(`/bars/${bar._id}`);
};

module.exports.showBar = async(req,res)=>{
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
};

module.exports.editForm = async(req,res)=>{
    const {id} =req.params;
    const bar = await Bars.findById(id);
    if(!bar){
        req.flash('error', 'Cannot find this bar to edit!');
        return res.redirect('/bars');
    }
    res.render('bars/edit',{bar});
};

module.exports.submitEdit = async(req,res)=>{
    const {id} = req.params;
    const bar = await Bars.findByIdAndUpdate(id,{...req.body.bars});
    const imgs = req.files.map(f=>({url:f.path, filename: f.filename}));
    bar.images.push(...imgs);
    await bar.save();
    req.flash('success','Successfully Updated bars');
    res.redirect(`/bars/${bar._id}`);
};
module.exports.deleteBar = async(req,res)=>{
    const {id} = req.params;
    const bar = await Bars.findByIdAndDelete(id);
    req.flash('success','Deleted!');
    res.redirect('/bars');
};

module.exports.addImageForm = async(req,res)=>{
    const {id} =req.params;
    const bar = await Bars.findById(id);
    if(!bar){
        req.flash('error', 'Cannot find this bar to edit!');
        return res.redirect('/bars');
    }
    res.render('bars/add',{bar});
};

module.exports.submitImage = async(req,res)=>{
    const {id} = req.params;
    const bar = await Bars.findByIdAndUpdate(id,{...req.body.bars});
    const imgs = req.files.map(f=>({url:f.path, filename: f.filename}));
    bar.images.push(...imgs);
    await bar.save();
    req.flash('success','Successfully Uploaded Image');
    res.redirect(`/bars/${bar._id}`);
};