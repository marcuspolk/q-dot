import React from 'react';
import $ from 'jquery';
import balloon from '../../../dist/images/map_marker.png';
import scriptLoader from 'react-async-script-loader';
const { api_key } = require('../../../../server/credentials/googleAPI.js');

class GMap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillReceiveProps({ isScriptLoadSucceed }) {
    if (isScriptLoadSucceed) {
      this.map = new google.maps.Map(this.refs.map, {
        center: {lat: !!this.props.restaurant ? this.props.restaurant.latitude : (!!this.props.location ? this.props.location.latitude : 37.7837625), lng: !!this.props.restaurant ? this.props.restaurant.longitude : (!!this.props.location ? this.props.location.longitude : -122.4090708)},
        zoom: 15
      });

      if(!!this.props.location) {
        let you = new google.maps.Marker({
          position: {lat: this.props.location.latitude, lng: this.props.location.longitude},
          map: this.map
        });
      }

      if (!!this.props.restaurant) {
        let rest = new google.maps.Marker({
          position: {lat: this.props.restaurant.latitude, lng: this.props.restaurant.longitude},
          map: this.map
        });
      }

      $('#rest-map').on('shown.bs.modal', () => {
        google.maps.event.trigger(this.map, 'resize')
      });
    }
  }

  render() {
    return (
      <div ref="map" style={{width:'100%', height:'100%', border: '1ps solid lightgray'}}></div>
    );
  }
};

// const Marker = (props) => (
//   <div >
//     <div style={{width: '30px', height: '30px', fontSize: '10px', paddingTop:'10px', background: 'skyblue', borderRadius: '50%', textTransform: 'uppercase', color: 'white', textAlign: 'center'}}>You</div>
//   </div>
// );
//
// const Restaurant = (props) => (
//   <div>
//     <img style={{width: '30px', height: '30px', transform: 'translate(0, -15px)'}} src={balloon}/>
//   </div>
// );
//
// const GMap = (props) => (
//   <GoogleMapReact style={{width: '250px', height: '250px', position: 'relative'}}
//     size={{width: '250px', height: '250px'}}
//     bootstrapURLKeys={{key: props.apiKey}}
//     center={{lat: !!props.restaurant ? props.restaurant.latitude : (!!props.location ? props.location.latitude : 37.7837625), lng: !!props.restaurant ? props.restaurant.longitude : (!!props.location ? props.location.longitude : -122.4090708)}}
//     defaultZoom={13}
//     minZoom={4}>
//     { props.you ?
//       <Marker lat={props.location.latitude} lng={props.location.longitude}/>
//       : ''}
//     { props.isMarkerShown ?
//       <Restaurant lat={props.restaurant.latitude} lng={props.restaurant.longitude} />
//       : '' }
//   </GoogleMapReact>
// );

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=${api_key}`]
)(GMap);
