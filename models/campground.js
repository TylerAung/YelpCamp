const mongoose = require("mongoose");
// Creating skeleton for database
const campSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	desc: String,
// 	Create skeletal for author object to connect with user
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
		
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "CommentCollection"
		}
	]
	// desc: String
});

//CampMeth = method to call in function, Campground = Collection name in DB
	module.exports = mongoose.model("Campground", campSchema);