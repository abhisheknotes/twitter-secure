const jwt = require( "jsonwebtoken" );
const User = require( "../models/user" );

const auth = async ( req, res, next ) => {
    try {
        const token = req.header( "Authorization" ).replace( "Bearer ", "" );
        const decoded = jwt.verify( token, "ThisIsSecret" );
        const user = await User.findOne( {
            _id: decoded._id,
            "tokens.token": token,
        } );

        if ( !user ) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch ( e ) {
        res.status( 403 ).send( {
            error: "Please authenticate.",
        } );
    }
};

// const authAdmin = async ( req, res, next ) => {
//     try {
//         const user = await User.findOne( {
//             _id: decoded._id,
//             "tokens.token": token,
//             "user.role": role
//         } );

//         if ( role !== "admin" ) {
//             throw new Error();
//         }

//         req.token = token;
//         req.user = user;
//         next();
//     } catch ( e ) {
//         res.status( 403 ).send( {
//             error: "Please authenticate admin.",
//         } );
//     }


// };

// let varia = { auth, authAdmin };
module.exports = auth;