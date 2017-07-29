var xhr = {
    get: function (path, callback) {
        this.send("GET", path, {}, callback);
    },
    put: function (path, body, callback) {
        this.send(
            "PUT",
            path,
            { contentType: "application/json", body: JSON.stringify(body) },
            callback
        );
    },
    send: function (method, path, options, callback) {
        var req = new XMLHttpRequest();

        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    var result = JSON.parse(req.responseText);

                    callback(null, result);
                }
                else {
                    callback({
                        status: req.status,
                        message: req.responseText
                    });
                }
            }
        };

        req.open(method, path);

        if ("contentType" in options) {
            req.setRequestHeader("Content-Type", options.contentType);
        }

        req.send(options.body);
    }
};
