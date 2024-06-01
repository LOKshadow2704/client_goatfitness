import React from 'react';
import style from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function StarRating ({ rating }) {
  return (
    <div className={style["star-rating"]}>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <span key={index} className={index <= rating ? style['on'] : style['off']}>
            <FontAwesomeIcon icon={faStar} />
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
