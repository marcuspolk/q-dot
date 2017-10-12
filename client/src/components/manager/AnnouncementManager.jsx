import React from 'react';
import $ from 'jquery';
class AnnouncementManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      modalAnnouncement: null
    };
  }

  updateStatus() {

  }

  populateModal(announcement) {
    // if announcement present, state is edit.
    if (announcement) {
      this.setState(
        {modalAnnouncement: announcement}
      );
    } else {
    // if not, start a new announcement, setState
      this.setState(
        {modalAnnouncement: null}
      );
      console.log('no announcement or something');
    }
  }

  submitAnnouncement() {

  }

  delete() {

  }

  componentDidMount() {
    // get announcements.
    var id = this.props.restaurantId;
    $.ajax({
      url: `/restaurant/${id}/announcements`,
      method: 'GET',
      success: (announcements) => {
        this.state.announcements = announcements;
        console.log(announcements);
      },
      error:  (err) => {
        console.log('err', err);
      }
    });
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
                <p className="warning-content">FORM GOES HERE</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" data-dismiss="modal" onClick={() => console.log('put something here')}>Submit</button>
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
                  <th>#</th>
                  <th>announcement</th>
                  <th>status</th>
                  <th>time</th>
                </tr>
              </thead>
              <tbody>
                {this.state.announcements.map(announcement => {
                  return (
                    <tr key={announcement.id}>
                      <td>{announcement.id}</td>
                      <td>{announcement.message}</td>
                      <td>{announcement.status}</td>
                      <td>{announcement.updatedAt}</td>
                      <td><button data-toggle="modal" data-target="#announcement-editor" onClick={()=> this.populateModal.call(this,announcement)}>edit</button></td>
                      <td>deactivate</td>
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
