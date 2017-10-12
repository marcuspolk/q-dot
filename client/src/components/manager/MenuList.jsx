import React from 'react';
import MenuListItem from './MenuListItem.jsx';
import $ from 'jquery';
// require('webpack-jquery-ui/sortable');

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="col-xs-12 menu-container">
        <div className="col-xs-12">
          <h3 className="col-xs-8">Menu</h3>
          <button className="col-xs-4">Add Dish</button>
        </div>
        <ul className="menu col-xs-12">
          {this.props.menu.map((menuItem, index) => {
            return (<MenuListItem key={index} menuItem={menuItem}/>);
          })}
        </ul>
      </div>
    );
  }
}

export default MenuList;
