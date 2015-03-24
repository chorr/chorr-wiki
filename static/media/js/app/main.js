require.config({
    baseUrl: "/media/js",
    paths: {
        "jquery": "jquery.min"
    }
});

require(["app/redirect"], function (redirect) {
    "use strict";
    redirect();
});