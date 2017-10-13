import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import RestaurantCard from './RestaurantCard.jsx';
import MenuListItem from './MenuListItem.jsx'
import $ from 'jquery';
import { Link } from 'react-router-dom';

class CustomerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRestaurant: false,
      currentRestaurant: {},
      restaurantList: [],
      modalRestaurant: undefined,
      location: undefined
    };
  }

  componentDidMount() {
    this.getRestaurantList();
  }

  getRestaurantList() {
    $.ajax({
      method: 'GET',
      url: '/restaurants',
      success: (data) => {
        console.log('successfully grabbed restaurant data', data);
        this.setState({ restaurantList: data });
      },
      failure: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  showModal(menu) {
    this.setState({
      modalRestaurant: menu
    });
    setTimeout(() => $('#customer-menu').modal('toggle'), 0);
  }

  getMenu(restaurantId) {
    $.ajax({
      url: `./menu/${restaurantId}`,
      success: (menu) => {
        this.showModal.call(this, menu)
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let location = {
          latitude: position.latitude,
          longitude: position.longitude
        };
        this.setState({
          location: location
        });
        //call google maps api call
      });
    } else {
      console.log('Geolocation not supported by your browser');
    }
  }

  render() {
    return (
      <div>
        <div className="customer-home">
          <CustomerBanner />
          <div className="select-restaurant-container col-xs-12">
            <button className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4" onClick={this.getLocation.bind(this)}>Find Restaurants Near Me</button>
            {/*show user location*/}
            <h4 style={{marginTop: '50px'}} className="col-xs-12 text-center">Help me queue up at...</h4>
            {this.state.restaurantList.map(restaurant => (
              <div className="col-xs-12" key={restaurant.id}>
                <div className="col-xs-12">
                  <div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                    <button onClick={this.getMenu.bind(this, restaurant.id)} className="col-xs-5 col-xs-offset-7 col-sm-4 col-sm-offset-8 col-md-3 col-md-offset-9">Menu</button>
                  </div>
                </div>
                <Link to={`/restaurant/${restaurant.name}/${restaurant.id}`}><RestaurantCard restaurant={restaurant}/></Link>
              </div>
            ))}
          </div>
        </div>


          { this.state.modalRestaurant
            ? <div style={{background: 'none', boxShadow: 'none'}} id="customer-menu" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h2 className="modal-title">Menu</h2>
                  </div>
                  <div className="modal-body">
                    <ul className="menu">
                      {this.state.modalRestaurant.map((menuItem, index) => {
                        return <MenuListItem menuItem={menuItem} key={index}/>
                      })}
                    </ul>
                  </div>
                  <div className="modal-footer">
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

export default CustomerHome;
