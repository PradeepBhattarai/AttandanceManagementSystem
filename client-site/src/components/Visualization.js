import React, { Component, useContext} from "react";
import { HorizontalBar, Line } from "react-chartjs-2";
import { MDBContainer, MDBTableBody, MDBTable, MDBTableHead } from "mdbreact";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../contexts/authContext"

class Visualization extends Component {
    static contextType=AuthContext;
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentDidMount() {
        const [authenticated, setAuthenticated] = this.context
        axios
            .get(
                `/backend/attendance/allRecord/${this.props.match.params.classId}/${this.props.match.params.subjectCode}/${this.props.match.params.classType}`
            )
            .then((response) => {
                var studentWiseCount = [];
                var dates = [];
                var dateWiseCount = [];
                response.data.students.forEach((student, index) => {
                    var c = 0;
                    Object.keys(response.data.records).forEach((i) => {
                        if (
                            response.data.records[i].students.includes(
                                student.roll_no
                            )
                        ) {
                            c += 1;
                        }
                    });
                    studentWiseCount[index] = c;
                });

                Object.keys(response.data.records).forEach((key) => {
                    dates.push(response.data.records[key].date);
                    dateWiseCount.push(
                        response.data.records[key].students.length
                    );
                });

                const studentData = response.data.students.map(
                    (eachStudent, index) => {
                        return {
                            name: eachStudent.name,
                            value: studentWiseCount[index],
                        };
                    }
                );
                studentData
                    .sort((a, b) => b.value - a.value)
                    .sort((a, b) =>
                        a.value === b.value ? a.name - b.name : 1
                    );

                this.setState({
                    records: response.data.records,
                    students: response.data.students,
                    studentWiseCount: studentWiseCount,
                    subject:
                        response.data.details.subject +
                        " " +
                        response.data.details.subjectName,
                    classTitle:
                        response.data.details.batch +
                        response.data.details.program,
                    section: response.data.details.section,
                    classType:
                        response.data.details.type === "L"
                            ? "Lecture"
                            : "Practical",
                    dataLine: {
                        labels: dates,
                        datasets: [
                            {
                                label: "",
                                fill: true,
                                lineTension: 0.3,
                                backgroundColor: "rgba(184, 185, 210, .3)",
                                borderColor: "rgb(35, 26, 136)",
                                borderCapStyle: "butt",
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: "miter",
                                pointBorderColor: "rgb(35, 26, 136)",
                                pointBackgroundColor: "rgb(255, 255, 255)",
                                pointBorderWidth: 10,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgb(0, 0, 0)",
                                pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: dateWiseCount,
                            },
                        ],
                    },
                    dataHorizontal: {
                        labels: studentData.map(
                            (eachStudent) => eachStudent.name
                        ),
                        datasets: [
                            {
                                label: "",
                                data: studentData.map(
                                    (eachStudent) => eachStudent.value
                                ),
                                fill: false,
                                backgroundColor: studentData.map(() => {
                                    return "rgba(16, 34, 196, 0.6)";
                                }),
                                borderColor: studentData.map(() => {
                                    return "rgba(16, 34, 196,1)";
                                }),
                                borderWidth: 3,
                            },
                        ],
                    },
                });
            })
            .catch((err) => {
          
                if (err.response.status == 401) {
                    alert("You must be logged in first!")
                    setAuthenticated(false)
                }
             });
    }

    barChartOptions = {
        responsive: true,
        legend: false,
        scales: {
            xAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        fontStyle: "bold",
                    },
                },
            ],
        },
    };

    lineChartOptions = {
        responsive: true,
        legend: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    render() {
        return (
            <MDBContainer>
                <h3 className="mt-5 text-center">{this.state.subject}</h3>
                <p className="text-center">
                    Class: {this.state.classTitle}, Section:{" "}
                    {this.state.section}, Type: {this.state.classType}
                </p>
                <div className="card">
                    <div className="card-body">
                        <div className="card-title text-center">
                            Datewise Attendance Record
                        </div>
                        <Line
                            data={this.state.dataLine}
                            options={this.lineChartOptions}
                        />
                    </div>
                </div>

                <br />
                <br />
                <div className="card">
                    <div className="card-body">
                        <div className="card-title text-center">
                            Studentwise Attendance Record
                        </div>
                        <HorizontalBar
                            data={this.state.dataHorizontal}
                            options={this.barChartOptions}
                        />
                    </div>
                </div>
                <br />
                <br />
                <p className="text-center" style={{ fontWeight: "bold" }}>
                    Attendance Table
                </p>
                {this.state.records === undefined ||
                this.state.students === undefined ? null : (
                    <MDBTable bordered hover responsive id="attendance_table">
                        <MDBTableHead color="primary-color" textWhite>
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                {Object.keys(this.state.records).map((key) => {
                                    return (
                                        <th key={key}>
                                            {this.state.records[key].date}
                                        </th>
                                    );
                                })}
                                {Object.keys(this.state.records).length > 0 ? (
                                    <th>Total Present</th>
                                ) : null}
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {this.state.students.map((eachStudent, index) => {
                                return (
                                    <tr>
                                        <td style={{ fontWeight: "bold" }}>
                                            {eachStudent.roll_no}
                                        </td>
                                        <td style={{ fontWeight: "bold" }}>
                                            {eachStudent.name}
                                        </td>
                                        {Object.keys(this.state.records)
                                            .length > 0
                                            ? Object.keys(
                                                  this.state.records
                                              ).map((i) => (
                                                  <td>
                                                      {this.state.records[
                                                          i
                                                      ].students.includes(
                                                          eachStudent.roll_no
                                                      ) ? (
                                                          <strong
                                                              style={{
                                                                  color:
                                                                      "green",
                                                                  fontWeight:
                                                                      "bold",
                                                              }}
                                                          >
                                                              {" "}
                                                              P
                                                          </strong>
                                                      ) : (
                                                          <strong
                                                              style={{
                                                                  color: "red",
                                                                  fontWeight:
                                                                      "bold",
                                                              }}
                                                          >
                                                              A
                                                          </strong>
                                                      )}
                                                  </td>
                                              ))
                                            : null}
                                        {Object.keys(this.state.records)
                                            .length > 0 ? (
                                            <td>
                                                <strong
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {
                                                        this.state
                                                            .studentWiseCount[
                                                            index
                                                        ]
                                                    }
                                                </strong>
                                            </td>
                                        ) : null}
                                    </tr>
                                );
                            })}
                        </MDBTableBody>
                    </MDBTable>
                )}
            </MDBContainer>
        );
    }
}

export default withRouter(Visualization);
