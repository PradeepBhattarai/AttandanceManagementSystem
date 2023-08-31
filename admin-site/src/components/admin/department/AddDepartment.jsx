import React, { useState, useContext } from 'react';
import {  withRouter } from 'react-router-dom';
import ApiRequest from '../ApiRequest';
import {AuthContext} from "../../../contexts/authContext";

function AddDepartment(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      id: id,
      name: name
    }
    ApiRequest.post('/secret/add-department', data).then((response)=>{
      props.history.push('/home')
    }).catch((err)=>
    {
     if (err.response.status==401)
     alert("You must be logged in to perform this action")
     setAuthenticated(false)
    });
  };

  return(
    <React.Fragment>
      <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
        <div className="card-header">Add Department</div>
        <div className="card-body">
          <form>
            <input type="text" className="form-control mb-3" placeholder="Id" onChange={ e => setId(e.target.value) }></input>
            <input type="text" className="form-control mb-3" placeholder="Name" onChange={ e => setName(e.target.value) }></input>
            <button type="submit" className="btn btn-primary btn-block" onClick={ submitForm }>Add Department</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(AddDepartment);