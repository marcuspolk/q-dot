import React from 'react';
import $ from 'jquery';

class ManagerSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      restaurant: '',
      city: '',
      unauthorised: false,
      restaurantList: [] 
    };
  }

  updateInputFields(event, field) {
    this.setState({
      [field]: event.target.value
    });
    if (field === restaurant) {
      $.ajax({
        url: '/yelp',
        method: 'GET',
        data: {
          term: this.state.restaurant,
          location: this.state.city
        },
        success: result => {
          console.log('successful GET request!', result);
          var businessList = [];
          result.businesses.forEach(function(business) {
            businessList.push(business.name);
          });
          this.setState({
            businessList: businessList
          });
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }

  submitHandler(event) {
    event.preventDefault();
    $.ajax({
      url: `/manager?username=${this.state.username}&password=${this.state.password}&restaurant=${this.state.restaurant}`,
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
    return(
      <div className='container'>
        <form className='form-signin' onSubmit={this.submitHandler.bind(this)}>
          <h2 className='form-signin-heading'>Sign Up</h2>
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
          <label className='sr-only'>City</label>
          <input
            value={this.state.city}
            type='text'
            className='form-control'
            placeholder='City'
            required
            onChange={(e) => this.updateInputFields(e, 'city')}
          />
          <label className='sr-only'>Restaurant</label>
          <input
            value={this.state.restaurant}
            type='text'
            list = 'restaurants'
            className='form-control'
            placeholder='Restaurant'
            required
            onChange={(e) => this.updateInputFields(e, 'restaurant')}
          />
          <datalist id='restaurants'>
            {this.state.restaurantList.map(restaurant => {
              return (<option value={restaurant}/>);
            })}
          </datalist>
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

export default ManagerSignup;
