var http = require("follow-redirects").http;

function fetchSubjects(program, year, part) {
    return new Promise((resolve, reject) => {
        var options = {
            method: "POST",
            path: "api/subjects/?",
            headers: {
                "Content-Type":
                    "multipart/form-data; boundary=--------------------------261278600670840029297667",
            },
            maxRedirects: 20,
        };
        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                var subjectData = body.toString();
                subjectData[0] === "["
                    ? resolve(JSON.parse(subjectData))
                    : reject([]);
                resolve(subjectData);
            });

            res.on("error", function (error) {
                reject(error);
            });
        });

        var postData =
            '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="prog"\r\n\r\n' +
            program +
            '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="year"\r\n\r\n' +
            year +
            '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="part"\r\n\r\n' +
            part +
            "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
        req.setHeader(
            "content-type",
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
        );

        req.write(postData);

        req.end();
    });
}

function fetchStudents(program, batch, group) {
    return new Promise((resolve, reject) => {
        var options = {
            method: "POST",
            path: "api/students/?",
            headers: {
                "Content-Type":
                    "multipart/form-data; boundary=--------------------------261278600670840029297667",
            },
            maxRedirects: 20,
        };
        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                var studentData = body.toString();
                studentData[0] === "["
                    ? resolve(JSON.parse(studentData))
                    : reject([]);
            });

            res.on("error", function (error) {
                reject(error);
            });
        });

        var postData =
            '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="prog"\r\n\r\n' +
            program +
            '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="batch"\r\n\r\n' +
            batch +
            '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="group"\r\n\r\n' +
            group +
            "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
        req.setHeader(
            "content-type",
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
        );

        req.write(postData);

        req.end();
    });
}

exports.fetchStudents = fetchStudents;
exports.fetchSubjects = fetchSubjects;
