var express = require("express");
var bodyParser = require("body-parser");
var override = require("method-override");
var bodyParser = require("body-parser");
var mrHandle = require("express-handlebars");
var routes = require("./controller/decide.js")
var passport = require("passport");
var FacebookStrategy = require("passport-facebook");
var session = require('express-session');



// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3306;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
// require("./routes/html-routes.js")(app);
// require("./routes/author-api-routes.js")(app);
require("./routes/post-routes.js")(app);

app.engine("handlebars", mrHandle({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use("/",routes)

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

// facebook authentication
// =========================================================================

app.use(session({
  secret: "dev",
  resave: true,
  saveUninitialized: true
}));


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/localhost:8080"));
});

  var FACEBOOK_APP_ID = '829157353919820',
      FACEBOOK_APP_SECRET = 'ae52e4194c977e7550c0cd5279070698';

    var facebookOp = {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:8080/auth/facebook/callback',
      profileFields: ['emails']
    };

    var facebookCallback = function(accessToken, refreshToken, profile, cb){
      console.log(accessToken, refreshToken, profile);
    };

    passport.use(new FacebookStrategy(facebookOp, facebookCallback));


  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'emails' }));



  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

// =============================================================================
