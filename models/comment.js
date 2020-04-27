const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	text: String,
	author: {
// 		Lock Username to ID
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("CommentCollection", commentSchema);