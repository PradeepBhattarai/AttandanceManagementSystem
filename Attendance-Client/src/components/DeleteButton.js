import React, { Component } from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBCol,
  MDBRow,
  MDBModalHeader,
  MDBModalFooter,
  MDBIcon,
} from "mdbreact";

class DeleteButton extends Component {
  state = {
    modal6: false,
    id: this.props.id,
    deleteRecord: this.props.deleteRecord,
  };

  toggle = () => {
    //  let modalNumber = "modal" + nr;
    this.setState({
      modal6: !this.state.modal6,
    });
  };

  performActions = () => {
    this.state.deleteRecord(this.state.id);

    this.setState({
      modal6: !this.state.modal6,
    });
  };

  render() {
    return (
      <MDBContainer>
        <MDBBtn
          className="float-left"
          style={{ width: "fit-content" }}
          onClick={this.toggle}
          color="danger"
        >
          Delete
        </MDBBtn>
        <MDBModal
          modalStyle="primary"
          className="text-white"
          centered
          isOpen={this.state.modal6}
          toggle={this.toggle}
        >
          <MDBModalHeader
            className="text-center"
            titleClass="w-100"
            toggle={this.toggle}
          >
            <strong>
              {" "}
              Are you sure you want to delete the selected record?
            </strong>
          </MDBModalHeader>
          <br />
          <br />
          <MDBModalFooter className="justify-content-center">
            <MDBBtn color="danger" onClick={this.performActions}>
              Yes
            </MDBBtn>
            <MDBBtn color="danger" outline onClick={this.toggle}>
              Cancel
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default DeleteButton;
