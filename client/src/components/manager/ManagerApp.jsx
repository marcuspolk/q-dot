import React from 'react';
import CustomerList from './CustomerList.jsx';
import StatusSwitch from './StatusSwitch.jsx';
import AddToQueue from './AddToQueue.jsx';
import Nav from './Nav.jsx';
import ManagerAudit from './ManagerAudit.jsx';
import $ from 'jquery';
import io from 'socket.io-client';

class ManagerApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      queues: undefined,
      restaurantInfo: {},
      restaurantId: window.location.search ? Number(new URLSearchParams(window.location.search).get('restaurantId')) : ''
    };

    // socket initialize
    this.socket = io();

    // dynamically update queue
    this.socket.on('update', () => {
      this.reloadData();
    });
  }

  componentDidMount() {
    this.reloadData();
  }

  switchStatus() {
    $.ajax({
      url: '/restaurants?restaurantId=1&status=' + (this.state.restaurantInfo.status === 'Open' ? 'Closed' : 'Open'),
      method: 'PATCH',
      success: (data) => {
        console.log(data);
        this.reloadData();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  notiCustomer(queueId) {
    console.log(`noti sended to queueId: ${queueId}`);
    this.socket.emit('noti customer', queueId);
  }

  addToQueue(customer) {
    console.log('here to add', customer);
    customer.restaurantId = 1;
    $.ajax({
      method: 'POST',
      url: '/queues',
      data: JSON.stringify(customer),
      contentType: 'application/json',
      success: (data) => {
        console.log('this was a successful post request', data);
        this.reloadData();
      },
      failure: (error) => {
        console.log('something went wrong with the post request', error);
      }
    });
  }

  removeCustomer(queueId, status) {
    $.ajax({
      url: '/queues?queueId=' + queueId,
      method: 'PUT',
      data: {status: status},
      success: (data) => {
        this.reloadData();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  reloadData() {
    $.ajax({
      url: `/restaurants?restaurantId=${this.state.restaurantId}`,
      success: (data) => {
        console.log(data);
        this.setState(
          {
            restaurantInfo: data,
            queues: data.queues
          });
        // report restaurantId to server socket
        this.socket.emit('manager report', this.state.restaurantInfo.id);
        let imageURL = `url(/${data.image})`;
        $('.jumbotron-billboard').css('background', imageURL);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateQueue(queryArray) {
    queryArray.forEach((query) => {
      $.ajax({
        url: '/queues?' + query,
        type: 'PATCH',
        success: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log('Error updating queue', err);
        }
      });
    });
  }

  render() {
    return (
      <div>
        <Nav status={this.state.restaurantInfo.status} switchStatus={this.switchStatus.bind(this)}/>
        <div className="jumbotron text-center jumbotron-billboard">
          <h1 id="grand-title">{this.state.restaurantInfo.name || 'Restaurant Name'}</h1>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>Total groups in queue</h2>
              <div id="number-in-queue">{this.state.restaurantInfo.queues ? this.state.restaurantInfo.queues.length : '0'}</div>
              <h2>Approximate Wait Time</h2>
              <div id="number-in-queue">{this.state.restaurantInfo.total_wait}</div>
              <ManagerAudit />
            </div>
            <div className="col-md-6">
              <CustomerList updateQueue={this.updateQueue.bind(this)} queues={this.state.queues} addCustomer={this.addToQueue.bind(this)} removeCustomer={this.removeCustomer.bind(this)} notiCustomer={this.notiCustomer.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManagerApp;
