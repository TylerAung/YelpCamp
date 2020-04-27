const express 		= require("express"),
	  router 		= express.Router({mergeParams: true}),
	  passport 		= require("passport"),
	  CampMeth 		= require("../models/campground"),
	  middleware	= require("../middleware"),
	  User			= require("../models/user");

// 	router. campgrounds - Retrieve Info
// 	app.use(""campgroundRoutes); shorten router.get("/campgrounds",
//	router.get("/",
	router.get("/", function(req, res){
// 		req.user returns username of login user
		//console.log("Req.User = " + req.user);
	// 	Get all campgrounds from DB
		CampMeth.find({}, function(err,DBCampData){
			if(err){
				console.log(err)
		} else {
			//res.render("campgrounds/index", {campgrounds:DBCampData, CurrentUser: req.user}); allows user session to be read
			res.render("campgrounds/index", {campgrounds:DBCampData});
			// res.render("campgrounds", {campgrounds:campgrounds});
		}
		})
	});

// change all app.get or app.post to router.get router.post

// Display forms to send data to campground get page
	router.get("/new",middleware.isLoggedIn, function(req, res){
		res.render("campgrounds/new");
		// res.render("new", {campgrounds:campgrounds});
	});

// router.post Campground - Upload Info
	router.post("/",middleware.isLoggedIn, function(req, res){
// 		Collects data from form
		var cgname = req.body.name;
		var cgprice = req.body.price;
		var cgimg = req.body.image;
		var cgdesc = req.body.desc;
// 		link variable to user information
		var authorVar = {
			id: req.user._id,
			username: req.user.username
		}
// 		insert all variable data into newCG
		var newCG = {name: cgname, image: cgimg, desc: cgdesc, author: authorVar, price: cgprice}
		
// 		Add Data from input form to Yelp_Camp DB
		CampMeth.create(newCG, function(err, inputData){
			if(err){
				console.log(err);
			} else {
				res.redirect("/campgrounds")
			}
		})
		
	});

// Page to show more info on click
router.get("/:id", function(req, res){
// 	).populate("comments").exec(
	//finding a campground by id, then populating the comments of the campground, execute that query of findById & comments population, then on coming back. It will be added into CampId
	CampMeth.findById(req.params.id).populate("comments").exec(function(err, CampId){

					 if(err){
						 console.log(err)
					 } 
					//console.log(CampId)//display entry infomation
					res.render("campgrounds/show", {campgrounds: CampId})
					  })
	// req.params.id
	// res.send("SHOW PAGE")
});

// ================================
// EDIT ROUTE - Bring up edit form
// ================================
router.get("/:id/edit",middleware.checkEntryOwnership, function(req, res){
// 	With middleware called earlier, is authenticated & verfied before form is displayed
		CampMeth.findById(req.params.id, function(err, EditIDdata){
			res.render("campgrounds/edit", {campgrounds: 	EditIDdata});
	});
	
// 	Update without authorization
// 	If not, redirect
	
	// CampMeth.findById(req.params.id, function(err, EditIDdata){
	// 	if (err){
	// 		res.redirect("/campgrounds")
	// 	} else {
	// 		res.render("campgrounds/edit", {campgrounds: EditIDdata});
	// 	}
	// });
});
// ===========================================
// UPDATE ROUTE - Submit edit form value to DB
// ===========================================
router.put("/:id",middleware.checkEntryOwnership, function(req, res){
	req.flash("success", "Successfully Updated Entry");
// 	find & update the correct campground
	CampMeth.findByIdAndUpdate(req.params.id, req.body.EditPg, function(err, UpdatedCamp){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
// 	redirect to updated page
});

// ================================
// Destroy ROUTE 
// ================================
router.delete("/:id",middleware.checkEntryOwnership, function(req, res){
	CampMeth.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Entry Deleted");
			res.redirect("/campgrounds");
		}
	});
});


// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkEntryOwnership(req, res, next) {
	
// 	// 	is User logged Bring?
// 	if(req.isAuthenticated()){
// 		CampMeth.findById(req.params.id, function(err, EditIDdata){
// 		if (err){
// 			res.redirect("back")
// 		} else {
// 			// 	Does user own the campground
// 			console.log("Current ID= " + req.user._id);//Detects Current Logged User ID, ID is string
// 			console.log("Authorized Id = " + EditIDdata.author.id);//Displays Owner User ID of Page in DB, ID is Mongoose object, so not able to compare side by side
			
// 			//use Mongoose Method to compare
// 				if(EditIDdata.author.id.equals(req.user._id)){//verifying ownership				
// 					next();
// 					} else {
// // 					Not authorize, then back
// 					res.redirect("back");
// 				}
// 		}
// 	});
// 	} else {
// 		res.redirect("back");
// 	}
	
// }

module.exports = router;