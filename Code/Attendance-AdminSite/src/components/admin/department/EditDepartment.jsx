import React, { useState, useEffect, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ApiRequest from '../ApiRequest';
import {AuthContext} from "../../../contexts/authContext";


function EditDepartment(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    async function getDepartment() {
      const request = await ApiRequest.get(`/department/${props.match.params._id}`)
      setId(request.data[0].id);
      setName(request.data[0].name);
    };
    getDepartment();
  }, [props.match.params._id]);

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      id:id,
      name:name,
      previd: props.match.params._id
    }
    ApiRequest.post('/secret/edit-department', data).then((response)=>{
      props.history.push('/home')
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
        <div className="card-header">Edit Department</div>
        <div className="card-body">
          <form>
            <input type="text" className="form-control mb-3" placeholder="Id" value={id} onChange={ e => setId(e.target.value) }></input>
            <input type="text" className="form-control mb-3" placeholder="Name" value={name} onChange={ e => setName(e.target.value) }></input>
            <Link to="/home" className="text-decoration-none"><button type="submit" className="btn btn-primary btn-block" onClick={ submitForm }>Edit Department</button></Link>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(EditDepartment);