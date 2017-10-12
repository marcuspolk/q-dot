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
    <button onClick={(e) => (props.showModal('PUT', 'Modify', props.menuItem))} className="col-xs-4">Modify Dish</button>
    <button onClick={(e) => (props.showModal('DELETE', 'Remove', props.menuItem))} className="col-xs-4 col-xs-offset-1">Remove Dish</button>
  </li>
);

export default MenuListItem;
