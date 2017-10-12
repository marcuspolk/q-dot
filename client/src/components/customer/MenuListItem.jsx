import React from 'react';
import $ from 'jquery';

const MenuListItem = (props) => (
  <li>
    <h4 className="col-xs-11">{props.menuItem.dish}</h4>
    <div className="col-xs-1 price">
      ${props.menuItem.price}
    </div>
    <div className="col-xs-11">
      {props.menuItem.description}
    </div>
  </li>
);

export default MenuListItem;
