import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerMain from './CustomerMain.jsx';

// render the big components here
class CustomerApp extends React.Component {
  constructor() {
    super();
    this.state = {
      user: ''
    };
  }

  componentDidMount() {
    $.ajax({
      url: '/userdata',
      type: 'GET',
      success: (res) => {
        this.setState({
          user: res
        });
      },
      error: () => {
        console.log('error fetching user data');
      }
    });
  }

  render() {
    return (
      <div>
        <CustomerNav user={this.state.user}/>
        <CustomerMain user={this.state.user}/>
      </div>
    );
  }
}
// const CustomerApp = () => (
//   <div>
//     <CustomerNav />
//     <CustomerMain />
//   </div>
// );

export default CustomerApp;
