import React, { useState, useEffect, useContext } from 'react'; 
import {withRouter } from 'react-router-dom';
import ApiRequest from '../ApiRequest';
import {AuthContext} from "../../../contexts/authContext";

function AddClass(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [batch, setBatch] = useState('');
  const [group, setGroup] = useState('');
  const [program, setProgram] = useState('');
  const [savedPrograms, setSavedPrograms] = useState([]);

  useEffect(() => {
    async function getPrograms() {
      const requestPrograms = await ApiRequest.get('/program');
      setSavedPrograms(requestPrograms.data);
    };

    getPrograms();
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      batch: batch,
      program: program,
      section: group
    }
    ApiRequest.post('/secret/add-class', data).then(()=>{
    props.history.push("/home");
    }).catch((err)=>
    {
      console.log(err)
     if(err.response){
     if (err.response.status==401)
    { setAuthenticated(false)
     alert("You must be logged in to perform this action")
    }
     }
    });
  };

  return(
    <React.Fragment>
      <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
        <div className="card-header">Add Class</div>
        <div className="card-body">
          <form>
            <input type="text" className="form-control mb-3" placeholder="Batch" onChange={ e => setBatch(e.target.value) }></input>
            <select className="form-control mb-3" onChange={ e => setProgram(e.target.value)}>
              <option style={{display:"none"}}>Program</option>
              { savedPrograms.map(program =>
                <option value={program.id} key={program.id}>{program.id}</option>
              )}
            </select>
            <input type="text" className="form-control mb-3" placeholder="Group" onChange={ e => setGroup(e.target.value) }></input>
           <button type="submit" className="btn btn-primary btn-block" onClick={ submitForm }>Add Class</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(AddClass);