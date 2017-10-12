import React from 'react';
import $ from 'jquery';
import CustomerSignup from './CustomerSignup.jsx';

class CustomerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      unauthorised: false,
      path: 'login'
    };
  }

  updateInputFields(event, field) {
    this.setState({
      [field]: event.target.value
    });
  }

  submitHandler(event) {
    event.preventDefault();
    $.ajax({
      url: `/customerlogin?username=${this.state.username}&password=${this.state.password}`,
      method: 'POST',
      success: (data) => {
        this.setState({
          unauthorised: false
        });
        window.location.href = data;
      },
      failure: (err) => {
        console.log('failed to load page', err);
      },
      statusCode: {
        401: () => {
          this.setState({
            unauthorised: true
          });
        }
      }
    });
  }

  togglePath(event, newPath) {
    this.setState({
      path: newPath
    });
  }

  render() {
    if (this.state.path === 'signup') {
      return (<CustomerSignup togglePath={this.togglePath.bind(this)}/>);
    } else {
      return (
        <div className='container'>
          <form className='form-signin' onSubmit={this.submitHandler.bind(this)}>
            <h2 className='form-signin-heading'>Log in</h2>
            <label className='sr-only'>Email address</label>
            <input
              value={this.state.username}
              type='username'
              className='form-control'
              placeholder='username'
              required autoFocus
              onChange={(e) => this.updateInputFields(e, 'username')}
            />
            <label className='sr-only'>Password</label>
            <input
              value={this.state.password}
              type='password'
              className='form-control'
              placeholder='Password'
              required
              onChange={(e) => this.updateInputFields(e, 'password')}
            />
            <button className='btn btn-lg btn-primary btn-block' type='submit'>Log in</button>
            <br />
            {
              this.state.unauthorised ?
                <div className="alert alert-danger">
                invalid credentials - please try again!
                </div>
                : null
            }
          </form>
          <div className="redir">New user?</div>
          <button onClick={(e) => (this.togglePath.call(this, e, 'signup'))} className='btn btn-lg btn-primary btn-block'>Sign up</button>
        </div>
      );
    }

  }
}

export default CustomerLogin;
