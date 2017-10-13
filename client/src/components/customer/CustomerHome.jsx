import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import RestaurantCard from './RestaurantCard.jsx';
import MenuListItem from './MenuListItem.jsx'
import GMap from './GMap.jsx';
import $ from 'jquery';
const { api_key } = require('../../../../server/credentials/googleAPI.js');
import { Link } from 'react-router-dom';

class CustomerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRestaurant: false,
      currentRestaurant: {},
      restaurantList: [],
      modalRestaurant: undefined,
      location: undefined,
      modalMap: undefined
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

  showMap(restaurant) {
    this.setState({
      modalMap: restaurant
    });
    setTimeout(() => $('#rest-map').modal('toggle'), 0);
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
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.setState({
          location: location
        });
        //call google maps api call
      });
    } else {
      alert('Geolocation not supported by your browser');
    }
  }

  render() {
    return (
      <div>
        <div className="customer-home">
          <CustomerBanner />
          <div className="select-restaurant-container col-xs-12">
            <button className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4" onClick={this.getLocation.bind(this)}>Find Restaurants Near Me</button>
            {this.state.location ?
              <div style={{width: '250px', height: '250px', margin: '100px auto 0'}}>
                <GMap
                  you={!!this.state.location}
                  location={this.state.location}
                  apiKey={api_key}
                />
              </div>

              : ''}
            <h4 style={{marginTop: '50px'}} className="col-xs-12 text-center">Help me queue up at...</h4>

            {this.state.restaurantList.map(restaurant => (
              <div className="col-xs-12" key={restaurant.id}>
                <div className="col-xs-12">
                  <div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                    <button onClick={this.showMap.bind(this, restaurant)} className="col-xs-5 col-xs-offset-2 col-sm-4 col-sm-offset-4 col-md-3 col-md-offset-6">Map</button>
                    <button onClick={this.getMenu.bind(this, restaurant.id)} className="col-xs-5 col-xs-offset-0 col-sm-4 col-md-3">Menu</button>
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

          { this.state.modalMap ?
            <div style={{background: 'none', boxShadow: 'none'}} id="rest-map" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h2 className="modal-title">Menu</h2>
                  </div>
                  <div className="modal-body">
                    <div style={{width: '250px', height: '250px', margin: '15px auto'}}>
                      <GMap
                        you={!!this.state.location}
                        isMarkerShown
                        location={this.state.location}
                        restaurant={{latitude: this.state.modalMap.latitude, longitude: this.state.modalMap.longitude}}
                        apiKey={api_key}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            : '' }
      </div>
    );

  }

}

export default CustomerHome;
