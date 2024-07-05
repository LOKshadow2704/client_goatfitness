import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import style from "./style.module.css";


const slideImages = [
  {
    url: 'https://i.imgur.com/fTx1DZv.jpeg',
  },
  {
    url: 'https://i.imgur.com/Gjolq1d.jpeg',
  },
  {
    url: 'https://i.imgur.com/Zq97NMJ.jpeg',

  },
];

function Slideshow (){
    return (
      <div className={style["slide-container"]}>
        <Slide >
         {slideImages.map((slideImage, index)=> (
            <div key={index} className={style["slide-item"]} >
              <img src={slideImage.url} alt=''/>
            </div>
          ))} 
        </Slide>
      </div>
    )
}

export default Slideshow;