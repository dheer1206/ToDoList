const express = require('express') ;
const app = express() ;
const fs = require('fs') ;

const bodyParser = require( 'body-parser' ) ;

app.use( express.static('public') ) ;
app.use( bodyParser.urlencoded( {extended : true} ) ) ;

app.get( "/" , function( req , res ) {

    res.render( "index.html" ) ;

} ) ;

app.get( "/getdata" , function (req, res) {

    fs.readFile('./data.json', 'utf-8', function( err , data ) {
		if (err) throw err
    
        res.send( { name : data } )

        // Ask..
       // res.redirect("/") ;
	})

} ) ;

app.post( "/postdata" , function (req, res) {

    let data = req.body.name ;

    fs.writeFile('./data.json', data , 'utf-8', function(err) {
		if (err) throw err
		//console.log('Done!')
	})

    // if you want to open url , then only use redirect 
    //res.redirect("/") ;

} ) ;

let port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost'

app.listen( port , ip , function( ) {
    console.log( "Server Started" ) ;
} ) ;