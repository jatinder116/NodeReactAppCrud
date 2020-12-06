import React from 'react';
import { withRouter } from 'react-router-dom'
import Moment from 'moment';
import ApiHit from '../../services/api'
import saveParams from '../saveParams'

class User extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         file: null,
      }
      this.onChange = this.onChange.bind(this)
      this.fileUpload = this.fileUpload.bind(this)
      this.getUser = this.getUser.bind(this)
      this.inputReference = React.createRef();
   }

   backPage = () => {
      let token = saveParams.getToken()
      saveParams.setToken(token);
      this.props.history.push('/home');
   }

   logout = () => {
      this.props.history.push('/login')
   }

   fileUploadAction = () => this.inputReference.current.click();

   onChange = (e) => {
      e.preventDefault()
      if (e.target.files[0].type !== "text/csv") {
         alert('please choose csv file')
      } else {
         this.fileUpload(e.target.files[0])
      }
   }

   // Csv file send to api 
   fileUpload = (file) => {
      console.log("file", file);
      const formData = new FormData();
      formData.append('file', file)
      ApiHit.filePostApi('users/csvUser', formData, saveParams.getToken())
         .then(json => {
            console.log("josn===", json);
            if (json.data.status === 1) {
               alert('File upload successfully');
               this.getUser(saveParams.getToken())
            } else {
               this.props.history.push('/login')
            }
         }).catch((error) => {
            alert('login failed. Try later!')
            this.props.history.push('/login')
         })
   }

   // get all users api
   getUser = (token) => {
      console.log("file", token);
      ApiHit.getApi('users/allUsers', token)
         .then(json => {
            console.log("josn===", json);
            if (json.data.status === 1) {
               saveParams.setToken(token);
               this.props.history.push('/user', json.data.data)
            }
            else {
               this.props.history.push('/login')
            }
         }).catch((error) => {
            alert('login failed. Try later!')
            this.props.history.push('/login')
         })
   }

   // delete user api
   deleteUser = (id) => {
      ApiHit.tokenPostApi('users/deleteUser', { userId: id }, saveParams.getToken())
         .then(json => {
            console.log("josn===", json);
            alert('User Deleted Successfully');
            this.getUser(saveParams.getToken())
         }).catch((error) => {
            alert('login failed. Try later!')
            this.props.history.push('/login')
         })
   }

   // get api hit for getting single user data for edit
   editUser = (id) => {
      ApiHit.getApi('users/singleUser?userId=' + id, saveParams.getToken())
         .then(json => {
            console.log("josn===", json);
            if (json.data.status === 1) {
               saveParams.setToken(saveParams.getToken());
               this.props.history.push('/createUser', json.data.data)
            }
            else {
               this.props.history.push('/login')
            }
         }).catch((error) => {
            alert('login failed. Try later!')
            this.props.history.push('/login')
         })
   }

   createUser = () => {
      saveParams.setToken(saveParams.getToken());
      this.props.history.push('/createUser')
   }

   renderTableData() {
      if(this.props.location.state.length>0){
      return this.props.location.state.map((user, index) => {
         const { id, firstName, lastName, email, createdAt } = user //destructuring
         return (
            <tr key={id}>
               <td>{index + 1}</td>
               <td>{firstName}</td>
               <td>{lastName}</td>
               <td>{email}</td>
               <td>{Moment(createdAt).format('YYYY-MM-DD')}</td>
               <td><button type="button" id={id} className="btn btn-indigo btn-sm m-0" onClick={() => this.deleteUser(id)}>Delete</button>&nbsp;&nbsp;<button type="button" id={id} className="btn btn-indigo btn-sm m-0" onClick={() => this.editUser(id)}>Edit User</button></td>
            </tr>
         )
      })
   }else{
      return (
         <tr style={{ textAlign: 'center'}}> No data Found
         </tr>
      )
   }
   }

   render() {
      return <div>
         <button style={{ float: 'left' }} className="btn btn-default" onClick={this.backPage}>Back</button><br />
         <button style={{ float: 'right' }} className="btn btn-default" onClick={this.logout}>Logout</button>
         <h2>User Listing</h2>
         <div>
            <button style={{ float: 'left' }} className="btn btn-primary" onClick={this.createUser}>
               Create User
            </button>
            <input type="file" style={{ display: 'none' }} name="file" onChange={this.onChange} ref={this.inputReference} />
            <button style={{ float: 'right' }} className="btn btn-primary" onClick={this.fileUploadAction}>
               Import CSV
            </button>
         </div>
         <table className="table">
            <thead className="thead-dark">
            <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Create At</th>
            <th>Action</th>
         </tr>
            </thead>
            <tbody>
               {this.renderTableData()}
            </tbody>
         </table>
      </div>
   }
}

export default withRouter(User);