import React from 'react';
import CustomerListEntry from './CustomerListEntry.jsx';
import _ from 'lodash';
import $ from 'jquery';
require('webpack-jquery-ui/sortable');
import AddToQueue from './AddToQueue.jsx';

class CustomerList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      modalQueue: undefined,
      newQueue: []
    };
  }

  showModal(queue) {
    this.setState({ modalQueue: queue });
    // everytime the state changed, modal needs to initialize.
    // so put the modal toggle in the next runloop of modal initialize
    setTimeout(() => $('#remove-warning').modal('toggle'), 0);
  }

  componentDidMount() {
    $('#sortable').sortable({
      revert: true,
      stop: () => {
        let children = $('#sortable')[0].children;
        let newQueue = $.map(children, (child, index) => {
          return `${child.id}&position=${(index + 1)}`;
        });
        this.setState({
          newQueue: newQueue
        });
      }
    });
    $('#sortable, #sortable .ui-state-default').disableSelection();
  }

  componentDidUpdate() {
    if (this.state.newQueue) {
      this.props.updateQueue(this.state.newQueue);
    }
  }

  render() {
    let notiCustomer = this.props.notiCustomer.bind(this);
    let entries = this.props.queues ? _.map(this.props.queues, (queue, index) => {
      return (
        <div className="ui-state-default" key={index} id={`queueId=${queue.id}`} style={{background: 'white'}}>
          <CustomerListEntry queue={queue} notiCustomer={notiCustomer} showModal={this.showModal.bind(this)}/>
        </div>
      );
    }) : <div>Nobody In Queue</div>;

    let removeCustomer = (status) => this.props.removeCustomer(this.state.modalQueue.id, status);
    return (
      <div>
        <div className="row">
          <h3 className="customer-list-head col-md-8">Customers in Queue</h3>
          <AddToQueue className="col-md-4" addCustomer={this.props.addCustomer.bind(this)}/>
        </div>
        <div className="panel panel-default" id="sortable">
          {entries}
        </div>

        { this.state.modalQueue
          ? <div id="remove-warning" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h2 className="modal-title">Statement</h2>
                </div>
                <div className="modal-body">
                  <p className="warning-content"><b>Remove {this.state.modalQueue.customer.name}</b> From Queue?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-warning" data-dismiss="modal" onClick={() => removeCustomer('No Show')}>No Show</button>
                  <button className="btn btn-success" data-dismiss="modal" onClick={() => removeCustomer('Seated')}>Seated</button>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          : []
        }
      </div>
    );
  }

}

export default CustomerList;
