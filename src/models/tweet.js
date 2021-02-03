const mongoose = require( "mongoose" );

const tweetSchema = new mongoose.Schema( {
    Tweet: {
        type: String,
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
} );

const Tweet = mongoose.model( "Tweet", tweetSchema );

module.exports = Tweet;