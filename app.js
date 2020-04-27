// YelpV8 username in author input box
// author becomes object instead of string, thus previous comments username become empty, cuz show.ejs display author.username instead of author string
// YelpV9 Update & Delete Function + Middleware refactoring
// npm install --save connect-flash  for alert msg
const 	express 				= require ("express"),
 		app 					= express(),
		request 				= require("request"),
	  	mongoose 				=require("mongoose"),
	   	bodyParser 				= require("body-parser"),
	  	passport 				= require("passport"),
	  	LocalStrategy 			= require("passport-local"),
	  	User					= require("./models/user"),
	  	passportLocalMongoose 	= require("passport-local-mongoose"),
		CampMeth 				= require("./models/campground"),
		seedDB 					= require("./seeds"),
	  	flash					= require("connect-flash"),
		CommentModel 			= require ("./models/comment");

const 	commentRoutes 		= require("./routes/comments"),
		campgroundRoutes 	= require("./routes/campgrounds"),
	  	methodOverride		= require("method-override"),
	  	indexRoute			= require("./routes/index");

//npm install passport passport-local passport-local-mongoose express-session --save


mongoose.connect("mongodb+srv://TylerMongoDB:Rasengan519@mongodbcluster-nirov.gcp.mongodb.net/test?retryWrites=true&w=majority", { 
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false}).then(() => {
	console.log("DB Connected!");
}).catch(err => {
	console.log("Error" +err.message);
});
// findOneAndUpdate: false, findOneAndDelete: false
app.use(bodyParser.urlencoded({extened: true}));

app.use(require("express-session")({
// 	use to decode & encode a session, encrypted key
	secret: "YelpCamp1992",
	resave: false,
	saveUnitialized: false
}));

app.set("view engine", "ejs");
// __dirname refers to directory when current script run is
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// Middleware that runs for every single template
//res.locals, next(); = move forward to next middleware/ route handler
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
// seedDB();
// CurrentUser must come after the above codes to make session acessible by locals
app.use(function(req, res, next){
	res.locals.CurrentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

// Tells app to use the respective 3 route files
// Shorten route declaration app.use(indexRoute);
// app.use("/campgrounds",campgroundRoutes); ===> use("/campgrounds", adds "/campgrounds" to all the routes used by campgrounds.js in routes directory
app.use(indexRoute);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

	app.listen(process.env.PORT || 3000, process.env.IP, function(){
		console.log("Server is connected");
	});