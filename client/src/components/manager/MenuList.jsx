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
      <ul className="menu">
        {this.props.menu.map((menuItem, index) => {
          return (<MenuListItem key={index} menuItem={menuItem}/>);
        })}
      </ul>
    );
  }
}

export default MenuList;
