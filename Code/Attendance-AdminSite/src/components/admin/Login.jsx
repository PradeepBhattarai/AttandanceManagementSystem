import React,{ useState, useContext } from 'react';
import ApiRequest from './ApiRequest';
import { withRouter } from 'react-router-dom';
import {AuthContext} from "../../contexts/authContext";
import * as Cookies from 'js-cookie'

const Login = (props) => {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const recordData = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { password: password },
    };
    ApiRequest.post("/adminauth/login", requestOptions)
      .then((res) => {
      
        if (res.status===200)
        { 
          Cookies.set('attendance-jwtadmin-token', res.data.token, { expires: 1/48, path: '' });
          console.log(authenticated)
          setInvalid(false)
          setAuthenticated(true)
          props.history.push("/home")
        }
        else{
          setInvalid(true);
          setAuthenticated(false)
        }
        
      })
      .catch((err) => {
        if (err.response)
        {
        if (err.response.status===401)
        {setInvalid(true)
        setAuthenticated(false)
        }
      }
      });

  };
  return (
    <React.Fragment>
               {invalid ? (
              <div class="alert alert-danger" role="alert">Invalid key</div>
            ) : null}
      <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
        <div className="card-header">Login Portal</div>
        <div className="card-body">
          <form onSubmit={recordData}>
            <input type="password" className="form-control mb-3" placeholder="Enter the key..."  onChange={(e) => setPassword(e.target.value)}></input>
           <button type="submit" className="btn btn-primary btn-block">Go</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(Login);