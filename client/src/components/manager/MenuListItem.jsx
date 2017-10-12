import React from 'react';
import $ from 'jquery';

class MenuListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        <h4 className="col-xs-11">{this.props.menuItem.dish}</h4>
        <div className="col-xs-1 price">
          ${this.props.menuItem.price}
        </div>
        <div className="col-xs-11">
          {this.props.menuItem.description}
        </div>
        <button className="col-xs-4">Update Dish Details</button>
        <button className="col-xs-4 col-xs-offset-1">Remove Dish</button>
      </li>
    );
  }
}

export default MenuListItem;
