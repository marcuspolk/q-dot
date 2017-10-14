import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import RestaurantCard from './RestaurantCard.jsx';
import MenuListItem from './MenuListItem.jsx'
import GMap from './GMap.jsx';
import AnnouncementModal from './AnnouncementModal.jsx';
import $ from 'jquery';
import scriptLoader from 'react-async-script-loader';
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
      modalMap: undefined,
      travelTime: undefined
    };
  }

  componentDidMount() {
    this.getRestaurantList('San Francisco');
  }

  getRestaurantList(city) {
    $.ajax({
      method: 'GET',
      url: `/restaurants?city=${city}`,
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
      });
    } else {
      alert('Geolocation not supported by your browser');
    }
  }

  travelTime(mode) {
    if (!!this.state.location) {
      console.log('clicked');
      let params = {
        origin: `${this.state.location.latitude},${this.state.location.longitude}`,
        destination: `${this.state.modalMap.latitude},${this.state.modalMap.longitude}`,
        mode: mode
      };
      $.ajax({
        url: `./travel?${$.param(params)}`,
        success: (data) => {
          this.setState({
            travelTime: data
          });
        },
        error: (err) => {
          console.log('Error fetching travel time from Google Maps API', err);
        }
      });
    }
  }

  showAnnModal(restaurant) {
    this.setState({
      currentRestaurant: restaurant
    });
    setTimeout(() => $('#announcements').modal('toggle'), 0);
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
                    <button onClick={() => this.showAnnModal(restaurant)} className="col-xs-12 col-xs-offset-0 col-sm-4 col-sm-offset-0 col-md-3 col-md-offset-3">Announcements ({restaurant.announcements.length})</button>
                    <button onClick={this.showMap.bind(this, restaurant)} className="col-xs-12 col-sm-4 col-md-3">Map</button>
                    <button onClick={this.getMenu.bind(this, restaurant.id)} className="col-xs-12 col-sm-4 col-md-3">Menu</button>
                  </div>
                </div>
                <Link to={`/restaurant/${restaurant.name}/${restaurant.id}`}><RestaurantCard restaurant={restaurant}/></Link>
              </div>
            ))}

          </div>
        </div>

        {this.state.currentRestaurant.announcements && <AnnouncementModal announcements={this.state.currentRestaurant.announcements}/>}

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
                    <h2 className="modal-title">{this.state.modalMap.name}</h2>
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
                    <div style={{width: '100%'}} className="text-center transportation">
                      <i onClick={this.travelTime.bind(this, 'driving')} className="fa fa-car fa-2x" aria-hidden="true"></i>
                      <i onClick={this.travelTime.bind(this, 'transit')} className="fa fa-subway fa-2x" aria-hidden="true"></i>
                      <i onClick={this.travelTime.bind(this, 'walking')} className="fa fa-male fa-2x" aria-hidden="true"></i>
                      <i onClick={this.travelTime.bind(this, 'bicycling')} className="fa fa-bicycle fa-2x" aria-hidden="true"></i>
                    </div>
                    {!!this.state.travelTime ?
                      <div>
                        <div style={{width: '100%'}} className="text-center">
                          <div className="travelInfo">Distance: {this.state.travelTime.distance.text}</div>
                          <div className="travelInfo">Duration: {this.state.travelTime.duration.text}</div>
                        </div>
                        <ul className="menu">
                          <li><div className="col-xs-11">
                            <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.travelTime.start_address}
                          </div></li>
                          {this.state.travelTime.steps.map((step, index) => {
                            return (
                              <li key={index}>
                                <h4 className="col-xs-9">{step.distance.text}</h4>
                                <div className="col-xs-3 text-right price">
                                  {step.duration.text}
                                </div>
                                <div className="col-xs-11" dangerouslySetInnerHTML={{__html: step.html_instructions}}>
                                </div>
                              </li>
                            );
                          })}
                          <li><div className="col-xs-11">
                            <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.travelTime.end_address}
                          </div></li>
                        </ul>
                      </div>
                      :
                      <div style={{width: '100%'}} className="text-center">
                        <div className="travelInfo">(Note: You must enable location services to see your travel time)</div>
                      </div>
                    }
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

// export default CustomerHome;

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=${api_key}`]
)(CustomerHome);
