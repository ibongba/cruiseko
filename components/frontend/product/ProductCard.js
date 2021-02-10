
import React,{useContext, useEffect} from 'react';
import Link from 'next/link';
import UserContext from '../../../contexts/UserContext';
import {calPackagePriceCard} from '../../../utils/packageHelper'
import tools from '../../../utils/tools'

const ProductCard = (props) => {
  const {packages, is_slick = false} = props;
  const { user } = useContext(UserContext);

  // console.log('pkg',packages)
  // console.log('price',calPackagePriceCard(packages,user))
  
  const {price,unit} = calPackagePriceCard(packages,user);

  var text_time = '';

  if(packages){
		var total;
		var totalHours = '';
		var totalMins = '';
		if(packages.start_time && packages.end_time) {
			var startTime = packages.start_time;
			var endTime = packages.end_time;
			total = tools.calculate(startTime, endTime);
			var time = total.split(':');
			totalHours = parseInt(time[0], 10);
			totalMins = parseInt(time[1], 10);
			var text_time = (totalHours > 0 ? totalHours+'h ' : '') +  (totalMins > 0 ? totalMins+'min' : '')
		}else {
			text_time = '';
		}
  }

  console.log('card', packages);

  return (
    packages ? (
      <>
        <div className={`${!is_slick ? "col-xl-4 col-lg-6 col-md-6" : 'mr-4'} card-top`}>
          <div className="box_grid">
            <figure>
              {/* <a href="#0" className="wish_bt"></a> */}
              <Link href={`/package-details/[id]`} as={`/package-details/${packages.id}-${packages.name}`}>
                <a>
                  <img src={packages.picture ? packages.picture : "/template/img/tour_1.jpg"} className="img-fluid" alt="" width="800" height="533"/>
                  <div className="read_more"><span>Read more</span></div>
                </a>
              </Link>
              <small>{packages.products_category?.name}</small>
            </figure>
            <div className="wrapper">
              <h3>
              <Link href={`/package-details/[id]`} as={`/package-details/${packages.id}-${packages.name}`}>
                <a className="show-color">{packages.name ? packages.name : null}</a>
              </Link>
              </h3>
              <p className="short-description">{packages.short_description ? packages.short_description : null}</p>
              {
                price !== -1 ? (
                  <span className="price"> From <strong> {parseInt(price) } </strong> / per {unit} </span>
                )
                : <span className="price"></span>
              }
              
            </div>
            <ul>
              <li>{text_time ? (<><i className="icon_clock_alt"></i> {text_time}</>) : ''}</li>
              <li><div className="score"><span><em>{packages.review_count} Reviews</em></span><strong>{packages.rating ? parseFloat(packages.rating).toFixed(1) : '0.0'}</strong></div></li>
            </ul>
          </div>
        </div>
      </>
    ) : null
  )
}
export default ProductCard