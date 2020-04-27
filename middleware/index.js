const 	CampMeth 		= require("../models/campground"),
		CommentModel 	= require("../models/comment");

// All of middleware conents
const middlewareObj ={};

middlewareObj.checkEntryOwnership = function(req, res, next) {
	// 	is User logged Bring?
	if(req.isAuthenticated()){
		CampMeth.findById(req.params.id, function(err, EditIDdata){
		if (err){
			res.redirect("back")
		} else {
			// 	Does user own the campground
			console.log("Current ID= " + req.user._id);//Detects Current Logged User ID, ID is string
			console.log("Authorized Id = " + EditIDdata.author.id);//Displays Owner User ID of Page in DB, ID is Mongoose object, so not able to compare side by side
			
			//use Mongoose Method to compare
				if(EditIDdata.author.id.equals(req.user._id)){//verifying ownership				
					next();
					} else {
						req.flash("error", "You don't have prermission to do that");
// 					Not authorize, then back
					res.redirect("back");
				}
		}
	});
	} else {
		req.flash("error", "You need to be logged in to do that!!!");
		res.redirect("back");
	}
	
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	
	// 	is User logged in?
	if(req.isAuthenticated()){
		CommentModel.findById(req.params.comment_id, function(err, CommentUser){
		if (err){
			req.flash("error", "Entry not found");
			res.redirect("back")
		} else {
			// 	Does user own the comment
			console.log("Current ID= " + req.user._id);//Detects Current Logged User ID, ID is string
			console.log("Authorized Comment Id = " + CommentUser.author.id);//Displays Owner User ID of Page in DB, ID is Mongoose object, so not able to compare side by side
			
			//use Mongoose Method to compare
				if(CommentUser.author.id.equals(req.user._id)){//verifying ownership				
					next();
					} else {
						req.flash("error", "You don't have prermission to do that");
// 					Not authorize, then back
					res.redirect("back");
				}
		}
	});
	} else {
		req.flash("error", "You need to be logged in to do that!!!");
		res.redirect("back");
	}
	
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!!!"); //Give the capability to access this on next request
	res.redirect("/login");
}

module.exports = middlewareObj