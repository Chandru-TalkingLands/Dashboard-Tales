import React from "react";
import "./Slider.css"
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

// MUI DELETE BTN IMPORTS
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';


const ReactCardSlider = (props) => {

    const slideLeft = () => {
        var slider = document.getElementById("slider");
        slider.scrollLeft = slider.scrollLeft - 330;
    }

    const slideRight = () => {
        var slider = document.getElementById("slider");
        slider.scrollLeft = slider.scrollLeft + 330;
    }

    return (
        <div id="main-slider-container">
            <MdChevronLeft size={40} className="slider-icon left" onClick={slideLeft} />
            <div id="slider">
                {
                    props.slides.map((slide, index) => {
                        console.log(slide)
                        return (
                            <div className="slider-card" key={index} onClick={() => slide.clickEvent()}>

                                <div className="slider-card-image" style={{ backgroundImage: `url(${slide.img})`, backgroundSize: 'cover' }}></div>
                                {/* <Button className="btn" variant="outlined" startIcon={<DeleteIcon/>}>
                                    Delete
                                </Button> */}
                                <div id="w74">
                                <p className="slider-card-title">{slide.title}</p>
                                <p className="slider-card-description">{slide.description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <MdChevronRight size={40} className="slider-icon right" onClick={slideRight} />
        </div>
    );
}

export default ReactCardSlider