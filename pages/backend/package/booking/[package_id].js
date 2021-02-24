import Link from 'next/link';
import Router,{ useRouter } from 'next/router';
import React, { useEffect, useState,useMemo } from 'react';
import Layout from '../../../../components/backend/layout/Layout';
import BookingAddress from '../../../../components/backend/package_booking/BookingAddress';
import BookingDate from '../../../../components/backend/package_booking/BookingDate';
import Checkbox from '../../../../components/widget/Checkbox';
import InputLabel from '../../../../components/widget/InputLabel';
import SelectLabel from '../../../../components/widget/SelectLabel';
import api from '../../../../utils/api-admin';
import { toDateISO,formToObject } from '../../../../utils/tools';
import {calPackagePrice,calDuration} from '../../../../utils/packageHelper'




const Index = (props) => {

  const [loading, setLodding] = useState(false);
  const [packages, setPackage] = useState(props.product);
  const [startDate, setStartDate] = useState(null);

  const [activeFrom, setActiveFrom] = useState(false);
  const [activeTo, setActiveTo] = useState(false);
  const [isBooking,setIsBooking] = useState(false)
  
  const [companies, setCompany] = useState([{id : 0 ,val : 0,name : 'FIT'}]);

  const [state,setState] = useState({
    date : toDateISO(new Date()),
    adult : 1,
    children : 0,
    start_time :'00:00',
    end_time : '02:00',
    canBook : true,
    available_boat : -1,
    addons:[],
    company_type_id : 0
  })

  const priceData = useMemo(() =>{
    return calPackagePrice(packages,{company_type_id : state.company_type_id},state.date,state.adult,state.children,
      calDuration(state.start_time,state.end_time)
    )
  },[packages,state])

  const total_price_addons = state.addons.reduce((total,current) => total+ parseInt(current.price)*current.quantity  , 0)

  const router = useRouter()
  const {package_id} = router.query;

  const fecthPackageOne = () => {
		setLodding(true);
		api.getPackageOne(package_id)
    .then(res=>{
      const data = res.data;
      setPackage(data);
      setLodding(false);
    })
    .catch(err => {
      setLodding(false);
      console.log(err.response);
    })
	}

  useEffect(() => {
    if(package_id)
      fecthPackageOne();
  }, [package_id])


  const fechCompany = () => {
    api.getCompany()
    .then(res=>{
      const data = res.data;
      var temp = [{id : 0 ,name : 'FIT',val : 0},...data.map(val => ({...val,val : val.id})  )]
      setCompany(temp);
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    fechCompany();
  },[]);
 

  const is_boat = true;


  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    // setStartDate(data);
    setState({...state,date : data})
  }

  const handleBook = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    var data = {
      ...formToObject(formData),
      product_id : packages.id,
      ...state,
    }

    if(price == -1){
      alert('Can not booking !')
      return;
    }
    setIsBooking(true)
    api.createBookingByAdmin(data)
    .then(res => {
      alert('Success')

      Router.push(`/backend/booking/detail/${res.data.booking.id}`)
      // setIsBooking(false)
      
      
    })
    .catch(err => {
      setIsBooking(false)
      alert('Error! Someting was wrong.')
      console.log(err.response || err)
    })
  }

  const onTimeChange = (key, val) =>{
    setState({...state,[key] : val })
  }

  const onDataChange = (e) =>{
    var {name,value} = e.target
    if(name === 'company_type_id' || name === 'adult' || name === 'children') value = parseInt(value)
    setState({...state,[name] : value})
  }

  const onAddonChange = (e) => {
    var {name,checked} = e.target;
    var id = name.split('-')[1]
    if(!id) return;
    var data = packages.products_addons.find(val => val.id == id)
    var tmp = [...state.addons]
    let index = state.addons.findIndex(val => val.id == id)
    if(checked){
      if(index === -1){
        tmp.push({...data,quantity : 1})
      }
    }
    else{
      if(index !== -1){
        tmp.splice(index,1)
      }
    }
    
    setState({...state,addons:tmp})
  }

  const onAmountAddonChange = (name,quantity) =>{
    var id = name.split('-')[1]
    if(!id) return;
    var tmp = [...state.addons]
    var data = packages.products_addons.find(val => val.id == id)
    let index = state.addons.findIndex(val => val.id == id)
    if(index === -1){
      tmp.push({...data,quantity})
    }
    else{
      tmp[index] = {...tmp[index],quantity}
    }
    
    setState({...state,addons:tmp})
  }

  console.log(packages);



  console.log('state',state)
  console.log('priceData',priceData)

  const {price} = priceData;

  return (
    <>
      <Layout title="Package" page_name="Package">
        <div className="row justify-content-start align-items-center">
          <div className="col-6">
            <h4>Admin Booking</h4>
          </div>
        </div>
        <div className="divider"></div>
        {
          packages ? (
            <>
              <div className="row">
                <div className="col-12">
                  <h5>Package Name : {packages.name}</h5>
                </div>
              </div>
              <div>
                <BookingDate startDate={state.date} showstartDate={showstartDate}
                activeFrom={activeFrom} setActiveFrom={setActiveFrom} onTimeChange={onTimeChange}
                activeTo={activeTo} setActiveTo={setActiveTo} state={state} is_boat={packages.is_boat} />
              </div>
              
              <div className="row mt-3">
                <div className="col-3">
                  <SelectLabel 
                  inputProps={{ 
                    className:'form-control', 
                    name : 'company_type_id', required : true,
                    value : state.company_type_id,
                    onChange: onDataChange
                  }} 
                  labelName="Company Type" icon={false} options={companies} />
                </div>
                <div className="col-3">
                  <InputLabel inputProps={{ 
                    className:'form-control', type : 'number',
                    name : 'adult', required : true, min : 0,
                    value : state.adult,
                    onChange: onDataChange
                  }} 
                  labelName="Adults  " iconProps={{className : 'fa icon icon-home'}} />
                </div>
                <div className="col-3">
                  <InputLabel inputProps={{ 
                    className:'form-control', type : 'number',
                    name : 'children', required : true, min : 0,
                    value : state.children,
                    onChange: onDataChange
                  }} 
                  labelName="Childrens " iconProps={{className : 'fa icon icon-home'}} />
                </div>
              </div>


              {
                (packages.products_addons && packages.products_addons.length > 0) ? (
                  <div className="row mt-4">
                    <div className="col-4">
                      <span>Addons</span>
                      <div className="box-adddd mt-2">
                        {
                          packages.products_addons.map(val => 
                            <Checkbox key={val.name} 
                            name={`addon-${val.id}`} 
                            checked={!!state.addons.find(item => item.id == val.id)}
                            value1={val.name} 
                            value2={parseInt(val.price) } 
                            onChange={onAddonChange} 
                            quantity={state.addons.find(item => item.id == val.id)?.quantity || 1}
                            description={val.description}
                            onAmountAddonChange={onAmountAddonChange} />
                          )
                        }
                      </div>
                    </div>
                  </div>
                ) : null
              }
              <div className="row mt-4">
                <div className="col-12">
                  <div className="my-2">
                    <span className="font-24px">Net Price  {price === -1 ? '' : price+total_price_addons } ฿ </span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleBook}>
                <div>
                  <BookingAddress />
                </div>
                
                <div className="row mt-4">
                  <div className="col-12">
                    <Link href={`/backend/package/edit/[d]`} as={`/backend/package/edit/${package_id}`}>
                      <a><button type="button" className="btn btn-outline-primary">Cancel</button></a>
                    </Link>
                    <button type="submit" disabled={isBooking || price === -1} className="btn btn-primary ml-3">Confirm</button>
                  </div>
                </div>
              </form>
            </>
          ) : null
        }
      </Layout>
    </>
  )
}


export default Index
