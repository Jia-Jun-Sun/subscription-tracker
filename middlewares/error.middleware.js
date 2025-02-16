// essentially what this code does, is it intercepts the error and finds out what the error is about
// so we know what went wrong

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err }; // unpacking the err

        error.message = err.message;

        console.error(err); // we pass in the err just so we know what happened


        // then we try to figure out the type of error, such as a Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // another type of error is Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value already entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
    } catch (error) {
        next(error); // if theres' an error, we'll simply send it to the next step, whether it'd be another middleware or somethign else
    }
};


export default errorMiddleware;