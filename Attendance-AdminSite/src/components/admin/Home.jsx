import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import ApiRequest from './ApiRequest';
import {AuthContext} from "../../contexts/authContext";
import * as Cookies from 'js-cookie'
import Help from './Help';

function Home(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendaceDetails, setAttendanceDetails] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const requestUsers = await ApiRequest.get('/instructor');
      setUsers(requestUsers.data);
    };
    async function getDepartments() {
      const requestDepartments = await ApiRequest.get('/department');
      setDepartments(requestDepartments.data);
    };
    async function getPrograms() {
      const requestPrograms = await ApiRequest.get('/program');
      setPrograms(requestPrograms.data);
    };
    async function getSubjects() {
      const requestSubjects = await ApiRequest.get('/subject');
      setSubjects(requestSubjects.data);
    };
    async function getClasses() {
      const requestClasses = await ApiRequest.get('/class');
      setClasses(requestClasses.data);
    };
    async function getStudents() {
      const requestStudents = await ApiRequest.get('/student');
      setStudents(requestStudents.data);
    };
    async function getAttendanceDetails() {
      const requestAttendanceDetails = await ApiRequest.get('/attendance/details');
      setAttendanceDetails(requestAttendanceDetails.data);
    };

    getUsers();
    getDepartments();
    getPrograms();
    getSubjects();
    getClasses();
    getStudents();
    getAttendanceDetails();
  }, []);

  const logout = () => {
    
    Cookies.remove('attendance-jwtadmin-token', { path: '' });
    setAuthenticated(false);
      
  };

  const DepartmentsContent = () => {
    return (
      <React.Fragment>
        <div className="container mt-5 mb-3 p-0">
          <ul className="list-group">
            <li className="list-group-item">List of Departments</li>
          </ul>
        </div>
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Edit</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
          { departments.map( department => {
                  return (
                    <tbody key={ department.id }>
                      <tr>
                        <td>{ department.id }</td>
                        <td>{ department.name }</td>
                        <td>{ <Link to={`/editdepartment/${department.id}`}><button type="submit" className="btn btn-outline-info m-1">Edit Details</button></Link> }</td>
                        <td>{ <button type="submit" className="btn btn-outline-danger m-1" onClick={() => {
                  ApiRequest.post('/secret/delete-department', {id:department.id}).then(    
                setDepartments([...departments.filter(d => department.id!==d.id)])).catch((err)=>
                {
                 if (err.response.status===401)
                 setAuthenticated(false)
                 alert("You must be logged in to perform this action")
                });;
                  }}>Delete</button> }</td>
                      </tr>
                    </tbody>
                  )
          })}
          </table>
        </div>
      </React.Fragment>
    )
  };
  const ProgramsContent = () => {
    return (
      <React.Fragment>
        <div className="container mt-5 mb-3 p-0">
          <ul className="list-group">
            <li className="list-group-item">List of Programs</li>
          </ul>
        </div>
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Department</th>
                <th scope="col">Duration</th>
                <th scope="col">Edit</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
          { programs.map( program => {
                  return (
                    <tbody key={ program.id }>
                      <tr>
                        <td>{ program.id }</td>
                        <td>{ program.name }</td>
                        <td>{ program.department_id }</td>
                        <td>{ program.course_duration } Years</td>
                        <td>{ <Link to={`/editprogram/${program.id}`}><button type="submit" className="btn btn-outline-info m-1">Edit Details</button></Link> }</td>
                        <td>{ <button type="submit" className="btn btn-outline-danger m-1" onClick={() => {
                  ApiRequest.post('/secret/delete-program', {id:program.id}).then(setPrograms([...programs.filter(d => d.id !== program.id)])).catch((err)=>
                  {
                   if (err.response.status===401)
                   setAuthenticated(false)
                   alert("You must be logged in to perform this action")
                  });;
                  }}>Delete</button> }</td>
                      </tr>
                    </tbody>
                  )
          })}
          </table>
        </div>
      </React.Fragment>
    )
  };
  const UsersContent = () => {
    return (
      <React.Fragment>
        <div className="container mt-5 mb-3 p-0">
          <ul className="list-group">
            <li className="list-group-item">List of Instructors</li>
          </ul>
        </div>
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Department</th>
                <th scope="col">Edit</th>
                <th scope="col">Edit Key</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
          { users.map( user => {
                  return (
                    <tbody key={ user.id }>
                      <tr>
                        <td>{ user.id }</td>
                        <td>{ user.name }</td>
                        <td>{ user.department_id }</td>
                        <td>{ <Link to={`/edituser/${user.id}`}><button type="submit" className="btn btn-outline-info m-1">Edit User Details</button></Link> }</td>
                        <td>{ <Link to={`/edituserkey/${user.id}`}><button type="submit" className="btn btn-outline-secondary m-1">Edit User Key</button></Link> }</td>
                        <td>{ <button type="submit" className="btn btn-outline-danger m-1" onClick={() => {
                  ApiRequest.post('/secret/delete-user', {id:user.id}).then(setUsers([...users.filter(u => u.id !== user.id)])).catch((err)=>
                  {
                   if (err.response.status===401)
                   setAuthenticated(false)
                   alert("You must be logged in to perform this action")
                  });;
                  }}>Delete User</button> }</td>
                      </tr>
                    </tbody>
                  )
          })}
          </table>
        </div>
      </React.Fragment>
    )
  };
  const SubjectsContent = () => {

    const [program, setProgram] = useState('');
    const [year, setYear] = useState('');
    const [part, setPart] = useState('');

    return (
      <React.Fragment>
        <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
          <div className="card-header">View Subject</div>
          <div className="card-body">
            <form>
              <select className="form-control mb-3" onChange={ e => setProgram(e.target.value)}>
                <option style={{display:"none"}}>Program</option>
                { programs.map(program =>
                  <option value={program.id} key={program.id}>{program.id}</option>
                )}
              </select>
              <input type="text" className="form-control mb-3" placeholder="Year" onChange={ e => setYear(e.target.value) }></input>
              <select className="form-control mb-3" onChange={ e => setPart(e.target.value) }>
                <option style={{display:"none"}}>Part</option>
                <option value={1} key={1}>{1}</option>
                <option value={2} key={2}>{2}</option>
              </select>
            </form>
          </div>
        </div>
        <div className="container mt-5 mb-3 p-0">
          <ul className="list-group">
            <li className="list-group-item">List of Subjects</li>
          </ul>
        </div>
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">Year</th>
                <th scope="col">Part</th>
                <th scope="col">Program ID</th>
              </tr>
            </thead>
          { subjects.map( subject => {
            if (subject.program_id === program) {
              if (subject.year.toString() === year) {
                if (subject.part.toString() === part) {
                  return (
                    <tbody key={ subject.code }>
                      <tr>
                        <td>{ subject.code }</td>
                        <td>{ subject.name }</td>
                        <td>{ subject.year }</td>
                        <td>{ subject.part }</td>
                        <td>{ subject.program_id }</td>
                      </tr>
                    </tbody>
                  )
                }
              }
            }
          })}
          </table>
        </div>
        <div className="container">
          <button type="submit" className="btn btn-outline-danger" onClick={
            () => {
              ApiRequest.post('/secret/delete-subjects', {program_id:program, year:Number(year), part:Number(part)}).then(setSubjects([...subjects.filter(sub => sub.year !== year || sub.part !== part || sub.program_id !== program)])).catch((err)=>
              {
               if (err.response.status===401)
               setAuthenticated(false)
               alert("You must be logged in to perform this action")
              });;
            }
          }>Remove these subjects</button>
        </div>
      </React.Fragment>
    )
  };
  const ClassesContent = () => {

    const [batch, setBatch] = useState('');
    const [program, setProgram] = useState('');
    const [section, setSection] = useState('');
    var classId;

    return (
      <React.Fragment>
        <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
          <div className="card-header">View Class</div>
          <div className="card-body">
            <form>
              <input type="text" className="form-control mb-3" placeholder="Batch" onChange={ e => setBatch(e.target.value) }></input>
              <select className="form-control mb-3" onChange={ e => setProgram(e.target.value)}>
                <option style={{display:"none"}}>Program</option>
                { programs.map(program =>
                  <option value={program.id} key={program.id}>{program.id}</option>
                )}
              </select>
              <input type="text" className="form-control mb-3" placeholder="Section" onChange={ e => setSection(e.target.value) }></input>
            </form>
          </div>
        </div>
        <div className="container mt-5 mb-3 p-0">
          <ul className="list-group">
            <li className="list-group-item">List of Students</li>
          </ul>
        </div>
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Roll No</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
          { students.map( student => {
            if (student.batch.toString() === batch) {
              if (student.program_id === program) {
                if (student.class_group === section) {
                  classId = student.class_id;
                  return (
                    <tbody key={ student.roll_no }>
                      <tr>
                        <td>{ student.roll_no }</td>
                        <td>{ student.name }</td>
                      </tr>
                    </tbody>
                  )
                }
              }
            }
          })}
          </table>
        </div>
        <div className="container">
          <button type="submit" className="btn btn-outline-danger" onClick={
            () => {
              ApiRequest.post('/secret/delete-class', {batch:batch, program_id:program, class_group:section, class_id:classId}).then(setClasses([...classes.filter( classs => classs.batch !== batch || classs.program_id !== program || classs.class_group !== section)])).then(setStudents([...students.filter( student => student.class_id !== classId)])).catch((err)=>
              {
               if (err.response.status===401)
               setAuthenticated(false)
               alert("You must be logged in to perform this action")
              });;
            }
          }>Remove this class</button>
        </div>
      </React.Fragment>
    )
  };

  const AttendanceDetails = () => {
    return (
      <React.Fragment>
        <div className="container mt-5 mb-3 p-0">
          <ul className="list-group">
            <li className="list-group-item">Attendance Details</li>
          </ul>
        </div>
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Batch</th>
                <th scope="col">Program</th>
                <th scope="col">Group</th>
                <th scope="col">Subject</th>
                <th scope="col">Class Type</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
          { attendaceDetails.map( details => {
                  return (
                    <tbody key={ details.class_id + details.subject_code }>
                      <tr>
                        <td>{ details.batch }</td>
                        <td>{ details.program_id }</td>
                        <td>{ details.class_group }</td>
                        <td>{ details.name }</td>
                        <td>{ details.classType }</td>
                        <td><button type="submit" className="btn btn-outline-danger" onClick={
                          () => {
                            console.log(details.class_id, details.subject_code)
                            ApiRequest.post('/secret/delete-attendance-details', { class_id:details.class_id, subject_code:details.subject_code, classType:details.classType}).then(setAttendanceDetails([...attendaceDetails.filter(detail => detail.class_id !== details.class_id ||detail.subject_code !== details.subject_code ||  detail.classType !== details.classType)])).catch((err)=>
                            {
                             if (err.response.status===401)
                             setAuthenticated(false)
                             alert("You must be logged in to perform this action")
                            });;
                          }
                        }>Remove</button></td>
                      </tr>
                    </tbody>
                  )
          })}
          </table>
        </div>
      </React.Fragment>
    )
  };

  const HelpContent = () => {
    return <Help />
  };

  const SelectContent = ({ selector }) => {
    if (selector === 'Departments'){
      return <DepartmentsContent />
    }
    else if (selector === 'Programs'){
      return <ProgramsContent />
    }
    else if (selector === 'Users'){
      return <UsersContent />
    }
    else if (selector === 'Subjects'){
      return <SubjectsContent />
    }
    else if (selector === 'Classes'){
      return <ClassesContent />
    }
    else if (selector === 'Attendance Details'){
      return <AttendanceDetails />
    }
    else if (selector === 'Help'){
      return <HelpContent />
    }
  };

  const [content, setContent] = useState('Departments');
  const contents = ['Departments', 'Programs', 'Users', 'Subjects', 'Classes', 'Attendance Details', 'Help'];

  return(
    <React.Fragment>
      <div className="jumbotron jumbotron-fluid text-center">
        <div className="container">
          <h1 className="display-4">Institute of Engineering</h1>
          <h1 className="display-5">Pulchowk Campus</h1>
          <p className="lead">Attendance Management System</p>
        </div>
      </div>
      <div className="card container p-0">
        <div className="card-header">Attendance Management System, Pulchowk Campus, IOE</div>
        <div className="card-body">
          <h3>Welcome</h3>
          <hr></hr>
          <p>Total Departments : {departments.length}</p>
          <p>Total Programs : {programs.length}</p>
          <p>Total Instructors : {users.length}</p>
          <p>Total Subjects : {subjects.length}</p>
          <p>Total Classes : {classes.length / 2}</p>
          <Link to="/adddepartment"><button type="submit" className="btn btn-outline-primary m-1">Add Department</button></Link>
          <Link to="/addprogram"><button type="submit" className="btn btn-outline-primary m-1">Add Program</button></Link>
          <Link to="/adduser"><button type="submit" className="btn btn-outline-primary m-1">Add User</button></Link>
          <Link to="/addsubject"><button type="submit" className="btn btn-outline-primary m-1">Add Subject</button></Link>
          <Link to="/addclass"><button type="submit" className="btn btn-outline-primary m-1">Add Class</button></Link>
          <button className="btn btn-outline-danger m-1" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container mt-5">
        {
          contents.map((contentItem) => (
            <button key={ contentItem } onClick={() => setContent(contentItem)} className={ (contentItem === content) ? 'btn btn-primary m-1 px-5' : 'btn btn-secondary m-1 px-5' }>{ contentItem }</button>
          ))
        }
      </div>
      <SelectContent selector={ content }/>
      <div className="my-5"></div>
    </React.Fragment>
  )
};

export default withRouter(Home);