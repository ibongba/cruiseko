
import React,{useState,useMemo,useContext, useEffect} from 'react';
import Router from 'next/router'
import EditorData from './EditorData';
import ImageGallery from './ImageGallery';
import MainEvent from './MainEvent';
import Review from './Review';
import Price from './Price';
import Remark from './Remark';
import Boat from './Boat';
import {toDateISO} from '../../../utils/tools'
import {calPackagePrice,calDuration} from '../../../utils/packageHelper'
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api'
import ProductCard from '../product/ProductCard'


const Detail = (props) => {
  const {packages} = props;
  const [reviews, setReview] = useState(false);
  const [related,setRelated] = useState({
    data : null,
    error : false,
    loading : false
  })
  const [state,setState] = useState({
    date : toDateISO(new Date()),
    adult : 1,
    children : 0,
    start_time :'00:00',
    end_time : '01:00',
    canBook : true,
    available_boat : -1,
    addons:[]
  })
  const { user } = useContext(UserContext);

  const priceData = useMemo(() =>{
    return calPackagePrice(packages,user,state.date,state.adult,state.children,
      calDuration(state.start_time,state.end_time)
    )
  },[packages,state,user])

  const total_price_addons = state.addons.reduce((total,current) => total+ parseInt(current.price)*(state.adult+state.children)  , 0)
  

  const checkout = () => {
    var checkout_dt = {
      product_id : packages.id,
      is_boat : packages.is_boat,
      ...state,
      name : packages.name,
      price : priceData.price,
      net_price : priceData.price + total_price_addons,
      expired_at : (new Date()).getTime() + 15 * 60 * 1000 ,
      duration : packages.is_boat ? calDuration(state.start_time,state.end_time) : ''
    }
    localStorage.setItem('checkout_dt',JSON.stringify(checkout_dt))
    Router.push('/user/check-out');
  }

  useEffect(()=>{
    if(!state.date || !state.start_time || !state.end_time || !packages) return
    if(packages.is_boat != 1) return;

    const {date,start_time,end_time} = state;
    var [hour_start,min_start] = start_time.split(':')
    var [hour_end,min_end] = end_time.split(':')
    var rental_start = new Date(date) 
    var rental_end = new Date(date) 
    rental_start.setHours(hour_start,min_start)
    rental_end.setHours(hour_end,min_end)
    api.checkAvailableBoat({boat_id:packages.products_boats[0]?.boat_id ,date,
      start_time:rental_start,end_time :rental_end
    })
    .then(res => {
      // console.log(res.data)
      const {available_boat} = res.data
      setState({...state,canBook : !!available_boat,available_boat})
    })
    .catch(err=>{
      console.log(err.response)
    })
  },[packages,state.date,state.end_time,state.start_time])

  useEffect(() => {
    if(!packages) return;
    fetchReview();
    fetchRelated();
  }, [packages])

  // console.log('packages', packages);
  const fetchReview = ()=>{
    if(!packages) return;
    var params = {'product_id' : packages.id}
    api.getReviewPackage(params)
    .then(res => {
      const data= res.data;
      setReview(data);
    })
    .catch(err=>{
      console.log(err.response || err)
    })
  }

  const fetchRelated = ()=>{
    if(!packages) return;

    setRelated({...related,loading:true})
    api.getRelatedPackage(packages.id)
    .then(res => {
      const data= res.data;
      console.log('related',data)
      setRelated({data , loading:false})
    })
    .catch(err=>{
      setRelated({loading:false,error : true})
      console.log(err.response || err)
    })

  }
  
  return (
    <>
      <div className="bg_color_1">
        {/* <nav className="secondary_nav sticky_horizontal">
          <div className="container">
            <ul className="clearfix">
              <li><a href="#description" className="active">Description</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#sidebar">Booking</a></li>
            </ul>
          </div>
        </nav> */}
        <div className="container margin_60_35">
          <div className="row">
            <div className="col-lg-8">
              <section id="description">
                
                <EditorData name="Description" data={packages?.description} />
                {/* <EditorData name="Highlight" data={packages?.highlight} />
                <EditorData name="Itinerary" data={packages?.itinerary} /> */}

                <ImageGallery packages={packages} />
                <MainEvent packages={packages} />
                {
                  packages ? (
                    <Boat data={packages.products_boats[0]} />
                  ) : null
                }

                <Remark data={packages?.remark} />
              </section>
              {
                reviews && reviews.count > 0 ? (
                  <>
                    <section id="reviews">
                      <Review reviews={reviews} packages={packages} />
                    </section>
                    <hr />
                  </>
                ) : null
              }
              
                
            </div>
            <aside className="col-lg-4" id="sidebar">
              <Price state={state} setState={setState} 
              priceData={priceData} checkout={checkout} 
              total_price_addons={total_price_addons}
              addons={packages?.products_addons ?? []} is_boat={packages?.is_boat}
              packages={packages} />
            </aside>
          </div>
        </div>

        {!!related.data && !!related.data.length && (
          <div className="container">
            <div className="row">
                <div className="col-12">
                  <h3>Related Packages</h3>
                </div>
            </div>
            <div className="wrapper-grid">
                <div className="row">
                  {
                    (related.data) ? related.data.map((val, index) => (
                      <ProductCard key={val.id} packages={val} />
                    )) : null
                  }
                </div>
            </div>
          </div>
        )}

        
      </div>
    </>
  )
}
export default Detail