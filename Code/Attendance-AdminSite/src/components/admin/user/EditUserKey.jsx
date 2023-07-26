import React, { useState, useContext, useEffect } from 'react';
import {withRouter } from 'react-router-dom';
import ApiRequest from '../ApiRequest';
import {AuthContext} from "../../../contexts/authContext";

function EditUserKey(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [dept, setDept] = useState('');

  useEffect(() => {
    async function getUser() {
      const request = await ApiRequest.get(`/instructor/${props.match.params._id}`);
      setName(request.data[0].name);
      setUser(request.data[0].code);
      setDept(request.data[0].department_id);
    };
    getUser();
  }, [props.match.params._id]);

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      password:pass,
      id:props.match.params._id
    }
    ApiRequest.post('/secret/edit-user-key', data).
    then(()=>props.history.push("/home"))
    .catch((err)=>
    {
     if (err.response.status==401)
     alert("You must be logged in to perform this action")
     setAuthenticated(false)
    });;;
  };

  return(
    <React.Fragment>
      <div className="card mx-auto my-5" style={{maxWidth: "20rem"}}>
        <div className="card-header text-center">Edit User</div>
        <div className="card-body">
          <h6>{ name }</h6>
          <hr></hr>
          <p>ID : { props.match.params._id } </p>
          <p>Username : { user }</p>
          <p>Department : { dept }</p>
          <form>
            <input type="password" className="form-control mb-3" placeholder="Password" onChange={ e => setPass(e.target.value) }></input>
            <button type="submit" className="btn btn-danger btn-block mb-1" onClick={ submitForm }>Change User Key</button>
            <button type="submit" className="btn btn-primary btn-block mt-1" onClick={ submitForm }>Discard and go back</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(EditUserKey);