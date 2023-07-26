import { BrowserRouter as Router, Route, Redirect,  useHistory  } from 'react-router-dom';
import React, { useEffect, useContext,} from 'react';
import Login from './components/admin/Login';
import Home from './components/admin/Home';
import AddUser from './components/admin/user/AddUser';
import AddProgram from './components/admin/program/AddProgram';
import AddDepartment from './components/admin/department/AddDepartment';
import EditUser from './components/admin/user/EditUser';
import EditUserKey from './components/admin/user/EditUserKey';
import EditProgram from './components/admin/program/EditProgram';
import EditDepartment from './components/admin/department/EditDepartment';
import AddClass from './components/admin/class/AddClass';
import AddSubject from './components/admin/subject/AddSubject';
import { AuthContext } from "./contexts/authContext";
import ApiRequest from './components/admin/ApiRequest';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App() {
  let history=useHistory();
  const [authenticated, setAuthenticated] = useContext(AuthContext);
  useEffect(() => {

    ApiRequest.get(
        "adminauth/authenticate"
    )
        .then((response) => {
         
            if (response.status === 200)
            {
            setAuthenticated(true)
            }
            if (response.status === 401) 
            {
            setAuthenticated(false)
            }
        })
        .catch((error) => {
            setAuthenticated(false);
        });
}, []);

  return (
    <Router>
      <div>
        <Route exact path="/">
          {authenticated ? (
            <Redirect to="/home" />
          ) : (
              <Login />
            )}
        </Route>
        <Route exact path="/home">
          {authenticated ? (
            <Home />
          ) : (
              <Redirect to="/" />
            )}
        </Route>
        <Route exact path="/adduser">
          {authenticated ? (
            <AddUser />
          ) : (
              <Redirect to="/" />
            )}
        </Route>
        <Route exact path="/addprogram">
          {authenticated ? (

            <AddProgram />
          ) : (
              <Redirect to="/" />
            )}
        </Route>
        <Route exact path="/adddepartment">
          {authenticated ? (

            <AddDepartment />
          ) : (
              <Redirect to="/" />
            )}

        </Route>
        <Route exact path="/addclass">
          {authenticated ? (

            <AddClass />
          ) : (
              <Redirect to="/" />
            )}

        </Route>
        <Route exact path="/addsubject">
          {authenticated ? (

             <AddSubject />
          ) : (
              <Redirect to="/" />
            )}
         
        </Route>
        <Route exact path={`/edituser/:_id`}>
 {authenticated ? (

             <EditUser />
          ) : (
              <Redirect to="/" />
            )}
          
        </Route>
        <Route exact path={`/edituserkey/:_id`}>
{authenticated ? (

             <EditUserKey />
          ) : (
              <Redirect to="/" />
            )}
          
        </Route>
        <Route exact path={`/editprogram/:_id`}>
{authenticated ? (

             <EditProgram />
          ) : (
              <Redirect to="/" />
            )}
          
         
        </Route>
        <Route exact path={`/editdepartment/:_id`}>
{authenticated ? (

             <EditDepartment />
          ) : (
              <Redirect to="/" />
            )}
          
          
        </Route>
      </div>
    </Router>
  );
}

export default App;
