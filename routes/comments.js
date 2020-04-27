const 	express 		= require("express"),
	  	router 			= express.Router({mergeParams: true}),
	  	passport 		= require("passport"),
	  	CampMeth 		= require("../models/campground"),
		CommentModel 	= require("../models/comment"),
	  	middleware		= require("../middleware"),//index.js is a special that's set to default in express, if file is not index.js, it will need to be require specifically!!!
		User			= require("../models/user");

//	 express.Router({mergeParams: true}) =====> Because req.params is not passed over from campgrounds. So with merge : true. It makes /:id accessible in comments.js
// ==============================
// Comments Routes
// Nested routes to help comments show up in url  as post/:id/comments or + /new
// New Route
// isLoggedIn makes login required for leaving review/comment
	router.get("/new",middleware.isLoggedIn, function(req, res){
// 	find campground by id
		CampMeth.findById(req.params.id, function(err, campDb){
			if(err){
				console.log(err);
			} else{
				res.render("comments/new", {campgrounds : campDb});
			}
		})
		
	});
// Comments Create Route
	router.post("/",middleware.isLoggedIn, function(req, res){
	// 	Lookup campground using ID
		CampMeth.findById(req.params.id, function(err, campID){
			if(err) {
				req.flash("error", "Something went wrong");
				console.log(err)
				res.redirect("/campgrounds")
			} else {
				// console.log("CampDB " + campID);
				//console.log("Body Commment " + req.body.comment); //Prints data collected in comment form
				// 	Create New Comments 
				CommentModel.create(req.body.comment, function(err, commentData){
					 //console.log("CommentData " +commentData);
					 if (err){
						 console.log(err);
					 } else {
// 						 Add username and ID to comment & save comment
// 						commentData is function argument as above, author.id comes from Comments DB Schema
						 commentData.author.id = req.user._id;
						 commentData.author.username = req.user.username;
// 						 save comment
						 commentData.save();
						 // 	Connect new comments to campgrounds
						 campID.comments.push(commentData);
						 campID.save();
						 req.flash("success", "Comment added to Entry");
						 // 	redirect to campground show page
						 res.redirect("/campgrounds/" + campID._id);
					 }
				 })
			}
		});
	});



// =================================================
// Edit Route
// =================================================
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
// 	tricky = comment_id???
		CommentModel.findById(req.params.comment_id, function(err, CommentEdit){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: CommentEdit});
		}
	})

})

// =================================================
// Update Route
// =================================================
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res) {
	CommentModel.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComments){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Successfully Updated Comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// =================================================
// Delete Route
// =================================================
// router.delete("/:comment_id",checkCommentOwnership, function(req, res){ // Without requiring middleware
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
// 	Find by ID & Remove
	CommentModel.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})
// Middleware
// Without requiring middleware
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next) {
	
// 	// 	is User logged in?
// 	if(req.isAuthenticated()){
// 		CommentModel.findById(req.params.comment_id, function(err, CommentUser){
// 		if (err){
// 			res.redirect("back")
// 		} else {
// 			// 	Does user own the comment
// 			console.log("Current ID= " + req.user._id);//Detects Current Logged User ID, ID is string
// 			console.log("Authorized Comment Id = " + CommentUser.author.id);//Displays Owner User ID of Page in DB, ID is Mongoose object, so not able to compare side by side
			
// 			//use Mongoose Method to compare
// 				if(CommentUser.author.id.equals(req.user._id)){//verifying ownership				
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