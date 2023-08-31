import React, { useContext } from "react";
import { MDBListGroupItem, MDBBtn } from "mdbreact";
import "../App.css";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../contexts/authContext"

const ClassList = (props) => {
    const [authenticated, setAuthenticated]=useContext(AuthContext)
    const viewAttendance = () => {
        props.history.push(
            `/history/${props.attendance.class}/${props.attendance.subjectCode}/${props.attendance.classType}`
        );
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const details = {
            batch: props.attendance.batch,
            classid: props.attendance.class,
            program: props.attendance.program,
            section: props.attendance.section,
            subjectcode: props.attendance.subjectCode,
            subject: props.attendance.subject,
            type: props.attendance.classType,
        };
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        axios
            .post("/backend/student/namelist", formBody, {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                        
                },
            })
            .then((response) => {
               
                props.history.push({
                    pathname: "/new/student/namelist",
                    state: {
                        data: response.data,
                    },
                });
            })
            .catch((err) => {
                if(err.response.status==401)
                { alert("You must be logged in first!")
                  setAuthenticated(false)
                  props.history.push("/");
                }
             })
    };

    return (
        <div className="child">
            <MDBListGroupItem hover>
                <form onSubmit={handleSubmit}>
                    <div
                        className="d-flex w-100 justify-content-between"
                        style={{ color: "#007bff" }}
                    >
                        <h5 className="mb-1">{props.attendance.subject}</h5>
                        <small>{props.attendance.program}</small>
                    </div>
                    <p className="mb-1">
                        <strong>Program</strong>: {props.attendance.program}
                        <br />
                        <strong>Batch</strong>: {props.attendance.batch}
                        <br />
                        <strong>Section</strong>: {props.attendance.section}
                        <br />
                        <strong>Class Type</strong>:{" "}
                        {props.attendance.classType === "L"
                            ? "Lecture"
                            : "Practical"}
                    </p>
                    <Link
                        to={`/history/${props.attendance.class}/${props.attendance.subjectCode}/${props.attendance.classType}`}
                    >
                        <MDBBtn color="primary" style={{ color: "white" }}>
                            Attendance history
                        </MDBBtn>
                    </Link>
                    <MDBBtn
                        color="primary"
                        type="submit"
                        style={{ color: "white" }}
                    >
                        Take Attendance
                    </MDBBtn>
                </form>
            </MDBListGroupItem>
        </div>
    );
};

export default withRouter(ClassList);
