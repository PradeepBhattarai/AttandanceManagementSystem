const db = require("./database");
const express = require("express");
const bcrypt = require("bcryptjs");
const http = require("follow-redirects").http;
const router = express.Router();
let { isAdmin } = require("../../configurations/admincheck");

router.post("/add-user",isAdmin,  async function (req, res, next) {
    let salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(req.body.password, salt);

    let sql = `INSERT IGNORE INTO instructor (name, password, code, department_id) values ("${req.body.username}","${pass}","${req.body.code}", "${req.body.dept}")`;
    try {

        await db.query(sql);
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
    console.log("user saved");

});


function performRequest(options, data, success) {
    let dataString = data;
    let responseData = [];
    let req = http.request(options, function (res) {
        res.on("data", function (data) {
            responseData.push(data);
        });

        res.on("end", function () {
            ret_val = success(responseData);
        });
    });
    req.setHeader(
        "content-type",
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    );
    req.write(dataString);
    req.end();

}

function addClass(program, batch, group) {
    let classQuery =
        "INSERT IGNORE INTO class(batch, program_id, class_group) VALUES (?, ?, ?)";
    let studentQuery =
        "INSERT IGNORE INTO student(roll_no,name,class_id) VALUES ?";

    let options = {
        method: "POST",
        hostname: "assmnt.pcampus.edu.np",
        path: "/api/students/",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        maxRedirects: 20,
    };

    performRequest(
        options,
        '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="prog"\r\n\r\n' +
        program +
        '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="batch"\r\n\r\n' +
        batch +
        '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="group"\r\n\r\n' +
        group +
        "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--",
        async function (data) {
            let classID;
            try {


                let result = await db.query(classQuery, [
                    batch,
                    program,
                    group,
                ]);
                classID = result.insertId;
                let body = Buffer.concat(data);
                studentList = JSON.parse(body.toString());
                for (let i = 0; i < studentList.length; i++) {
                    studentList[i][0] = studentList[i][2];
                    studentList[i].splice(1, 2);
                    studentList[i].push(classID);
                }
                blas = await db.query(studentQuery, [studentList]);
                console.log("Class stored");


            } catch (err) {

                console.log(err);
            }
        }
    );

}

router.post("/add-class", isAdmin,  (req, res) => {
    program = req.body.program.toString();
    batch = req.body.batch.toString();
    section = req.body.section.toString();

    addClass(program, batch, section.charAt(0));
    addClass(program, batch, section.charAt(1));


    res.status(200).send("ok")
});

router.post("/add-sub", isAdmin,  (req, res) => {
    program = req.body.program.toString();
    year = parseInt(req.body.year);
    part = parseInt(req.body.part);
    let subjectQuery =
        "INSERT IGNORE INTO subject(code, name) VALUES ?";
    let subDetailsQuery = "INSERT IGNORE INTO subjectDetails (code, year, part, program_id) VALUES ?"

    let options = {
        method: "POST",
        hostname: "assmnt.pcampus.edu.np",
        path: "/api/subjects/",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        maxRedirects: 20,
    };

    performRequest(
        options,
        '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="prog"\r\n\r\n' +
        program +
        '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="year"\r\n\r\n' +
        year +
        '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="part"\r\n\r\n' +
        part +
        "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--",
        async function (data) {
            console.log(data);
            let body = Buffer.concat(data);
            console.log(body);
            subjectList = JSON.parse(body.toString());
            detailsList = JSON.parse(body.toString());
            for (let i = 0; i < subjectList.length; i++) {
                subjectList[i].splice(2, 2);
                detailsList[i].splice(1, 3);
                detailsList[i].push(year);
                detailsList[i].push(part);
                detailsList[i].push(program);


            }
            try {

                await db.query(subjectQuery, [subjectList]);
                await db.query(subDetailsQuery, [detailsList]);

                console.log("Subjects stored successfully!");
                res.status(200).send("ok")
            } catch (err) {

                res.status(402).send("error" + err)

            }
        }
    );
});

router.post("/edit-user", isAdmin,  async function (req, res, next) {
    let q1 = `UPDATE instructor set name="${req.body.username}", code="${req.body.code}", department_id="${req.body.dept}" WHERE id=${req.body.id}`;
    try {
        await db.query(q1);
        console.log("user edited");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post('/edit-user-key',isAdmin,   async function (req, res, next) {
    try {
        const salt = await bcrypt.genSalt();
        var hash = await bcrypt.hash(req.body.password, salt);
        saltedpassword = hash;
        let q1 = `UPDATE instructor set password="${hash}" WHERE id=${req.body.id}`;
        
        await db.query(q1)
        console.log('user key edited');
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }




}

);

router.post("/delete-user",isAdmin,   async function (req, res, next) {
    let q1 = `DELETE FROM instructor WHERE id=${req.body.id}`;
    try {

        await db.query(q1);
        console.log("user deleted");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post("/add-program",isAdmin,   async function (req, res, next) {
    let q1 = `INSERT IGNORE INTO program (id, name, department_id) values ("${req.body.id}", "${req.body.name}", "${req.body.dept}")`;
    try {

        await db.query(q1);
        console.log("program added");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post("/edit-program",isAdmin,   async function (req, res, next) {
    let q1 = `UPDATE program set id="${req.body.id}", name="${req.body.name}", department_id="${req.body.dept}" WHERE id="${req.body.previd}"`;
    try {

        await db.query(q1);
        console.log("program updated");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post("/add-department",isAdmin,   async function (req, res, next) {
    console.log(req)
    let q1 = `INSERT IGNORE INTO department (id, name) values ("${req.body.id}", "${req.body.name}")`;
    try {

        await db.query(q1);
        console.log("department saved");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post("/edit-department",isAdmin,   async function (req, res, next) {
    let q1 = `UPDATE department set id="${req.body.id}", name="${req.body.name}" WHERE id="${req.body.previd}";`;
    console.log(q1)
    try {

        await db.query(q1);
        console.log("department updated");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post("/delete-program",isAdmin,   async function (req, res, next) {
    let q1 = `DELETE FROM program WHERE id="${req.body.id}"`;
    try {

        await db.query(q1);
        console.log("program deleted");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post("/delete-department",isAdmin,   async function (req, res, next) {
    let q1 = `DELETE FROM department WHERE id="${req.body.id}"`;
    try {

        await db.query(q1);
        console.log("deartmet deleted");
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});
//todo
router.post('/delete-subjects',isAdmin,  async function (req, res, next) {
    let q0=`SELECT subjectDetails.code from subject natural join subjectDetails WHERE program_id="${req.body.program_id}" and year="${req.body.year}" and part="${req.body.part}"`;
    let q1 = `DELETE FROM subjectDetails WHERE program_id="${req.body.program_id}" and year="${req.body.year}" and part="${req.body.part}"`;
    try {
        result= await db.query(q0);
        codes=[];
        let q2= `DELETE FROM subject where code in (?)`
        await db.query(q1);
        result.forEach(async(element) => {
            try{await db.query(q2, [element.code]);}
            catch(err)
            {}
        });
        
       
        console.log('Subjects deleted');
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }

});

router.post('/delete-class',isAdmin,  async function (req, res, next) {

    let q1 = `DELETE FROM student WHERE class_id="${req.body.class_id}"`
    let q2 = `DELETE FROM class WHERE batch="${req.body.batch}" and program_id="${req.body.program_id}" and class_group="${req.body.class_group}"`;
    try {
        await db.query(q1);
        await db.query(q2);
        console.log('Class deleted');
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

router.post('/delete-attendance-details',isAdmin,  async function (req, res, next) {

    let q1 = `DELETE FROM attendanceDetails WHERE class_id="${req.body.class_id}" and subject_code="${req.body.subject_code}" and classType="${req.body.classType}"`;
    try {
        console.log(q1)
        await db.query(q1);
        console.log('Record deleted');
        res.status(200).send("ok")
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

module.exports = router;
