import React from 'react';
import Link from 'react-router-dom';

class CustomerNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="customer-nav-bar">
        <ul id="dropdown1" className="dropdown-content">
          <li><a href="/">home</a></li>
          <li className="divider"></li>
          <li><a href="../manager">manager</a></li>
        </ul>
        { !this.props.user
          ? <ul>
            <div className="customer-nav-login nav navbar-nav navbar-right inline-list">
              <li>
                <span className="glyphicon glyphicon-user"></span> Sign Up
              </li>
              <li>
                <span className="glyphicon glyphicon-log-in"></span> Login
              </li>
            </div>
          </ul>
          : <ul>
            <div className="customer-nav-login nav navbar-nav navbar-right inline-list">
              <li>
                <span className="glyphicon glyphicon-star"></span> Rewards
              </li>
              <li>
                <span className="glyphicon glyphicon-log-out"></span> Logout
              </li>
            </div>
          </ul>
        }
        <nav>
          <div className="nav-wrapper">
            <ul className="nav-mobile hide-on-med-and-down inline">
              <li><a className="dropdown-button" href="#!" data-activates="dropdown1">q.<i className="material-icons right">arrow_drop_down</i></a></li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default CustomerNav;
