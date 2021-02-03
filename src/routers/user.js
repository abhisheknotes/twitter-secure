const express = require( "express" );
const router = new express.Router();
const User = require( "../models/user" );
const auth = require( "../middleware/auth" );
const authAdmin = require( "../middleware/adminAuth" );
const Log = require( "../models/logs" );


// Create new user
router.post( "/users", async ( req, res ) => {
    const user = new User( req.body );
    const log = new Log();

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status( 200 ).send( { user, token } );
    } catch ( e ) {
        res.status( 400 ).send( e );
    }
} );

// Login user

router.post( "/users/login", async ( req, res ) => {
    try {
        const log = new Log( { "log": "access", "activity": "user-login" } );
        await log.save();
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send( {
            user,
            token,
        } );
    } catch ( e ) {
        res.status( 400 ).send( {
            error: "Catch error",
            e,
        } );
    }
} );

// User Logout
router.post( "/users/logout", auth, async ( req, res ) => {
    try {
        req.user.tokens = req.user.tokens.filter( ( token ) => {
            return token.token !== req.token;
        } );
        await req.user.save();
        res.status( 200 ).send();
    } catch ( e ) {
        res.status( 500 ).send();
    }
} );

// User Logout from all devices
router.post( "/users/logoutAll", auth, async ( req, res ) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status( 200 ).send();
    } catch ( e ) {
        res.status( 500 ).send();
    }
} );

router.get( "/logs/access", async ( req, res ) => {
    let logs = await Log.find( {} );
    res.send( logs );
} );


// Delete User

router.delete( "/users/me", auth, async ( req, res ) => {
    try {
        await req.user.remove();
        res.send( req.user );
    } catch ( e ) {
        res.status( 500 ).send( { e: "Catch Error", e } );
    }
} );

module.exports = router;