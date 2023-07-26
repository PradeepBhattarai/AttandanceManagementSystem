import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import {AuthContext} from "../contexts/authContext"

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBAlert,
} from "mdbreact";
import * as Cookies from 'js-cookie';

const Login = (props) => {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const recordData = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: username, password: password }),
    };
    fetch("/backend/authentication/login", requestOptions)
    .then((response)=>{
      if (response.status === 200) return response.json();
      if (response.status === 401) return
    })
      .then((res) => {
       
        if (res.token)
        {
          Cookies.set('attendance-jwt-token', res.token, { expires: 1/48, path: '' });
         setAuthenticated(true);
          props.history.push("/dashboard");
        }
        else{
          setInvalid(true);
        }
        
      })
      .catch((err) =>{ 
        setInvalid(true);

    });

  };
  return (
    <MDBContainer className="mr-5 mt-5">
      <MDBRow>
        <MDBCol md="6">
          <form onSubmit={recordData}>
            <p className="h5 text-center mb-4">Sign in</p>
            {invalid ? (
              <MDBAlert color="warning">Invalid username or password</MDBAlert>
            ) : null}
            <div className="grey-text">
              <MDBInput
                label="Username"
                icon="user"
                group
                type="text"
                validate
                error="wrong"
                success="right"
                onChange={(e) => setUsername(e.target.value)}
              />

              <MDBInput
                label="Type your password"
                icon="lock"
                group
                type="password"
                validate
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-center">
              <MDBBtn color="primary" type="submit">
                Login
              </MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default withRouter(Login);
