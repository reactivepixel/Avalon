angular.module('templates-app', ['app/footer.tpl.html', 'app/header.tpl.html']);

angular.module("app/footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/footer.tpl.html",
    "<p>Avalon &copy; 2013. All Rights Reserved</p>");
}]);

angular.module("app/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/header.tpl.html",
    "<h1><a href=\"#\">Avalon</a></h1>\n" +
    "\n" +
    "<ul>\n" +
    "	<li><a href=\"#\">Sign Up</a></li>\n" +
    "	<li><a href=\"#\">Log In</a></li>\n" +
    "</ul>");
}]);
