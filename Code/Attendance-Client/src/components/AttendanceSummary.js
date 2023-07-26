import React, { useState, useEffect, useContext } from "react";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBIcon,
} from "mdbreact";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../App.css";
import axios from "axios";
import { withRouter } from "react-router-dom";
import FadeIn from "react-fade-in";
import {AuthContext} from "../contexts/authContext"

const AttendanceSummary = (props) => {
    const [authenticated, setAuthenticated]=useContext(AuthContext)
    const [isClassValid, setIsClassValid] = useState(true);
    const [isSubjectValid, setIsSubjectValid] = useState(true);
    const [selectFilter, setSelectFilter] = useState(false);

    const [batch, setBatch] = useState("");
    const [program, setProgram] = useState("");
    const [section, setSection] = useState("");
    const [year, setYear] = useState("");
    const [part, setPart] = useState("");
    const [summary, setSummary] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [batchOptions, setBatchOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [partOptions, setPartOptions] = useState([]);

    useEffect(() => {
        axios
            .get("/backend/program", {
            })
            .then((response) => {
                if (response.status === 401) {
                    this.props.setloading(true);
                    this.props.history.push("/");
                    this.props.setloading(false);
                }
                setProgram(response.data[0].id);
                setProgramOptions(
                    response.data.map((eachProgram) => (
                        <option value={eachProgram.id} key={eachProgram.id}>
                            {eachProgram.id}
                        </option>
                    ))
                );
            })
            .catch((err) => alert("Check your network connection"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const details = {
            program: program,
        };
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        axios
            .post("/backend/class/getClass", formBody, {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                },
            })

            .then((response) => {
                if (response.status === 401) {
                    this.props.setloading(true);
                    this.props.history.push("/");
                    this.props.setloading(false);
                }
                if (
                    response.data.classes === undefined ||
                    response.data.classes.length === 0
                ) {
                    setIsClassValid(false);
                    setBatch("");
                    setBatchOptions([]);
                } else {
                    setIsClassValid(true);
                    var batches = [
                        ...new Set(
                            response.data.classes.map(
                                (eachClass) => eachClass.batch
                            )
                        ),
                    ].sort((a, b) => a - b);
                    setBatch(batches[0]);
                    setBatchOptions(
                        batches.map((eachBatch) => (
                            <option key={eachBatch} value={eachBatch}>
                                {eachBatch}
                            </option>
                        ))
                    );
                }
            })
            .catch((err) => {
                setIsClassValid(false);
                setBatch("");
                setBatchOptions([]);
            });

        axios
            .post("/backend/subject/getSubject", formBody, {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                },
            })
            .then((response) => {
                if (response.status === 401) {
                    this.props.setloading(true);
                    this.props.history.push("/");
                    this.props.setloading(false);
                }
                if (
                    response.data.subjects === undefined ||
                    response.data.subjects.length === 0
                ) {
                    setIsSubjectValid(false);
                    setYear("");
                    setYearOptions([]);
                } else {
                    setIsSubjectValid(true);
                    var years = [
                        ...new Set(
                            response.data.subjects.map(
                                (eachSubject) => eachSubject.year
                            )
                        ),
                    ].sort((a, b) => a - b);
                    setYear(years[0]);
                    setYearOptions(
                        years.map((eachYear) => (
                            <option key={eachYear} value={eachYear}>
                                {eachYear}
                            </option>
                        ))
                    );
                }
            })
            .catch((err) => {
                setIsSubjectValid(false);
                setYear("");
                setYearOptions([]);
            });
    }, [program]);

    useEffect(() => {
        if (batch === "") {
            setSection("");
            setSectionOptions([]);
        } else {
            const details = {
                program: program,
                batch: batch,
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            axios
                .post("/backend/class/getClass", formBody, {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=UTF-8",

                    },
                })
                .then((response) => {
                    if (response.status === 401) {
                        this.props.setloading(true);
                        this.props.history.push("/");
                        this.props.setloading(false);
                    }
                    var class_groups = [
                        ...new Set(
                            response.data.classes.map(
                                (eachClass) => eachClass.class_group
                            )
                        ),
                    ].sort((a, b) => a - b);
                    setSection(class_groups[0]);
                    setSectionOptions(
                        class_groups.map((eachclass_group) => (
                            <option
                                key={eachclass_group}
                                value={eachclass_group}
                            >
                                {eachclass_group}
                            </option>
                        ))
                    );
                })
                .catch((err) => {
                    setSection("");
                    setSectionOptions([]);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [program, batch]);

    useEffect(() => {
        if (year === "") {
            setPart("");
            setPartOptions([]);
        } else {
            const details = {
                program: program,
                year: year,
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            axios
                .post("/backend/subject/getSubject", formBody, {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=UTF-8",

                    },
                })
                .then((response) => {
                    if (response.status === 401) {
                        this.props.setloading(true);
                        this.props.history.push("/");
                        this.props.setloading(false);
                    }
                    var parts = [
                        ...new Set(
                            response.data.subjects.map(
                                (eachSubject) => eachSubject.part
                            )
                        ),
                    ].sort((a, b) => a - b);
                    setPart(parts[0]);
                    setPartOptions(
                        parts.map((eachPart) => (
                            <option key={eachPart} value={eachPart}>
                                {eachPart}
                            </option>
                        ))
                    );
                })
                .catch((err) => {
                    setPart("");
                    setPartOptions([]);
                });
        }
    }, [program, year]);

    useEffect(() => {
        if (year === "" || part === "") {
            setSubjectList([]);
        } else {
            const details = {
                program: program,
                year: year,
                part: part,
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            axios
                .post("/backend/subject/getSubject", formBody, {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=UTF-8",

                    },
                })
                .then((response) => {
                    if (response.status === 401) {
                        this.props.setloading(true);
                        this.props.history.push("/");
                        this.props.setloading(false);
                    }

                    setSubjectList(
                        response.data.subjects.map(
                            (eachSubject) => eachSubject.code
                        )
                    );
                })
                .catch((err) => {
                    setSubjectList([]);
                });
        }
    }, [program, year, part]);

    useEffect(() => {
        if (
            isClassValid &&
            isSubjectValid &&
            program !== "" &&
            batch !== "" &&
            section !== ""
        ) {
            const details = {
                program: program,
                batch: batch,
                section: section,
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            axios
                .post("/backend/attendance/getSummary", formBody, {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=UTF-8",

                    },
                })
                .then((response) => {
                    if (response.status === 401) {
                        this.props.setloading(true);
                        this.props.history.push("/");
                        this.props.setloading(false);
                    }
                    setSummary(response.data);
                })
                .catch((err) =>{ 
                    alert("You must be logged in first!")
                    setAuthenticated(false)
                    props.history.push("/");
            });
        }
        // eslint-disable-next-line
    }, [program, batch, section]);

    function handleClick(event) {
        event.preventDefault();
        selectFilter ? setSelectFilter(false) : setSelectFilter(true);
    }

    return (
        <FadeIn>
            <MDBContainer>
                <br />
                <br />

                <p className="h4 text-center py-4">Class Details</p>
                <MDBRow>
                    <MDBCol md="4" className="mb-3">
                        <label
                            htmlFor="defaultFormCardNameEx"
                            className="grey-text font-weight-light"
                        >
                            Program
                        </label>
                        <select
                            id="Program"
                            className="form-control"
                            name="program"
                            value={program}
                            onChange={(event) => setProgram(event.target.value)}
                            style={{
                                borderColor:
                                    isSubjectValid || isClassValid
                                        ? "#ced4da"
                                        : "red",
                            }}
                        >
                            {programOptions}
                        </select>
                        <div className="invalid-feedback d-block">
                            {!isSubjectValid && isClassValid
                                ? "Couldn't fetch subjects for this program"
                                : ""}
                            {isSubjectValid && !isClassValid
                                ? "Couldn't fetch class for this program"
                                : ""}
                            {!isSubjectValid && !isClassValid
                                ? "Couldn't fetch subject and class for this program"
                                : ""}
                        </div>
                    </MDBCol>
                    <MDBCol md="4" className="mb-3">
                        <label
                            htmlFor="defaultFormCardNameEx"
                            className="grey-text font-weight-light"
                        >
                            Batch
                        </label>
                        <select
                            id="Batch"
                            className="form-control"
                            name="batch"
                            value={batch}
                            onChange={(event) => setBatch(event.target.value)}
                        >
                            {batchOptions}
                        </select>
                    </MDBCol>
                    <MDBCol md="4" className="mb-3">
                        <label
                            htmlFor="defaultFormCardNameEx"
                            className="grey-text font-weight-light"
                        >
                            Section
                        </label>
                        <select
                            id="Section"
                            className="form-control"
                            name="section"
                            value={section}
                            onChange={(event) => setSection(event.target.value)}
                        >
                            {sectionOptions}
                        </select>
                    </MDBCol>
                    <MDBCol md="4" className="mb-3">
                        <MDBBtn color="primary" onClick={handleClick}>
                            {!selectFilter ? (
                                <React.Fragment>
                                    <MDBIcon icon="filter" /> {" Filter search"}
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <MDBIcon icon="times" /> {" Clear Filter"}
                                </React.Fragment>
                            )}
                        </MDBBtn>
                    </MDBCol>
                </MDBRow>
                {!selectFilter ? null : (
                    <MDBRow>
                        <MDBCol md="4" className="mb-3">
                            <label
                                htmlFor="defaultFormCardNameEx"
                                className="grey-text font-weight-light"
                            >
                                Year
                            </label>
                            <select
                                id="Year"
                                className="form-control"
                                name="year"
                                value={year}
                                onChange={(event) =>
                                    setYear(event.target.value)
                                }
                            >
                                {yearOptions}
                            </select>
                        </MDBCol>
                        <MDBCol md="4" className="mb-3">
                            <label
                                htmlFor="defaultFormCardNameEx"
                                className="grey-text font-weight-light"
                            >
                                Part
                            </label>
                            <select
                                id="Part"
                                className="form-control"
                                name="part"
                                value={part}
                                onChange={(event) =>
                                    setPart(event.target.value)
                                }
                            >
                                {partOptions}
                            </select>
                        </MDBCol>
                    </MDBRow>
                )}
                <br />
                <p className="h4 text-center py-4">Attendance Summary</p>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-success"
                    table="attendance_summary_tabulation"
                    filename={
                        !selectFilter
                            ? `${batch}_${program}_${section}`
                            : `${batch}_${program}_${section}_${year}_${part}`
                    }
                    sheet="tablexls"
                    buttonText="Export to Excel"
                />

                <MDBTable
                    bordered
                    hover
                    responsive
                    id="attendance_summary_tabulation"
                >
                    <MDBTableHead color="primary-color" textWhite>
                        <tr>
                            <th>Code</th>
                            <th>Class Type</th>
                            <th>Subject</th>
                            <th>Average Attendance</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {!selectFilter
                            ? summary.map((eachSubject) => (
                                  <tr>
                                      <td>{eachSubject.code}</td>
                                      <td>
                                          {eachSubject.classType === "L"
                                              ? "Lecture"
                                              : "Practical"}
                                      </td>
                                      <td>{eachSubject.name}</td>
                                      <td>{Math.round(eachSubject.average/0.24)}%</td>
                                  </tr>
                              ))
                            : summary
                                  .filter((eachSubject) =>
                                      subjectList.includes(eachSubject.code)
                                  )
                                  .map((eachSubject) => (
                                      <tr>
                                          <td>{eachSubject.code}</td>
                                          <td>
                                              {eachSubject.classType === "L"
                                                  ? "Lecture"
                                                  : "Practical"}
                                          </td>
                                          <td>{eachSubject.name}</td>
                                          <td>{Math.round(eachSubject.average/0.24)}%</td>
                                      </tr>
                                  ))}
                    </MDBTableBody>
                </MDBTable>
            </MDBContainer>
        </FadeIn>
    );
};

export default withRouter(AttendanceSummary);
