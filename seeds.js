const mongoose = require("mongoose");
var CampMeth = require("./models/campground.js");
const CommentModel = require ("./models/comment");

var TempData =	[
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
	// Remove All Campgrounds
	CampMeth.remove({}, function(err){
		if(err){
			console.log(err);
		} console.log("Campgrounds Removed");
		
		// 	Add a few Campgrounds
	TempData.forEach(function(seed){
		// console.log("This is seed from TempData = " + seed); //Seed is object, object
		CampMeth.create(seed, function(err, cgData){
				// console.log("Seed = " + seed + " & TempData = " + TempData); //TempData = Entries in object
			if(err) {
				console.log(err);
			} else {
				console.log("Temp Data Added");
				// 	Add a few commentss, same comments on every post
				CommentModel.create(
					{
						text: "Place is amazing, but would be better if there were internet access",
						author: "Talker 1"
						
					}, function(err, commentData){
						if(err){
							console.log(err);
						} else {
						cgData.comments.push(commentData); //comments here links to?
						cgData.save();
							console.log("Comments Created")
							}
					});
			}
			
		});
	});
	});
}

module.exports = seedDB;