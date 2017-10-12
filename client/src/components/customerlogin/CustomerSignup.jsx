import React from 'react';
import $ from 'jquery';

class CustomerSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      name: '',
      mobile: '',
      email: '',
      unauthorised: false
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
      url: `/customer?username=${this.state.username}&password=${this.state.password}`,
      method: 'POST',
      success: (data) => {
        this.setState({
          unauthorised: false
        });
        window.location.href = data;
      },
      failure: (err) => {
        console.log('failed to sign up', err);
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

  togglePath(event) {
    this.props.togglePath(event, 'login');
  }

  render() {
    return (
      <div className='container'>
        <form className='form-signin' onSubmit={this.submitHandler.bind(this)}>
          <h2 className='form-signin-heading'>Sign Up</h2>
          <label className='sr-only'>Name</label>
          <input
            value={this.state.name}
            type='text'
            className='form-control'
            placeholder='Name'
            required autoFocus
            onChange={(e) => this.updateInputFields(e, 'name')}
          />
          <label className='sr-only'>Email</label>
          <input
            value={this.state.email}
            type='email'
            className='form-control'
            placeholder='Email'
            required autoFocus
            onChange={(e) => this.updateInputFields(e, 'email')}
          />
          <label className='sr-only'>Mobile Number</label>
          <input
            value={this.state.mobile}
            type='tel'
            className='form-control'
            placeholder='Mobile Number'
            required autoFocus
            onChange={(e) => this.updateInputFields(e, 'mobile')}
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
          <button className='btn btn-lg btn-primary btn-block' type='submit'>Sign Up</button>
          <br />
          {
            this.state.unauthorised ?
              <div className="alert alert-danger">
              invalid credentials - please try again!
              </div>
              : null
          }
        </form>
        <div className="redir">Already have an account?</div>
        <button onClick={this.togglePath.bind(this)} className='btn btn-lg btn-primary btn-block'>Login</button>
      </div>
    );
  }
}

export default CustomerSignup;
