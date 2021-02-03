const mongoose = require( "mongoose" );

const logSchema = new mongoose.Schema( {
    log: {
        type: String,
        required: true,
        trim: true,
    },

    activity: {
        type: String,
        //required: true,
        trim: true,
        lowercase: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "User",
    },
}, {
    timestamps: true,
} );

const Log = mongoose.model( "Log", logSchema );
module.exports = Log;