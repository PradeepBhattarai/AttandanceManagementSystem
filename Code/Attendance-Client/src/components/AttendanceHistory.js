import React from "react";
import { withRouter } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  MDBInput,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
} from "mdbreact";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import DeleteButton from "./DeleteButton";
import FadeIn from "react-fade-in";
import {AuthContext} from "../contexts/authContext"

const AttendanceHistory = (props) => {
  const[authenticated, setAuthenticated]= useContext(AuthContext)
  const [counts, setCounts] = useState({});
  const [details, setDetails] = useState({});
  const [records, setRecords] = useState({});
  const [temprecords, setTemprecords] = useState({});
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [present, setPresent] = useState([]);
  const [absent, setAbsent] = useState([]);
  const [visited, setVisited] = useState([]);
  const [beginEdit, setBeginEdit] = useState(false);
  const [beginDelete, setBeginDelete] = useState(false);
  const classId = props.match.params.classId;
  const subjectCode = props.match.params.subjectCode;
  const classType = props.match.params.classType;

  useEffect(() => {

    axios
      .get(`/backend/attendance/all/${classId}/${subjectCode}/${classType}`)
      .then((res) => {
       console.log(res)
        var recs = res.data.records;
        Object.keys(recs).map((i) => {
          recs[i].editable = false;
        });
        //var recs_copy = { ...recs };
        setStudents(res.data.students);
        setDetails(res.data.details);
        setRecords(recs);

        //setCounts(res.data.counts);
      })
      .catch((err) => {
        
        if(err.response.status==401)
        {
          setAuthenticated(false)
          props.history.push("/");
        }
      });
  }, [classId, subjectCode, classType]);
  //console.log(props.match);

  useEffect(() => {
    console.log("Calleddd");
    setCounts(updateCount());
  }, [records]);

  const changeEditable = (i) => {
    
    console.log("change editable called");
    var recs = { ...records };
    if (!recs[i].editable && !editing) {
      //setTemprecords(recs[i]);
      recs[i].editable = true;
      setRecords(recs);
      setEditing(true);
    } else if (recs[i].editable) {
      //trecords[i].editable = false;
      recs[i].editable = false;
      //recs[i] = temprecords;
      present.map((n) => {
        if (!recs[i].students.includes(n)) {
          recs[i].students.push(n);
        }
      });
      absent.map((n) => {
        recs[i].students = recs[i].students.filter((r) => r !== n);
      });
      //console.log(recordsstudents);
      //console.log(temprecords);
      setRecords(recs);
      setEditing(false);
    }

    // console.log(recs);
  };

  const handleChange = (i, roll_no) => {
    console.log("handle change called");
    if (!editing) {
      //trecords = { ...records };
      setEditing(true);
    }
    var temp = { ...records };
    if (temp[i].students.includes(roll_no)) {
      temp[i].students = temp[i].students.filter((item) => item !== roll_no);
      if (!visited.includes(roll_no)) {
        var pr = [...present];
        pr.push(roll_no);
        setPresent(pr);
        var v = [...visited];
        v.push(roll_no);
        setVisited(v);
      }
    } else {
      temp[i].students.push(roll_no);
      if (!visited.includes(roll_no)) {
        var ab = [...absent];
        ab.push(roll_no);
        setAbsent(ab);
        var v = [...visited];
        v.push(roll_no);
        setVisited(v);
      }
    }
    setRecords(temp);
    console.log(records);
    //console.log(trecords);
  };

  const updateRecords = (i) => {
    


    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json"  },
      //withCredentials: true,
      body: JSON.stringify({ students: records[i].students.sort() }),
    };

    fetch(`/backend/attendance/edit/${i}`, requestOptions).then((res) => {
      if(res.status==401)
      { alert("You must be logged in first!")
        setAuthenticated(false)
        props.history.push("/");
      }
      console.log(res)
      var recs = { ...records };
      recs[i].editable = false;
      setRecords(recs);
      //setTemprecords(recs);
      setEditing(false);
      setPresent([]);
      setAbsent([]);
      setVisited([]);

    })
    .catch((err) => {  
     
      if(err.response.status==401)
      { alert("You must be logged in first!")
        setAuthenticated(false)
        props.history.push("/");
      }});
  };

  var deleteRecord = (i) => {

    axios
      .get(`/backend/attendance/delete/${i}`)
      .then((res) => {
        setRecords(
          Object.keys(records)
            .filter((key) => key != i)
            .reduce((result, current) => {
              result[current] = records[current];
              return result;
            }, {})
        );
      })
      .catch((err) => {
        if(err.response.status==401)
        { alert("You must be logged in first!")
          setAuthenticated(false)
          props.history.push("/");
        }
       });
  };

  const updateCount = () => {
    //console.log(records);
    var count = {};
    students.forEach((student) => {
      var c = 0;
      Object.keys(records).forEach((i) => {
        if (records[i].students.includes(student.roll_no)) {
          c += 1;
        }
      });
      count[student.roll_no] = c;
    });
    return count;
  };
  return (
    <FadeIn>
      <div>
        <br />

        <p>
          <strong>Subject: </strong>
          {details.subjectName}({details.type == "L" ? "Lecture" : "Practical"})
        </p>
        <p>
          <strong>Batch: </strong>
          {details.batch}
          {details.program}
          (Section {details.section})
        </p>

        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn btn-success"
          table="attendance_table"
          filename={`${details.subjectName}_${details.batch}${details.program}${details.section}_${details.type}`}
          sheet="tablexls"
          buttonText="Export to Excel"
        />

        <MDBBtn
          color="primary"
          style={{ width: "fit-content" }}
          onClick={() => {
            setBeginEdit(!beginEdit);
          }}
        >
          Edit
        </MDBBtn>
        {!beginEdit ? (
          <MDBBtn
            color="danger"
            style={{ width: "fit-content" }}
            onClick={() => setBeginDelete(!beginDelete)}
          >
            Delete
          </MDBBtn>
        ) : null}
        <MDBTable bordered hover responsive id="attendance_table">
          <MDBTableHead color="primary-color" textWhite>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              {Object.keys(records).map((i) =>
                beginEdit ? (
                  <th key={i}>
                    {" "}
                    <MDBBtn
                      style={{ width: "fit-content" }}
                      color="primary"
                      onClick={() => changeEditable(i)}
                    >
                      {new Date(records[i].date).toDateString()}{" "}
                    </MDBBtn>{" "}
                    {records[i].editable ? (
                      <MDBBtn
                        style={{
                          width: "fit-content",
                          color: "white",
                        }}
                        onClick={() => updateRecords(i)}
                      >
                        Save
                      </MDBBtn>
                    ) : null}
                  </th>
                ) : (
                    <th>
                      {new Date(records[i].date).toDateString()}{" "}
                      {beginDelete ? (
                        <DeleteButton id={i} deleteRecord={deleteRecord} />
                      ) : null}{" "}
                    </th>
                  )
              )}

              {Object.keys(records).length > 0 ? <th>Total Present</th> : null}
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {students.map((student, index) => (
              <tr key={student.roll_no}>
                <td>
                  <strong style={{ fontWeight: "bold" }}>
                    {student.roll_no}
                  </strong>
                </td>
                <td>
                  <strong style={{ fontWeight: "bold" }}>{student.name}</strong>
                </td>
                {Object.keys(records).length > 0
                  ? Object.keys(records).map((i) => (
                    <td>
                      {records[i].editable ? (
                        <input
                          type="checkbox"
                          defaultChecked={
                            records[i].students.includes(student.roll_no)
                              ? true
                              : false
                          }
                          // value={
                          //   records[i].students.includes(student.roll_no)
                          //     ? "present"
                          //     : "absent"
                          // }
                          id={`checkbox${i}_${student.roll_no}`}
                          onChange={() => handleChange(i, student.roll_no)}
                        />
                      ) : records[i].students.includes(student.roll_no) ? (
                        <strong
                          style={{
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                            P
                        </strong>
                      ) : (
                            <strong
                              style={{
                                color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              A
                            </strong>
                          )}
                    </td>
                  ))
                  : null}
                {Object.keys(records).length > 0 ? (
                  <td>
                    <strong style={{ fontWeight: "bold" }}>
                      {counts[student.roll_no] ? counts[student.roll_no] : 0}
                    </strong>
                  </td>
                ) : null}
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
    </FadeIn>
  );
};

export default withRouter(AttendanceHistory);
