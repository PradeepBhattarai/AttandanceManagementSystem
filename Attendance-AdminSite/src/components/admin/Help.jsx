import React from 'react';

const Help = () => {
  return(
    <React.Fragment>
      <div className="container mt-5 mb-3 p-0">
          <ul className="list-group">
            <li className="list-group-item">Instructions for using the system</li>
          </ul>
          <hr />
          <ul className="list-group">
            <li className="list-group-item">You are in the admin site of the Attendance Management System where you have almost all the control to the system. Be sure tht you are the right person who is authorized to use the system. If you are here by mistake please Logout from the system as soon as possible.</li>
            <li className="list-group-item">First of all, add the department. You can add multiple departments.</li>
            <li className="list-group-item">Now, add different programs which may be under different departments.</li>
            <li className="list-group-item">Now, users are to be added in order to access the client part of the system. One or more users can be added easily.</li>
            <li className="list-group-item">Now, subjects for the added programs has to be added in order to take attendance by the user in the client side.</li>
            <li className="list-group-item">Finally, classes are to be added in order to take attendance of specfic class. Note that attendance can be taken only in the client side of the system.</li>
            <li className="list-group-item">Make sure that you are connected to internet before adding subjects and classes.</li>
            <li className="list-group-item">Example of various input that are to be given while adding different components.
            <br /><br />
            For Departments :
            <br />
            ID : DOECE, DOCE, etc.
            <br />
            Name : Department of Electronics and Computer Engineering, Department of Civil Engineering, etc.
            <br /><br />
            For Programs :
            <br />
            ID : BCT, BCE, etc.
            <br />
            Name : Bachelor of Computer Engineering, Bachelor of Civil Engineering, etc.
            <br />
            Department : DOECE, DOCE, etc.
            <br />
            Duration : 4, 5, etc.
            <br /><br />
            For Users :
            <br />
            Name : John, Abc, etc.
            <br />
            Username : AS, SKM, etc. (Unique code to identify instructors.)
            <br />
            Password : abcd, 1234, etc. (Used for login and should be kept privately.)
            <br />
            Department : DOECE, DOME, etc.
            <br /><br />
            For Subject :
            <br />
            Program : BCT, BCE, etc.
            <br />
            Year : 1, 2, 3, 4, 5, etc.
            <br />
            Part : 1 or 2
            <br /><br />
            For Class :
            <br />
            Batch : 071, 074, etc.
            <br />
            Program : BCT, BCE, etc.
            <br />
            Group : AB, CD, EF, GH, etc.
            </li>
            <li className="list-group-item">All the added items can be viewed in the main dashboard by clicking on the tabs of interest. (You are currently in the 'Help' tab)</li>
            <li className="list-group-item">You can see various buttons for editing the details and for removing the records. Be sure to use them in an effective way so that no records are altered by mistake.</li>
            <li className="list-group-item">For viewing subjects, input might be given which is similar as instructed above in 'For Subject' section.</li>
            <li className="list-group-item">For viewing classes also, similar thing has to be done as in the case of subjects.</li>
            <li className="list-group-item">Attendance Details is the section with details of attendance of various classes in various subjects as shown there.</li>
            <li className="list-group-item">When you do all the necessary work, be sure to Logout from the system.</li>
          </ul>
          <hr />
      </div>
    </React.Fragment>
  )
};

export default Help;