import React from 'react';
import { withRouter } from 'react-router-dom'
import ApiHit from '../../services/api'
import saveParams from '../saveParams'
class Home extends React.Component{

    getUser=()=>{
        ApiHit.getApi('users/allUsers',saveParams.getToken())
        .then(json => {
            console.log("josn===",json);
            if(json.data.status===1){
                this.props.history.push('/user', json.data.data)
            }
            else{
                this.props.history.push('/login')
            }
        }).catch((error)=>{
        alert('login failed. Try later!')
        this.props.history.push('/login')
        })
    }

    logout =() =>{
        this.props.history.push('/login')
    }

   render(){
      return <div>
              <button  style={{ float: 'right' }} className="btn btn-default" onClick={this.logout}>Logout</button>
          <h2>Home</h2>
          <h3>Welcome to Home Page</h3>
          <button className="btn btn-primary" onClick={this.getUser}>User Listing</button>
        </div>
   }
}

export default withRouter(Home);