import React from 'react';
import $ from 'jquery';
import GoogleMapReact from "google-map-react";
import balloon from '../../../dist/images/map_marker.png';

const Marker = (props) => (
  <div >
    <div style={{width: '30px', height: '30px', fontSize: '10px', paddingTop:'10px', background: 'skyblue', borderRadius: '50%', textTransform: 'uppercase', color: 'white', textAlign: 'center'}}>You</div>
  </div>
);

const Restaurant = (props) => (
  <div>
    <img style={{width: '30px', height: '30px', transform: 'translate(0, -15px)'}} src={balloon}/>
  </div>
);

const GMap = (props) => (
  <GoogleMapReact style={{width: '250px', height: '250px', position: 'relative'}}
    size={{width: '250px', height: '250px'}}
    bootstrapURLKeys={{key: props.apiKey}}
    center={{lat: !!props.restaurant ? props.restaurant.latitude : (!!props.location ? props.location.latitude : 37.7837625), lng: !!props.restaurant ? props.restaurant.longitude : (!!props.location ? props.location.longitude : -122.4090708)}}
    defaultZoom={13}
    minZoom={4}>
    { props.you ?
      <Marker lat={props.location.latitude} lng={props.location.longitude}/>
      : ''}
    { props.isMarkerShown ?
      <Restaurant lat={props.restaurant.latitude} lng={props.restaurant.longitude} />
      : '' }
  </GoogleMapReact>
);

export default GMap;
