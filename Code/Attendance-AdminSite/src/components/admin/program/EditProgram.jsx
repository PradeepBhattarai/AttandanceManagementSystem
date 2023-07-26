import React, { useState, useEffect, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ApiRequest from '../ApiRequest';
import {AuthContext} from "../../../contexts/authContext";

function EditProgram(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [savedDepartments, setSavedDepartments] = useState([]);

  useEffect(() => {
    async function getProgram() {
      const request = await ApiRequest.get(`/program/${props.match.params._id}`);
      setId(request.data[0].id);
      setName(request.data[0].name);
      setDepartment(request.data[0].department_id);
    };
    async function getDepartments() {
      const requestDepartments = await ApiRequest.get('/department');
      setSavedDepartments(requestDepartments.data);
    };
    getProgram();
    getDepartments();
  }, [props.match.params._id]);

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      id:id,
      name:name,
      dept:department,
      previd:props.match.params._id
    }
    ApiRequest.post('/secret/edit-program', data).then((response)=>{
      props.history.push("/home") 
    }).catch((err)=>
    {
     if (err.response.status==401)
     setAuthenticated(false)
     alert("You must be logged in to perform this action")
    });

  };

  return(
    <React.Fragment>
      <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
        <div className="card-header">Edit Program</div>
        <div className="card-body">
          <form>
            <input type="text" className="form-control mb-3" placeholder="Id" value={id} onChange={ e => setId(e.target.value) }></input>
            <input type="text" className="form-control mb-3" placeholder="Name" value={name} onChange={ e => setName(e.target.value) }></input>
            <select className="form-control mb-3" onChange={ e => setDepartment(e.target.value)}>
              <option style={{display:"none"}}>Department</option>
              { savedDepartments.map(dept =>
                <option value={dept.id} key={dept.id}>{dept.name}</option>
              )}
            </select>
            <Link to="/home" className="text-decoration-none"><button type="submit" className="btn btn-primary btn-block" onClick={ submitForm }>Edit Program</button></Link>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(EditProgram);