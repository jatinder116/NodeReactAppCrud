import React from 'react';
import { withRouter } from 'react-router-dom'
import ApiHit from '../../_services/api'
import saveParams from '../saveParams'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fields: {},
            errors: {}
        }
    }
    // form validations
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
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
        this.setState({ errors: errors });
        return formIsValid;
    }
    // login api hit with axios
    login = (e) => {
        e.preventDefault();
        if (this.handleValidation()) {
            console.log(this.state.fields);
            ApiHit.postApi('login', this.state.fields)
                .then(json => {
                    console.log("josn===", json);
                    if (json.data.status === 1) {
                        saveParams.setToken(json.data.data.token);
                        this.props.history.push('/home')
                    }
                    else {
                        this.props.history.push('/login')
                    }
                }).catch((error) => {
                    alert('login failed. Try later!')
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
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Login Form</h2>
                <form name="form">
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
                    <button type="button" className="btn btn-primary" onClick={this.login.bind(this)}>Login</button>
                </form>
            </div>
        )
    }

}

export default withRouter(Login);

