import React from 'react';
import $ from 'jquery';
class AnnouncementManager extends React.Component {
  // TODO: Put the modal into its own component.

  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      modalMessage: '',
      modalStatus: '',
      modalAnnouncement: null
    };
  }

  toggleStatus() {
    // save this for later. for now they'll
    // have to edit manually through modal.
  }

  populateModal(announcement) {
    // if announcement present, state is edit.
    if (announcement) {
      this.setState(
        {modalAnnouncement: announcement,
        modalMessage: announcement.message,
        modalStatus: announcement.status}
      );
    } else {
    // if not, created a new announcement, setState
      this.setState(
        {modalAnnouncement: null,
        modalMessage: '',
        modalStatus: ''}
      );
    }
  }

  submitAnnouncement() {
    if (this.state.modalAnnouncement) {
      // ajax patch..
      $.ajax({
        url: `/announcements/${this.state.modalAnnouncement.id}`,
        method: 'PATCH',
        data: {
            message: this.state.modalMessage,
            status: this.state.modalStatus
        },
        success: (ann) => {
          // might even want to use the data from this new ann.
          var announcements = this.state.announcements.map(announcement => {
            if (announcement.id === this.state.modalAnnouncement.id) {
              announcement.message = this.state.modalMessage;
              announcement.status = this.state.modalStatus;
            }
            return announcement;
          });
          this.setState({announcements: announcements})
        },
        error: (err) => {
          console.log('error patching. ', err);
        }
      });
      // client side change. this seems ugly. please let me know if there's a better way. -marcus
    } else {
      // post new announcement. callback should add to state.
      $.ajax({
        url: `/restaurant/${this.props.restaurantId}/announcements`,
        method: 'POST',
        data: {
          message: this.state.modalMessage,
          status: this.state.modalStatus
        },
        success: (data) => {
          //want to change state here.
          var ann = data[0];
          var announcements = this.state.announcements;
          announcements.push({
            message: ann.message,
            status: ann.status,
            id: ann.id,
            updatedAt: ann.updatedAt
          });
          this.setState({announcements: announcements})
        },
        error: (err) => {
          console.log('error creating new announcement:', err);
        }
      });
    }
  }

  delete() {
    // woo.
  }

  componentDidMount() {
    // get announcements.
    var id = this.props.restaurantId;
    $.ajax({
      url: `/restaurant/${id}/announcements`,
      method: 'GET',
      success: (announcements) => {
        this.state.announcements = announcements;
      },
      error:  (err) => {
        console.log('err', err);
      }
    });
  }

  changeModalMessage(e) {
    this.setState({
      modalMessage: e.target.value
    });
  }

  changeModalStatus(status) {
    this.setState({modalStatus: status});
  }

  render() {
    return (
      <div>
        <div id="announcement-editor" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h3 className="modal-title">Announcement Editor</h3>
              </div>
              <div className="modal-body">
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <div className="btn-group" data-toggle="buttons">
                            <label onClick={() => this.changeModalStatus('active')} className="btn btn-primary">
                              <input type="radio" name="options" id="active"/> Active
                            </label>
                            <label onClick={() => this.changeModalStatus('inactive')} className="btn btn-primary">
                              <input type="radio" name="options" id="inactive"/> Inactive
                            </label>
                            <label onClick={() => this.changeModalStatus('default')} className="btn btn-primary">
                              <input type="radio" name="options" id="default"/> Default
                            </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="message-text" className="form-control-label">Message:</label>
                      <textarea className="form-control" id="message-text" onChange={(e) => this.changeModalMessage(e)} value={this.state.modalMessage}></textarea>
                    </div>
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" data-dismiss="modal" onClick={() => this.submitAnnouncement()}>Submit</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Announcement</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th><button data-toggle="modal" data-target="#announcement-editor" onClick={() => this.populateModal()}>Add New</button></th>
                </tr>
              </thead>
              <tbody>
                {this.state.announcements.map(announcement => {
                  return (
                    <tr key={announcement.id}>
                      <td>{announcement.message}</td>
                      <td>{announcement.status}</td>
                      <td>{announcement.updatedAt}</td>
                      <td><button data-toggle="modal" data-target="#announcement-editor" onClick={()=> this.populateModal(announcement)}>edit</button></td>
                      <td onClick={this.toggleStatus.bind(this)}>toggle</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default AnnouncementManager;
