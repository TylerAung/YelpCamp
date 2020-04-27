const 	express = require("express"),
	  	router = express.Router(),
		passport 				= require("passport"),
	  	User					= require("../models/user");
//===========
// Root Route
//===========
router.get("/", function(req, res){
		res.render("landing");
	});

//===========
// AUTH ROUTE
//===========

//====================
// Register form route
//====================
	router.get("/register", function(req, res){
		res.render("register");
	});
//======================
// Sign up logic handler
//======================

	router.post("/register", function(req, res){
	// 	newUser = store value from input into obj db collection
		const newUser = new User({username: req.body.username});
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash("error", err.message); //flash registration error msg
				//console.log(err);
				return res.redirect("register");
			}
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Congrats on the registration " + user.username);
				res.redirect("/campgrounds")
			});

		});
	});
//================
// Show Login form
//================

	router.get("/login", function(req, res){
		res.render("login");
	});
//=========================================
// Handles login logic & perform logging in
//=========================================

//start of middleware = passport.authenticate & ends on "/login" })
	router.post("/login",function(req,res,next){

		passport.authenticate("local", {
		successRedirect:"/campgrounds",
		// 	Flash msg for successful login
		successFlash: "Welcome back "+ req.body.username + "!", //handles successful login
		failureRedirect:"/login",
		failureFlash: "Your username/password is incorrect, Please Try again" //displays unsuccessful login
	})(req, res);
		//res.render("login")
	});
//=============
// Logout Route
//=============
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully Lougout");
	res.redirect("/campgrounds")
});

module.exports = router;