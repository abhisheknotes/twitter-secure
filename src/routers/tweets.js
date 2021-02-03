const express = require( "express" );
const router = new express.Router();
const Tweet = require( "../models/tweet" );
const auth = require( "../middleware/auth" );

// creating a tweet

router.post( "/tweets", auth, async ( req, res ) => {
    const tweet = new Tweet( {
        ...req.body,
        owner: req.user._id,
    } );
    try {
        await tweet.save();
        res.status( 200 ).send( "Tweet saved: " + tweet );
    } catch ( e ) {
        res.status( 400 ).send( e );
    }
} );

// Get user (personal) tweets 
router.get( "/tweets", auth, async ( req, res ) => {
    try {
        // const tasks = await Task.find({ owner: req.user._id });
        await req.user.populate( "tweets" ).execPopulate();
        res.send( req.user.tweets );
    } catch ( e ) {
        res.status( 500 ).send();
    }
} );



// delete a tweet by id

router.delete( "/tasks/:id", auth, async ( req, res ) => {
    try {
        const task = await Task.findOneAndDelete( {
            _id: req.params.id,
            owner: req.user._id,
        } );

        if ( !task ) {
            res.status404.send( { error: "Task id not found" } );
        }

        res.send( task );
    } catch ( e ) {
        res.status( 500 ).send( { e: "Catch Error", e } );
    }
} );

module.exports = router;