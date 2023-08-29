import React, { useState, useEffect, useContext } from "react";
import { MDBTable, MDBTableBody, MDBTableHead, MDBBtn } from "mdbreact";
import "../App.css";
import { withRouter } from "react-router-dom";
import axios from "axios";
import FadeIn from "react-fade-in";
import { AuthContext } from "../contexts/authContext"


function TakeAttendance(props) {
    const [authenticated, setAuthenticated] = useContext(AuthContext);
    // eslint-disable-next-line
    const [data, setData] = useState(props.location.state.data);
    const [selectedClass, setSelectedClass] = useState("L");
    const [selectedSubject, setSelectedSubject] = useState(
        props.location.state.data.subjects[0].code
    );
    const [present, setPresent] = useState(
        props.location.state.data.students.map(() => false)
    );
    var subjectType;
    if (data.subjects.length === 1) {
        subjectType = (
            <h2>
                {data.subjects[0].code} {data.subjects[0].subject}
            </h2>
        );
    } else {
        subjectType = (
            <div className="form-group col-md-6">
                <label className="grey-text font-weight-light">Subject:</label>
                <select
                    id="Subject"
                    className="form-control"
                    value={selectedSubject}
                    name="subject_code"
                    onChange={(event) => setSelectedSubject(event.target.value)}
                >
                    {data.subjects.map((eachSubject) => (
                        <option value={eachSubject.code} key={eachSubject.code}>
                            {eachSubject.code} ({eachSubject.subject})
                        </option>
                    ))}
                </select>
            </div>
        );
    }
    var classType;
    if (data.classes[0].classType === "L") {
        classType = <h5>Lecture</h5>;
    } else if (data.classes[0].classType === "P") {
        classType = <h5>Practical</h5>;
    } else {
        classType = (
            <div className="form-group col-md-6">
                <label className="grey-text font-weight-light">
                    Class Type:
                </label>
                <select
                    id="classType"
                    className="form-control"
                    name="classType"
                    value={selectedClass}
                    onChange={(event) => setSelectedClass(event.target.value)}
                >
                    <option value="L">Lecture </option>
                    <option value="P">Practical </option>
                </select>
            </div>
        );
    }

    function handleChange(event) {
        const roll_no = event.target.name;
        setPresent(
            data.students.map((eachStudent, index) =>
                eachStudent.roll_no === roll_no
                    ? !present[index]
                    : present[index]
            )
        );
    }

    function handleSubmit(event) {
        event.preventDefault();

        const details = {
            classType: selectedClass,
            class_id: data.classes[0].id,
            subject_code: selectedSubject,
        };
        data.students.forEach((student, index) => {
            if (present[index]) {
                details[student.roll_no.toString()] = "present";
            }
        });
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        axios
            .post("/backend/attendance/submit", formBody, {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                },
            })
            .then((res) => {
                props.history.push(
                    `/history/${data.classes[0].id}/${selectedSubject}/${selectedClass}`
                )
            }
            )
            .catch((err) => {

                if (err.response.status == 401) {
                    alert("You must be logged in first!")
                    setAuthenticated(false)
                    props.history.push("/");
                }

            });
    }

    useEffect(() => {
        if (data.classes[0].classType === "L") {
            setSelectedClass("L");
        } else if (data.classes[0].classType === "P") {
            setSelectedClass("P");
        }
    }, [data]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <FadeIn>
            <form name="theForm" onSubmit={handleSubmit}>
                <br />
                <br />
                {subjectType}
                {classType}
                <hr />

                <MDBTable bordered hover responsive>
                    <MDBTableHead color="primary-color" textWhite>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Present/Absent</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {data.students.map((student, index) => {
                            return (
                                <tr
                                    key={student.roll_no}
                                    style={{
                                        backgroundColor: present[index]
                                            ? "#90ee90"
                                            : "#ffcccb",
                                    }}
                                >
                                    <td style={{ fontWeight: "bold" }}>
                                        {student.roll_no}
                                    </td>
                                    <td style={{ fontWeight: "bold" }}>
                                        {student.name}
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name={student.roll_no}
                                            value={
                                                present[index]
                                                    ? "present"
                                                    : "absent"
                                            }
                                            checked={present[index]}
                                            onChange={handleChange}
                                            style={{
                                                zoom: 1.5,
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </MDBTableBody>
                </MDBTable>

                <MDBBtn
                    color="primary"
                    type="submit"
                    style={{ color: "white" }}
                >
                    Submit
                </MDBBtn>
            </form>
        </FadeIn>
    );
}

export default withRouter(TakeAttendance);
