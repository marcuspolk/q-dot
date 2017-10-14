import React from 'react';
// copy the menu modal setup. purely for react boilerplate...


const AnnouncementModal = (props) => (
   <div style={{background: 'none', boxShadow: 'none'}} id="announcements" className="modal fade" role="dialog">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h2 className="modal-title">Announcements</h2>
        </div>
        <div className="modal-body">
          <ul className="menu">
            {props.announcements.length === 0 && (<li>No Announcements</li>)}
            {props.announcements.map((announcement) => (<li key={announcement.id}>{announcement.message}</li>))}
          </ul>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
)

export default AnnouncementModal;
