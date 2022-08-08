import React from "react";
import './App.css'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, CircleMarker, Polyline, ScaleControl, Tooltip } from 'react-leaflet';
import { Icon, map } from "leaflet";
import { useMemo } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
// import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Sidenav from './Sidenav'
import Markers from "./Markers";
// Starting point of map

export const icon = new Icon({
  iconUrl: "./glowing-dot.png",
  iconSize: [50, 50]
});

const center = [12.971599,77.594566];


// const draggableMarker = {
//   lat: 12.975999021205343,
//   lng: 77.58875370025636,
// }
// const newLat = marker.getLatLng().lat;
// const newLng = marker.getLatLng().lng;
// Dragging and getting lat lng start
function Map() {

 
  const [dynamicpos,setdynamicpos] = useState();

  const [position, setPosition] = useState(center)
  const markerRef = useRef(null) 
  const [latpoints, setlatpoints] = useState()
  const [lngpoints, setlngpoints] = useState()
  const [map,setMap] = useState('')
  const [markerhide,setmarkerhide] = useState(false);

  // const [clatpoints, setclatpoints] = useState(center.lat)
  // const [clngpoints, setclngpoints] = useState(center.lng)

  // maps.addEventListener("click",()=>{
  //   setmarkerhide(!markerhide)
  // })

 

  const eventHandlers = useMemo(() => ({
    //function to get lat-lng after setting point
    
    dragend() {
      const marker = markerRef.current
      setlatpoints(marker.getLatLng().lat)
      setlngpoints(marker.getLatLng().lng)
      
      // console.log(marker.getBounds())
      // setmapcenter(center)
    },
  }),
    [],
  )

  const getmap = (data,pos)=>{
    setmarkerhide(data)
    setdynamicpos(pos)
    //if(!latpoints && !lngpoints){
      setlatpoints(pos.lat)
      setlngpoints(pos.lng)
    //}
  }




  return (
    <div id="map" className="map-view">
      <div>
        <Sidenav latpoints={latpoints} lngpoints={lngpoints} center={center} />  {/*Passing lat-lng to the form*/}
      </div>
      {/* <Sidenav latpoints={latpoints} lngpoints={lngpoints}/> */}
      <div className="map-container">
        <MapContainer center={center} zoom={16} scrollWheelZoom={true} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Markers getmap={getmap}/>
          
          {markerhide ?  <Marker position={dynamicpos}
             draggable = "true"
            eventHandlers={eventHandlers}
            //position={position}
            ref={markerRef}>
              <Tooltip>You can also drag the marker to get next location</Tooltip>
            </Marker> : ''}
         

        </MapContainer>
      </div>
    </div>
  );
}

export default Map;