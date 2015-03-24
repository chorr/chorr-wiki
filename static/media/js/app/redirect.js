define(["jquery"], function ($) {
    "use strict";

    var MAP = {
        "키보드_타입_변경": "/tip/windows"
    };

    return function () {
        var url = decodeURIComponent(location.href);
        $.each(MAP, function (k, v) {
            if (url.indexOf(k) >= 0) {
                location.replace(v);
                return false;
            }
        });
    };
});