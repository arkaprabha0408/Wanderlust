module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);  //next() gets called for the error
    };
}