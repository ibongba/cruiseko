import Router from 'next/router';
import React, { useState } from 'react';
import { toDateISO } from '../../../utils/tools';
import SearchPackage from '../product/SearchPackage';

const Banner = (props) => {
  const {data} = props;
  const [active, setActive] = useState(false);
  const [type, setType] = useState('');
  const [state, setState] = useState({
    start_date : toDateISO(new Date()),
    end_date : toDateISO(new Date()),
    adult : 1,
    children : 0
  })
  
  const handleSubmit = (event) => {
    event.preventDefault();
    var data = new FormData(event.target);
    var activities = data.get('activities');
    var type = data.get('type');
    var dates = state.start_date+'>'+state.end_date;
    var adult = state.adult;
    var children = state.children;
    console.log(type);
    if(type == 'tour') {
      Router.push(`/search-package?activities=${activities}&dates=${dates}&adult=${adult}&children=${children}`);
    }else{
      Router.push(`/search-charter?activities=${activities}&dates=${dates}&adult=${adult}&children=${children}`);
    }
  }

  // console.log('home banner', data);

  const background = data?.banner ? data.banner : '../img/home_section_1.jpg'
  return (
    data ? (
      <>
        <section className="hero_single version_2" 
        style={{backgroundSize : 'cover',background : `url(${background}) center center no-repeat`}} >
          <div className="wrapper">
            <div className="container">
              <h3>Book unique experiences</h3>
              <p>Expolore top rated tours, hotels and restaurants around the world</p>
              <SearchPackage handleSubmit={handleSubmit}
              setActive={setActive} active={active}
              setState={setState} state={state} home={true}
              setType={setType} type={type} />
            </div>
          </div>
          {/* <style jsx>
          {`
            .hero_single.version_2:before {
              background: url(${data.banner ? data.banner : '../img/home_section_1.jpg'}) center center no-repeat;
              background-size: cover;
            }
          `}
          </style> */}
        </section>
      </>
    ) : null
  )
}
export default Banner