const express = require( `express` );
const userRouter = require( "./routers/user" );
const tweetRouter = require( "./routers/tweets" );
const mongooserequiring = require( `./db/mongoose` );

const app = express();
const port = process.env.PORT || 3000;

app.use( express.json() );
app.use( userRouter );
app.use( tweetRouter );

app.get( "/", async ( req, res ) => {
    res.send( 'hello world' );
} );

app.listen( port, () => {
    console.log( "Server is up at " + port );
} );
