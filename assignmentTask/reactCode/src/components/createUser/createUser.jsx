import React from 'react';
import { withRouter } from 'react-router-dom'
import ApiHit from '../../services/api'
import saveParams from '../saveParams'

class cretateUser extends React.Component {
    constructor(props) {
        super(props);
        if(this.props.location.state === undefined){ //check is edit or add form
        this.state = {
            fields: {},
            errors: {},
        }
    }else{
        this.state = {
            fields: {
            firstName: this.props.location.state.firstName,
            lastName: this.props.location.state.lastName,
            userId :  this.props.location.state.id
            },
            errors: {}
        }
    }
    }

    // back button api
    backPage = () => {
        let token = saveParams.getToken()
        ApiHit.getApi('users/allUsers', token)
            .then(json => {
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

    // form validations
    handleValidation=()=> {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        //=== First Name ====
        if (!fields["firstName"]) {
            formIsValid = false;
            errors["firstName"] = "Please enter your First Name";
        }

        if (typeof fields["firstName"] !== "undefined") {
            if (!fields["firstName"].match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["firstName"] = "Only letters";
            }
        }
        //=== Last Name ====
        if (!fields["lastName"]) {
            formIsValid = false;
            errors["lastName"] = "Please enter your Last Name";
        }

        if (typeof fields["lastName"] !== "undefined") {
            if (!fields["lastName"].match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["lastName"] = "Only letters";
            }
        }
        if(this.props.location.state === undefined){
        //=== Email ====
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Please enter your email";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        //=== Password ====
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Please enter your password";
        }

        if (typeof fields["password"] !== "undefined") {
            if (fields["password"].length < 8) {
                formIsValid = false;
                errors["password"] = "Please add at least 8 charachter";
            }

        }
    }
        this.setState({ errors: errors });
        return formIsValid;
    }

    // allusers api
    getUser=(token)=> {
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


    saveUser = (e) => {
        e.preventDefault();
        if (this.handleValidation()) {
            console.log("jsnvj===",this.state.fields);
            let url = 'users/createUser';
            let message = 'User Created Successfully';
            let Api = ApiHit.tokenPostApi    // add api with post request
            if(this.props.location.state !== undefined){
                url = 'users/editUser';
                message = "User Edited Successfully";
                Api = ApiHit.tokenPutApi        //edit api with put request
            }

            Api(url, this.state.fields, saveParams.getToken())
                .then(json => {
                    if (json.data.status === 1) {
                        console.log("josn===", json);
                        alert(message);
                        this.getUser(saveParams.getToken())
                    }
                    else {
                        this.props.history.push('/login')
                    }
                }).catch((error) => {
                    this.props.history.push('/login')
                })
                
        }
    }

    handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    render() {
        if(this.props.location.state === undefined){
        return (
            <div className="col-md-6 col-md-offset-3">
                <button style={{ float: 'right' }} className="btn btn-default" onClick={this.backPage}>Back</button>
                <h2>Create User</h2><form>
                    <div className='form-group'>
                        <label>First Name:</label>
                        <input type="text" name="firstName" className="form-control" size="40" placeholder="First Name" onChange={this.handleChange.bind(this, "firstName")} value={this.state.fields["firstName"]} />
                        <span style={{ color: "red" }}>{this.state.errors["firstName"]}</span>
                    </div>
                    <div className='form-group'>
                        <label>Last Name:</label>
                        <input type="text" name="lastName" className="form-control" size="40" placeholder="Last Name" onChange={this.handleChange.bind(this, "lastName")} value={this.state.fields["lastName"]} />
                        <span style={{ color: "red" }}>{this.state.errors["lastName"]}</span>
                    </div>
                    <div className='form-group'>
                        <label>Email:</label>
                        <input type="email" name="email" className="form-control" size="30" placeholder="Email" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]} />
                        <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                    </div>
                    <div className='form-group'>
                        <label>Password: </label>
                        <input type="password" name="password" className="form-control" size="12" placeholder="Password" onChange={this.handleChange.bind(this, "password")} value={this.state.fields["password"]} />
                        <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.saveUser.bind(this)}>Save</button>
                    <button style={{ float: 'right' }} type="button" className="btn btn-primary" onClick={this.backPage}>Close</button>
                </form></div>

        )
        }else{
            return (
                <div className="col-md-6 col-md-offset-3">
                    <button style={{ float: 'right' }} className="btn btn-default" onClick={this.backPage}>Back</button>
                    <h2>Edit User</h2><form>
                        <div className='form-group'>
                            <label>First Name:</label>
                            <input type="text" name="firstName" className="form-control" size="40" placeholder="First Name" onChange={this.handleChange.bind(this, "firstName")} value={this.state.fields["firstName"]} />
                            <span style={{ color: "red" }}>{this.state.errors["firstName"]}</span>
                        </div>
                        <div className='form-group'>
                            <label>Last Name:</label>
                            <input type="text" name="lastName" className="form-control" size="40" placeholder="Last Name" onChange={this.handleChange.bind(this, "lastName")} value={this.state.fields["lastName"]} />
                            <span style={{ color: "red" }}>{this.state.errors["lastName"]}</span>
                        </div>
                        <input type="hidden" name = "userId" onChange={this.handleChange.bind(this, "userId")} value={this.state.fields["userId"]}/>
                        <button type="button" className="btn btn-primary" onClick={this.saveUser.bind(this)}>Save</button>
                        <button style={{ float: 'right' }} type="button" className="btn btn-primary" onClick={this.backPage}>Close</button>
                    </form></div>
    
            ) 
        }
    }
}

export default withRouter(cretateUser);