import React, { useState, useEffect, useContext } from "react";
import { withRouter} from "react-router-dom";
import axios from "axios";
import { MDBContainer, MDBListGroup } from "mdbreact";
import "../App.css";
import ClassList from "./ClassList";
import {AuthContext} from '../contexts/authContext'
const Dashboard = (props) => {
    const[authenticated, setAuthenticated]=useContext(AuthContext);
    const [attendanceData, setattendanceData] = useState([]);
    useEffect(() => {
        axios
            .get("/backend/attendance/getRecent/30")
            .then((res) => {
            
                setattendanceData(res.data);
            })
            .catch((err) => { if (err.response.status ===401) {
                setAuthenticated(false)
                props.setloading(true);
                props.history.push("/");
                props.setloading(false);
              }});
     
        return () => console.log("unmounting...");
    }, [setattendanceData]);
    return (
        <MDBContainer>
            <hr />
            <hr />
            <h4>My Classes</h4>
            <hr />
            <MDBListGroup className=" ">
                {attendanceData.map((attendance, index) => (
                    <ClassList key={index} attendance={attendance} />
                ))}
            </MDBListGroup>
        </MDBContainer>
    );
};

export default withRouter(Dashboard);
