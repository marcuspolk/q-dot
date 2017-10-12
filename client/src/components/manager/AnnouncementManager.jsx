import React from 'react';
import $ from 'jquery';
class AnnouncementManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: []
    }

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
                  </tbody>
                </table>
              </div>
            </div>);
  }
}

export default AnnouncementManager;
