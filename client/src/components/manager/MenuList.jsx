import React from 'react';
import MenuListItem from './MenuListItem.jsx';
import _ from 'lodash';
import $ from 'jquery';

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalMenu: undefined,
      modalVals: {
        field: 'dish',
        dish: '',
        description: '',
        price: ''
      },
      newMenu: null
    };
  }

  showModal(type, action, menuItem = {}) {
    let newModal = _.extend({}, menuItem);
    newModal.type = type;
    newModal.action = action;
    this.setState({ modalMenu: newModal });
    setTimeout(() => $('#menu-form').modal('toggle'), 0);
  }

  componentDidMount() {
    $('#sortable-menu').sortable({
      axis: 'y',
      revert: true,
      stop: () => {
        let children = $('#sortable-menu')[0].children;
        let newMenu = $.map(children, (child, index) => {
          return `${child.id}?field=order&order=${(index)}`;
        });
        this.setState({
          newMenu: newMenu
        });
      }
    });
    $('#sortable-menu, #sortable-menu .ui-state-default').disableSelection();
  }

  componentDidUpdate() {
    if (this.state.newMenu) {
      this.state.newMenu.forEach((query, index) => {
        // dbMenuQuery.updateMenu(req.params.menuId, req.query.field, req.query[req.query.field])
        $.ajax({
          url: `./menu/${query}`,
          type: 'PUT',
          success: (data) => {
            console.log(data);
          },
          error: (err) => {
            console.log('Something went wrong when trying to update the order of the menu', err);
          }
        });
      })

    }
  }

  updateModalVals(e, field) {
    let newModalVals = this.state.modalVals;
    newModalVals[field] = e.target.value;
    this.setState({
      modalVals: newModalVals
    });
  }

  updateMenu(e) {
    this.props.updateMenu(this.state.modalMenu, this.state.modalVals);
    if (this.state.modalMenu.type !== 'DELETE') {
      $("#update-menu-form")[0].reset();
    }
  }

  render() {
    let dishName = (<div className="form-group">
      <label htmlFor="dish-name" className="form-control-label">Dish Name:</label>
      <input onChange={(e) => (this.updateModalVals(e, 'dish'))} type="text" className="form-control" id="dish-name"/>
    </div>);
    let dishDescription = (<div className="form-group">
      <label htmlFor="dish-description" className="form-control-label">Dish Description:</label>
      <textarea onChange={(e) => (this.updateModalVals(e, 'description'))} className="form-control" id="dish-description"></textarea>
    </div>);
    let dishPrice = (<div className="form-group">
      <label htmlFor="dish-price" className="form-control-label">Dish Price:</label>
      <input onChange={(e) => (this.updateModalVals(e, 'price'))} type="number" className="form-control" id="dish-price" min="0.01" step="0.01" max="2500"/>
    </div>);

    return (
      <div className="col-xs-12">
        <div className="col-xs-12 menu-container">
          <div className="col-xs-12">
            <h3 className="col-xs-8">Menu</h3>
            <button className="col-xs-4" onClick={this.showModal.bind(this, 'POST', 'Add')}>Add Dish</button>
          </div>
          <ul id="sortable-menu" className="menu col-xs-12">
            {this.props.menu.map((menuItem, index) => {
              return (<div id={menuItem.id} className=".ui-state-default" key={index}>
                <MenuListItem showModal={this.showModal.bind(this)} menuItem={menuItem}/>
              </div>);
            })}
          </ul>
        </div>

        { this.state.modalMenu
          ? <div id="menu-form" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h2 className="modal-title">Statement</h2>
                </div>
                <div className="modal-body">
                  <p className="warning-content">{this.state.modalMenu.action} Menu Item</p>
                </div>
                <div style={{marginTop: '30px'}} className="col-sm-10 col-sm-offset-1 col-xs-12 col-xs-offset-0">
                  { this.state.modalMenu.type === 'POST' ?
                  <form id="update-menu-form">
                    {dishName}
                    {dishDescription}
                    {dishPrice}
                  </form>
                  : ''
                  }
                  {this.state.modalMenu.type === 'PUT' ?
                  <form id="update-menu-form">
                    <div className="form-group">
                      <label htmlFor="dish-field" className="form-control-label">Which field are you modifying?</label>
                      <select id="dish-field" onChange={(e) => (this.updateModalVals(e, 'field'))}>
                        <option value="dish">Dish Name</option>
                        <option value="description">Dish Description</option>
                        <option value="price">Dish Price</option>
                      </select>
                    </div>
                    {this.state.modalVals.field === 'dish' ? <div>{dishName}</div> : ''}
                    {this.state.modalVals.field === 'description' ? <div>{dishDescription}</div> : ''}
                    {this.state.modalVals.field === 'price' ? <div>{dishPrice}</div> : ''}
                  </form>
                  : ''
                  }
                  {this.state.modalMenu.type === 'DELETE' ? <div>Are you sure you wish to remove {this.state.modalMenu.dish}?</div> : ''}
                </div>


                <div className="modal-footer">
                  <button className="btn btn-warning" data-dismiss="modal" onClick={(e) => (this.updateMenu(e))}>{this.state.modalMenu.action} Dish</button>
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

export default MenuList;
