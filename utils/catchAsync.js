module.exports=func=>{
    return(req,res,next)=>{
        func(req,res,res).catch(next);
    }
}