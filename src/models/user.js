const mongoose = require( "mongoose" );
const validator = require( "validator" );
const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const Tweet = require( "./tweet" );
const Log = require( "./logs" );

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate ( value ) {
            if ( !validator.isEmail( value ) ) {
                throw new Error( "Email is invalid" );
            }
        },
    },

    role: {
        type: String,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
        validate ( value ) {
            if ( value.length < 6 ) {
                throw new Error( "Password should be more than 6 characters!" );
            } else if ( value.toLowerCase() == "password" ) {
                throw new Error( "Password cannot be password, come on!" );
            }
        },
    },

    updates: {
        default: false,
        type: Boolean
    },

    tokens: [ {
        token: {
            type: String,
            required: true,
        },
    }, ],

}, {
    timestamps: true,
} );

userSchema.virtual( "tweets", {
    ref: "Tweet",
    localField: "_id",
    foreignField: "owner",
} );

userSchema.statics.findByCredentials = async ( email, password ) => {
    const user = await User.findOne( { email } );
    if ( !user ) {
        throw new Error( "Unable to login, please check your details." );
    }
    const isMatch = await bcrypt.compare( password, user.password );
    if ( !isMatch ) {
        throw new Error( "Unable to login, please recheck your details." );
    }
    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign( { _id: user._id.toString() }, "ThisIsSecret" );
    user.tokens = user.tokens.concat( { token } );
    await user.save();
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// Hashing the password before saving

userSchema.pre( "save", async function ( next ) {
    const user = this;
    if ( user.isModified( "password" ) ) {
        user.password = await bcrypt.hash( user.password, 8 );
    }
    next();
} );

// logging sign up

userSchema.post( "save", async function ( next ) {
    const user = this;
    const log = new Log( { "log": "action", "activity": "user-signup", "owner": user._id } );
    await log.save();
    next();
} );

// Remove all tweets of a user, if user is deleted

userSchema.pre( "remove", async function ( next ) {
    const user = this;
    await Tweet.deleteMany( { owner: user._id } );
    next();
} );

const User = mongoose.model( "User", userSchema );

module.exports = User;