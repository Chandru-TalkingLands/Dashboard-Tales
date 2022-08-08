import React, { useState, useRef, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import Map from "./Map";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
  CircleMarker,
  Polyline,
  ScaleControl,
} from "react-leaflet";
import { useMemo } from "react";
import axios from "axios";
import { map } from "leaflet";
import ToastMsg from "./ToastMsg";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Sidenav(props) {
  // const coordinates = [props.latpoints, props.lngpoints];
  // const bounds = props.center;
  const [pushdata, setpushdata] = useState([]);

  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    title: "",
    img: "",
    imgdesc: "",
    description: "",
    bounds: [],
    coordinates: [],
  });

  function handle(e) {
    const newData = e.target.value;
    setData({
      ...data,
      [e.target.name]: newData,
    });
  }

  const handleImage = async (e) => {
    e.preventDefault();

    let imgName = e.target.files[0];

    const formData = new FormData();
    formData.append("file", imgName);

    let property_name = "Banglore";
    let sub_folder = "Tales";

    try {
      const res = await axios.post(
        `http://localhost:7000/upload/${property_name}/${sub_folder}`,
        formData
      );
      console.log(res.data);
      setData(() => ({
        ...data,
        img: res.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  var item = [];
  

  const handleAddstory = (e) => {
    e.preventDefault();
    if (!props?.latpoints ){
      alert("Please select marker");
    } else{
      setpushdata((prev) => [...prev, { ...data, id: uuidv4() }]);
      alert("Added Story")
    }

    
  };

  useEffect(() => {
    setData({
      ...data,

      bounds: props.center,
      coordinates: [props.latpoints, props.lngpoints],
    });
  }, [props.latpoints, props.lngpoints, props.center]);


  const handleOnCLick = async (e) => {
    e.preventDefault();
    if (!props?.latpoints ){
      alert("Please select marker");
    } else {
      console.log(pushdata);
      let property_name = "Banglore";
      let sub_folder = "Tales";
      console.log(pushdata,"dataaaa")
      axios.post(`http://localhost:7000/create/json/${property_name}/${sub_folder}`,pushdata)
      .then((res)=>{
        console.log(res)
      })
      .catch((err)=>{
        console.log(err)
      })
      alert("Added all Stories")
      setData({
        title: "",
        img: "",
        imgdesc: "",
        description: "",
        bounds: [],
        coordinates: [],
      })
    }
  };

  return (
    <div className="sidebar">
      <div className="title">
        <h1>Talking Lands</h1>
      </div>
      <form className="story-form">
        
        <input
          onChange={handle}
          type="text"
          value={data.title}
          name="title"
          placeholder="Title of the Tale"
        />
        <input
          onChange={handle}
          type="text"
          value={data.imgdesc}
          placeholder="Imagesdesc"
          name="imgdesc"
        />
        <input
          onChange={handle}
          type="text"
          id="story"
          value={data.description}
          name="description"
          placeholder="Enter your story"
          style={{ height: 80 }}
        />
        <input
          type="file"
          multiple={true}
          ref={fileInputRef}
          name="img"
          onChange={handleImage}
        />

        <button onClick={handleAddstory} type="click" id="submit-btn">
          Add Story
        </button>
        <button onClick={handleOnCLick} type="click" id="submit-btn">
          Push Story
        </button>
      </form>
    </div>
  );
}

export default Sidenav;
