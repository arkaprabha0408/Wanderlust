class ExpressError extends Error{
    constructor(status,message){ 
        super();  //to access the properties of parent class
        this.status=status;
        this.message=message;
    }
}

module.exports=ExpressError;