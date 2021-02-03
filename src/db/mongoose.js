const mongoose = require( "mongoose" );
mongoose.connect( process.env.MONGOBD_URL || 'mongodb://127.0.0.1:27017/oslash-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
} );