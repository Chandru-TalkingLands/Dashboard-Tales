import React, { useState, useRef, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import { Icon, map } from "leaflet";

export const icon = new Icon({
  iconUrl: "./glowing-dot.png",
  iconSize: [50, 50],
});

const center = [12.971599, 77.594566];

const Markers = (props) => {
  const markerRef = useRef(null);
  const [status, setstatus] = useState(false);
  const [pos, setpos] = useState([]);

  let map = useMap();

    map.addEventListener("click", (e) => {
      setpos(e.latlng);
      setstatus(true);
    });


  useEffect(() => {
    props.getmap(status, pos, map);
  },[pos]);
  //
  return (
    <div>
      <Marker position={center} ref={markerRef} icon={icon}></Marker>
    </div>
  );
};

export default Markers;
