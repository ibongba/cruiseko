
import React,{useContext} from 'react';
import Link from 'next/link';
import UserContext from '../../../contexts/UserContext';
import {calPackagePriceCard} from '../../../utils/packageHelper'

const ProductCard = (props) => {
  const {packages} = props;
  const { user } = useContext(UserContext);

  // console.log('price',calPackagePriceCard(packages,user))
  const {price,unit} = calPackagePriceCard(packages,user)
  return (
    packages ? (
      <>
        <div class="col-xl-4 col-lg-6 col-md-6 mt-4">
          <div class="box_grid">
            <figure>
              {/* <a href="#0" class="wish_bt"></a> */}
              <Link href="/product-details/[id]" as={`/product-details/${packages.id}`}>
                <a>
                  <img src={packages.picture ? packages.picture : "/template/img/tour_1.jpg"} class="img-fluid" alt="" width="800" height="533"/>
                  <div class="read_more"><span>Read more</span></div>
                </a>
              </Link>
              <small>Historic</small>
            </figure>
            <div class="wrapper">
              <h3>
              <Link href="/product-details/[id]" as={`/product-details/${packages.id}`}>
                <a className="show-color">{packages.name ? packages.name : null}</a>
              </Link>
              </h3>
              <p className="short-description">{packages.short_description ? packages.short_description : null}</p>
              {
                price !== -1 ? (
                  <span class="price"> From <strong> {parseInt(price) } </strong> /per {unit} </span>
                )
                : <span class="price"></span>
              }
              
            </div>
            <ul>
              <li><i class="icon_clock_alt"></i> 1h 30min</li>
              <li><div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div></li>
            </ul>
          </div>
        </div>
      </>
    ) : null
  )
}
export default ProductCard