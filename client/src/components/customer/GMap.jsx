import React from 'react';
import $ from 'jquery';
import GoogleMapReact from "google-map-react";

const Marker = (props) => (
  <div >
    <div style={{width: '30px', height: '30px', fontSize: '10px', paddingTop:'10px', background: 'skyblue', borderRadius: '50%', textTransform: 'uppercase', color: 'white', textAlign: 'center'}}>You</div>
  </div>
);

const GMap = (props) => (
  <GoogleMapReact style={{width: '250px', height: '250px', position: 'relative'}}
    size={{width: '250px', height: '250px'}}
    bootstrapURLKeys={{key: props.apiKey}}
    center={{lat: props.location.latitude, lng: props.location.longitude}}
    defaultZoom={13}
    minZoom={4}>
    <Marker lat={props.location.latitude} lng={props.location.longitude}/>
  </GoogleMapReact>
);

export default GMap;
