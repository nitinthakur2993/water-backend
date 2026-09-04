class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.errors = this.errors
        this.success = false;

        if(stack) {
            this.stack = statck
        } else{
            Error.captureStackTrace(this, this.
                constructor
            )
        }
    }
}
//this.data file read krni hai..

export {ApiError}