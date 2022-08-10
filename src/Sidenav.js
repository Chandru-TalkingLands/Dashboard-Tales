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
import ReactCardSlider from './components/ReactCardSlider'


function Sidenav(props) {



  


  // const coordinates = [props.latpoints, props.lngpoints];
  // const bounds = props.center;

  const [value, setValue] = useState("Amenities");
  const [pushdata, setpushdata] = useState([]);
  const [data, setData] = useState({
    title: "",
    img: "",
    imgdesc: "",
    description: "",
    bounds: [],
    // northeast:northeast,
    // southwest:southwest,
    coordinates: [],
  });
  const [blurprevbtn, setblurprevbtn] = useState(true);
  const [num, setnum] = useState(0);
  const [addnum, setaddnum] = useState(0);
  const [nxtbtn, setnxtbtn] = useState(false);
  const fileInputRef = useRef(null);
  const [formvalues, setformvalues] = useState();

  const labelOptions = [
    { id: 1, label: "Amenities", value: "Amenities" },
    { id: 2, label: "Nearby Project", value: "Nearby Project" },
  ];

  // const northeast = [props.nelat , props.newlng]
  // const southwest = [props.swlat , props.swlng]

  //updating form data
  const handleChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  function handle(e) {
    const newData = e.target.value;
    setData({
      ...data,
      [e.target.name]: newData,
    });
  }

  //Adding image to S3 and updating that link to json data
  const handleImage = async (e) => {
    e.preventDefault();
    let imgName = e.target.files[0];
    const formData = new FormData();
    formData.append("file", imgName);

    let property_name = "Banglore";
    let sub_folder = "Tales";
    let category_name = value;

    try {
      const res = await axios.post(
        `http://localhost:7000/upload/${property_name}/${sub_folder}/${category_name}`,
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

  //previous button
  const handlePrevstory = (e) => {
    e.preventDefault();
    let val = num - 1;
    setnum(val);


   


    // console.log(pushdata[val])
    setformvalues(pushdata[val]);
  };

  //change add button and next button dynamically
  useEffect(() => {
    if (num != addnum) {
      setnxtbtn(true);
    } else {
      setnxtbtn(false);
    }
  }, [addnum, num]);

  //Add button or Next button
  const handleAddstory = (e) => {
    
    e.preventDefault();

    

    var val = 0;
    if (num == addnum) {
      if (!props?.latpoints) {
        alert("Please select marker");
      } else {
        setpushdata((prev) => [...prev, { ...data, id: uuidv4() }]);
        alert("Added Story");
        
        setData({
          title: "",
          img: "",
          imgdesc: "",
          description: "",
        });

        val = num + 1;
        setnum(val);
        setaddnum(val);
        console.log(pushdata[val]);
        return val + 1;
      }
    } else {
      val = num + 1;
      console.log(val);
      setnum(val);
      setformvalues(pushdata[val]);
    }
  };

  // Slides objects, hard coded - 
  const slideClick = (slider) => {
    alert("You have clicked")
  }

  const slides = []

  // let slides = [{image:pushdata.img, title:pushdata.title, description:pushdata.description}]
  // slides.push(
  
  // );
  // return slides;

  //push button or final submit button
  const handleOnCLick = async (e) => {
    e.preventDefault();
    if (!props?.latpoints) {
      alert("Please select marker");
    } else {
      console.log(pushdata);
      let property_name = "Banglore";
      let sub_folder = "Tales";
      let category_name = value;
      console.log(pushdata, "dataaaa");
      axios
        .post(
          `http://localhost:7000/create/json/${property_name}/${sub_folder}/${category_name}`,
          pushdata
        )
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
      alert("Added all Stories");
      setData({
        title: "",
        img: "",
        imgdesc: "",
        description: "",
        bounds: [],
        coordinates: [],
      });
    }
  };

  //setting coordinates and bounds for data
  useEffect(() => {
    setData({
      ...data,
      bounds: props.center,
      coordinates: [props.latpoints, props.lngpoints],
    });
  }, [props.latpoints, props.lngpoints, props.center]);

  //updating btn color based on data for prevbtn
  // pushdata && pushdata.length == 0 &&
  useEffect(() => {
    if (num == 0) {
      setblurprevbtn(true);
    } else {
      setblurprevbtn(false);
    }
  }, [num]);

  // console.log(blurprevbtn)
  // console.log(num)
  console.log(pushdata)

  return (
    <div className="sidebar">
      <div className="title">
        <h1>Talking Lands</h1>
      </div>
      <form className="story-form">
        <div className="dropdown-menu">
          <label>
            Choose your story
            <select
              className="select-menu"
              value={value}
              onChange={handleChange}
            >
              {labelOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <input
          onChange={handle}
          type="text"
          value={formvalues && formvalues.title}
          name="title"
          placeholder="Title of the Tale"
        />
        <input
          onChange={handle}
          type="text"
          value={formvalues && formvalues.imgdesc}
          placeholder="Imagesdesc"
          name="imgdesc"
        />
        <input
          onChange={handle}
          type="text"
          id="story"
          value={formvalues && formvalues.description}
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

        <button
          onClick={handlePrevstory}
          type="click"
          className={blurprevbtn ? "edt-btn-blur" : "edt-btn"}
        >
          Prev Story
        </button>

        <button onClick={handleAddstory} type="click" className="add-btn">
          {nxtbtn ? "Next Story" : "Add Story"}
        </button>

        <div id="slider-body">
          <ReactCardSlider slides={pushdata} />
        </div>

        <button onClick={handleOnCLick} type="click" id="submit-btn">
          Finalize Your Stories
        </button>

      </form>

      

      

    </div>
  );
}

export default Sidenav;
