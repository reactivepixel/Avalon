angular.module('html-templates', ['footer.tpl.html', 'header.tpl.html', 'validation/login.tpl.html', 'validation/signup.tpl.html']);

angular.module("footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("footer.tpl.html",
    "<p>Avalon &copy; 2013. All Rights Reserved</p>");
}]);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<h1><a href=\"index.html\">Avalon</a></h1>\n" +
    "\n" +
    "<form action=\"#\" method=\"GET\">\n" +
    "	<input type=\"text\" name=\"search\" id=\"search\" placeholder=\"Search\" />\n" +
    "	<button type=\"submit\">Search</button>\n" +
    "</form>\n" +
    "\n" +
    "<div>\n" +
    "	<ul>\n" +
    "		<li><a href=\"signup\">Sign Up</a></li>\n" +
    "		<li><a href=\"login\">Log In</a></li>\n" +
    "	</ul>\n" +
    "</div>\n" +
    "\n" +
    "<nav>\n" +
    "	<ul>\n" +
    "		<li><a href=\"#\">Artists</a></li>\n" +
    "		<li><a href=\"#\">Tracks</a></li>\n" +
    "		<li><a href=\"#\">Videos</a></li>\n" +
    "		<li><a href=\"#\">Events</a></li>\n" +
    "		<li><a href=\"#\">Charts</a></li>\n" +
    "		<li><a href=\"#\">Podcasts</a></li>\n" +
    "	</ul>\n" +
    "</nav>");
}]);

angular.module("validation/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/login.tpl.html",
    "<h2>Log with one of these services&#58;</h2>\n" +
    "\n" +
    "<ul>\n" +
    "	<li><a href=\"#\">Soundcloud</a></li>\n" +
    "	<li><a href=\"#\">Facebook</a></li>\n" +
    "</ul>\n" +
    "\n" +
    "<form action=\"#\" method=\"POST\">\n" +
    "	<fieldset>\n" +
    "		<legend>Type in your user info&#58;</legend>\n" +
    "		<label for=\"username\">Username</label><input type=\"text\" name=\"username\" id=\"username\" placeholder=\"username or email\" />\n" +
    "		<label for=\"password\">Password</label><input type=\"password\" name=\"password\" id=\"password\" />\n" +
    "	</fieldset>\n" +
    "</form>");
}]);

angular.module("validation/signup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/signup.tpl.html",
    "<h2>Sign up to Avalon&#58;</h2>\n" +
    "\n" +
    "<form action=\"#\" method=\"POST\">\n" +
    "	<fieldset>\n" +
    "		<legend>Personal Info</legend>\n" +
    "		<label for=\"firstName\">First Name</label><input type=\"text\" name=\"firstName\" id=\"firstName\" placeholder=\"John\" autofocus />\n" +
    "		<label for=\"lastName\">Last Name</label><input type=\"text\" name=\"lastName\" id=\"lastName\" placeholder=\"Doe\" />\n" +
    "		<label for=\"email\">Email</label><input type=\"email\" name=\"email\" id=\"email\" placeholder=\"johndoe@service.com\" />\n" +
    "		<label for=\"username\">Username</label><input type=\"text\" name=\"username\" id=\"username\" placeholder=\"johndoe365\" />\n" +
    "		<label for=\"password\">Password</label><input type=\"password\" name=\"password\" id=\"password\" />\n" +
    "		<label for=\"confirmPassword\">Confirm Password</label><input type=\"password\" name=\"confirmPassword\" id=\"confirmPassword\" />\n" +
    "	</fieldset>\n" +
    "	\n" +
    "	<fieldset>\n" +
    "		<legend>Service &amp; Privacy Agreement</legend>\n" +
    "		<p>I agree with the <a href=\"#\">Terms of Service</a> &amp; <a href=\"#\">Privacy Policies</a>.</p>\n" +
    "		<div>\n" +
    "			<input type=\"radio\" name=\"termAgreement\" value=\"Yes\" /><label>Yes</label>\n" +
    "			<input type=\"radio\" name=\"termAgreement\" value=\"No\" checked=\"checked\" /><label>No</label>\n" +
    "		</div>\n" +
    "	</fieldset>\n" +
    "	\n" +
    "	<div>\n" +
    "		<a href=\"#\" title=\"Return to Home Page\">cancel</a>\n" +
    "	</div>\n" +
    "	<button type=\"submit\">Submit</button>\n" +
    "</form>");
}]);
