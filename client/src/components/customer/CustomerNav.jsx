import React from 'react';
import Link from 'react-router-dom';
import $ from 'jquery';

class CustomerNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rewards: 0
    };
  }

  componentDidMount() {
    this.getUserRewards();
  }

  getUserRewards() {
    $.ajax({
      method: 'GET',
      url: '/rewards',
      success: (data) => {
        console.log(data);
        this.setState({ rewards: data.rewardQueues });
      },
      failure: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  handleClick(path) {
    $.ajax({
      method: 'GET',
      url: path,
      success: (data) => {
        window.location.href = '/customer';
      }
    });
  }

  render() {
    return (
      <div className="customer-nav-bar">
        <ul id="dropdown1" className="dropdown-content">
          <li><a href="/">home</a></li>
          <li className="divider"></li>
          <li><a href="../manager">manager</a></li>
        </ul>
        <nav>
          <div className="nav-wrapper">
            <ul className="nav-mobile hide-on-med-and-down inline">
              <li><a className="dropdown-button" href="#!" data-activates="dropdown1">q.<i className="material-icons right">arrow_drop_down</i></a></li>
            </ul>
            { !this.props.user
              ? <ul className="nav-mobile hide-on-med-and-down inline right customer-nav-login">
                <li onClick={e => location.href = '/customersignup'}>
                  <span className="glyphicon glyphicon-user"></span> Sign Up
                </li>
                <li onClick={e => location.href = '/customerlogin'}>
                  <span className="glyphicon glyphicon-log-in"></span> Login
                </li>
              </ul>
              : <ul className="nav-mobile hide-on-med-and-down inline right customer-nav-login">
                <li onClick={() => $('#user-rewards').modal('toggle')}>
                  <span className="glyphicon glyphicon-star"></span> Rewards
                </li>
                <li onClick={e => location.href = '/logout'}>
                  <span className="glyphicon glyphicon-log-out"></span> Logout
                </li>
              </ul>
            }
          </div>
        </nav>
        <div style={{background: 'none', boxShadow: 'none'}} id="user-rewards" className="modal fade" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h2 className="modal-title">Rewards</h2>
              </div>
              <div className="modal-body">
                { !this.state.rewards
                  ? <h2>No rewards availabe, bruh!</h2>
                  : <table id="reward-table" className="bordered responsive-table centered">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Reward</th>
                        <th>Description</th>
                      </tr>
                    </thead>

                    <tbody>
                      { this.state.rewards >= 5
                        ? <tr>
                          <td><i className="material-icons">merge_type</i></td>
                          <td>Queue Reservation</td>
                          <td className="reward-description">
                            Restaurant doesn't take reservations? Schedule a
                            <br/>
                            time you want to be there and we'll automatically
                            <br/>
                            put you in the queue so your table will likely be
                            <br/>
                            ready within 10 minutes!
                          </td>
                        </tr> : null
                      }
                      { this.state.rewards >= 10
                        ? <tr>
                          <td><i className="material-icons">local_dining</i></td>
                          <td>Free Appetizer</td>
                          <td className="reward-description">
                            You certainly don't have commitment issues! You've
                            <br/>
                            shown up when called enough to earn an appetizer
                            <br/>
                            on us!
                          </td>
                        </tr> : null
                      }
                    </tbody>
                  </table>
                }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomerNav;
