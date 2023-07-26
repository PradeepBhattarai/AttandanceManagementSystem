import React, { Component, useContext } from "react";
import {AuthContext} from "../../contexts/authContext";
import {
    MDBNavbar,
    MDBNavbarNav,
    MDBNavItem,
    MDBNavLink,
    MDBNavbarToggler,
    MDBCollapse,
    MDBIcon,
    MDBBtn,
} from "mdbreact";
import { withRouter } from "react-router-dom";
import * as Cookies from "js-cookie";

class Navigation extends Component {
    static contextType=AuthContext;
    state = {
        isOpen: false,
    };
    

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    logout = () => {
        const [authenticated, setAuthenticated] = this.context
        setAuthenticated(false);
        Cookies.remove("attendance-jwt-token", { path: "" });
        this.props.setloading(true);
        this.props.history.push("/");
        this.props.setloading(false);
    };
    render() {
       
        const [authenticated, setAuthenticated] = this.context
        if (!authenticated) {
            return <br />;
        }
        return (
            
            <div className="" style={{ backgroundColor: "#007bff" }}>
                <MDBNavbar dark expand="lg">
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse
                        id="navbarCollapse3"
                        isOpen={this.state.isOpen}
                        navbar
                    >
                        <MDBNavbarNav left>
                            <MDBBtn color="primary"style={{width:"140px"}}>
                                <MDBNavItem >
                                    <MDBNavLink to="/" exact>
                                        Home
                                    </MDBNavLink>
                                </MDBNavItem>
                            </MDBBtn>
                           <MDBBtn color="primary"style={{width:"180px"}}>
                                <MDBNavItem>
                                    <MDBNavLink to="/class-details" exact>
                                        Take Attendance
                                    </MDBNavLink>
                                </MDBNavItem>
                            </MDBBtn>
                           <MDBBtn color="primary"style={{width:"140px"}}>
                                <MDBNavItem>
                                    <MDBNavLink to="/online-attendance">
                                        Online Class
                                    </MDBNavLink>
                                </MDBNavItem>
                            </MDBBtn>
                           <MDBBtn color="primary"style={{width:"140px"}}>
                                <MDBNavItem>
                                    <MDBNavLink to="/visualization-details">
                                        Visualization
                                    </MDBNavLink>
                                </MDBNavItem>
                            </MDBBtn>
                           <MDBBtn color="primary"style={{width:"140px"}}>
                                <MDBNavItem>
                                    <MDBNavLink to="/attendance-summary">
                                        Summary
                                    </MDBNavLink>
                                </MDBNavItem>
                            </MDBBtn>
                        </MDBNavbarNav>
                        {authenticated ? (
                            <MDBNavbarNav right>
                                <MDBNavItem>
                                    <MDBBtn style={{width:"100px"}}onClick={this.logout}>
                                        <MDBNavLink to=""> Logout</MDBNavLink>
                                    </MDBBtn>
                                </MDBNavItem>
                            </MDBNavbarNav>
                        ) : null}
                    </MDBCollapse>
                </MDBNavbar>
            </div>
        );
    }
}

export default withRouter(Navigation);
