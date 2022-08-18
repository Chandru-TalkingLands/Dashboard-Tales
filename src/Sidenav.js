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

  const fileInputRef = useRef(null);
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
  const [formvalues, setformvalues] = useState();
  const [currentval, setcurrentval] = useState();


  const labelOptions = [
    { id: 1, label: "Amenities", value: "Amenities" },
    { id: 2, label: "Nearby Project", value: "Nearby Project" },
  ];

  var Imageurl = `https://rdfolder.s3.ap-south-1.amazonaws.com/`;

  // const northeast = [props.nelat , props.newlng]
  // const southwest = [props.swlat , props.swlng]

  //updating form data
  const handleChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  //handling all inputs
  function handle(e) {
    const newData = e.target.value;
    // console.log(e.target.value)
    setcurrentval(newData);
    setData({
      ...data,
      [e.target.name]: newData,
    });

    
    if (e.target.value) {
      setformvalues({
        [e.target.name]: e.target.value,
      });
      const data = pushdata.map((val) => {
        if (val.id == pushdata[num]?.id) {
          console.log();
          pushdata[num] = { ...pushdata[num], [e.target.name]: e.target.value };
        }
      });
    } else {
      setformvalues({ [e.target.name]: "" });
    }
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
        setnum,
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
    setformvalues(pushdata[val]);
  };

  //change add button and next button dynamically
  useEffect(() => {
    if (num != addnum) {
      setnxtbtn(true);
    } else {
      setnxtbtn(false);
      // setformvalues(currentval)
    }
  }, [addnum, num]);

  //Add button or Next button
  const handleAddstory = (e) => {
    e.preventDefault();
    var val = 0;
    if (num == addnum) {
      if (!props?.latpoints ) {
        // console.log(data.img
        alert("Please select marker and Image");
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
        // console.log(pushdata[val]);
        return val + 1;
      }
    } else {
      val = num + 1;
      console.log(val);
      setnum(val);
      setformvalues(pushdata[val]);
    }
  };


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
      
    }
  };

  //handling delete
  const handleDelete = (e, position) => {
    e.preventDefault();
    console.log(position);
    let property_name = "Banglore";
    let sub_folder = "Tales";
    let category_name = value;
    let imgKey = pushdata[position]?.img;
    let imglength = imgKey.split("/").length;
    let file_key = imgKey.split("/")[imglength - 1];
    console.log(file_key);
    axios
      .delete(
        `http://localhost:7000/delete/file/${property_name}/${sub_folder}/${category_name}/${file_key}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    let item = [];
    pushdata.filter((data) => {
      if (data.title != pushdata[position].title) {
        item.push(data);
      }
    });
    setaddnum(addnum - 1);
    if (position > 1) {
      let val = position - 1;
      setformvalues(pushdata[val]);
    } else if (position <= 1) {
      let val = position + 1;
      setformvalues(pushdata[val]);
    } else {
      setformvalues("");
    }

    setpushdata(item);
    console.log(pushdata);
    alert("Deleted Successfully");
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
  useEffect(() => {
    if (num == 0) {
      setblurprevbtn(true);
    } else {
      setblurprevbtn(false);
    }
  }, [num]);


  //checking code for Inputs
  const handleInputs = (e,data)=>{
    console.log(e.target.value) 
    pushdata.map(item =>{
      if(item.id == data.id){
        console.log("Hiiiii IAM IN")
        
      }
    })
  }

  

  return (
    <div className="sidebar">
      <div className="title">
        <h1>Talking Lands</h1>
      </div>

      <div className="story-form">
        <div className="dropdown-menu">
          {/* <label>
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
          </label> */}
          <button onClick={(e) => handleDelete(e,num)}>Delete</button>
          <p>{pushdata && pushdata.length}</p>
        </div>

        <form>
          <input
            onChange={handle}
            type="text"
            value={formvalues && formvalues.title}
            name="title"
            placeholder="Title of the Tale"
          />
          {/* <input
          onChange={handle}
          type="text"
          value={formvalues && formvalues.imgdesc}
          placeholder="Imagesdesc"
          name="imgdesc"
        /> */}
          <input
            onChange={handle}
            type="textarea"
            value={formvalues && formvalues.description}
            name="description"
            placeholder="Enter your story"
            // style={{ height: 80 }}
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
        </form>
      </div>

      <div className="view-edit-card" >
        {pushdata.map((data) => {
          // setupdateinputs(data)
          return (
            <div key={data.id} className="view-edit-form" style={{backgroundImage:`url(${Imageurl + data.img})`}}>
              <form>
                <input  type="text" placeholder="Title " name="title" value={data.title} onChange={(e)=>handleInputs(e,data)}/>
                <input type="text" placeholder="Description" description="description" value={data.description} onChange={(e)=>handleInputs(e,data)}/>
                {/* <img src={Imageurl + data.img} width="150px" height="200px" /> */}
              </form>
            </div>
          );
        })}
      </div>

      <button onClick={handleOnCLick} type="click" id="submit-btn">
        Push Story
      </button>
    </div>
  );
}

export default Sidenav;
