import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ApiRequest from '../ApiRequest';
import {AuthContext} from "../../../contexts/authContext";

function AddSubject(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [part, setPart] = useState('');
  const [savedPrograms, setSavedPrograms] = useState([]);

  useEffect((props) => {
    async function getPrograms() {
      const requestPrograms = await ApiRequest.get('/program');
      setSavedPrograms(requestPrograms.data);
    };

    getPrograms();
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      program: program,
      year: year,
      part: part
    }
    ApiRequest.post('/secret/add-sub', data).then(()=>
    {
      props.history.push("/home")
    }
    ).catch((err)=>
    {
     if (err.response.status==401)
     alert("You must be logged in to perform this action")
     setAuthenticated(false)
    });
  };

  return(
    <React.Fragment>
      <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
        <div className="card-header">Add Subject</div>
        <div className="card-body">
          <form>
            <select className="form-control mb-3" onChange={ e => setProgram(e.target.value)}>
              <option style={{display:"none"}}>Program</option>
              { savedPrograms.map(program =>
                <option value={program.id} key={program.id}>{program.id}</option>
              )}
            </select>
            <input type="text" className="form-control mb-3" placeholder="Year" onChange={ e => setYear(e.target.value) }></input>
            <select className="form-control mb-3" onChange={ e => setPart(e.target.value) }>
              <option style={{display:"none"}}>Part</option>
              <option value={1} key={1}>{1}</option>
              <option value={2} key={2}>{2}</option>
            </select>
            <button type="submit" className="btn btn-primary btn-block" onClick={ submitForm }>Add Subject</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(AddSubject);