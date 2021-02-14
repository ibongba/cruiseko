
import Router from 'next/router';
import React, {useEffect,useState, useContext} from 'react';
import SelectAmount from '../../widget/SelectAmount'
import SelectTime from '../../widget/SelectTime'
import Checkbox from '../../widget/Checkbox'
import UserContext from '../../../contexts/UserContext';
import AuthService from '../../../utils/AuthService';
import LoginModal from '../../../components/frontend/login/Modal';
import {errors} from '../../../utils/packageHelper'

const Price = (props) => {
  const {error,state,setState,checkout, is_boat,addons=[],total_price_addons, packages} = props;
  const [active, setActive] = useState(false);
  const [activeFrom, setActiveFrom] = useState(false);
  const [activeTo, setActiveTo] = useState(false);
  const { user, fetchUser } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);

  // const [date,setDate] = useState()
  const {price,unit,boat_amt,error : price_error,error_payload} = props.priceData; 
  const qtySum = () => {
    var arr = document.getElementsByName('qtyInput');
    var tot=0;
    for(var i=0;i<arr.length;i++){
        if(parseInt(arr[i].value))
            tot += parseInt(arr[i].value);
    }

    var cardQty = document.querySelector(".qtyTotal");
    cardQty.innerHTML = tot;
  } 
  
  
  useEffect(() => {
    $('input[name="dates"]').daterangepicker({
		  autoUpdateInput: true,
		  parentEl:'.scroll-fix',
		  singleDatePicker: true,
		  autoApply: true,
		  minDate:new Date(),
		  showCustomRangeLabel: false,
		  locale: {
	        format: 'MM-DD-YYYY'
	      }
      }, 
      function(start, end, label) {
        setState({...state,date : start.format('YYYY-MM-DD')})
		    // console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('DD-MM-YYYY') + ' (predefined range: ' + label + ')');
		  });
  },[]);
  useEffect(() => {
    qtySum();
    function removeAnimation() { $(".qtyTotal").removeClass("rotate-x"); }
    const counter = document.querySelector(".qtyTotal");
    counter.addEventListener("animationend", removeAnimation);
  },[state.adult, state.children]);


  const handleButton = (key, btn) => {
    $(".qtyTotal").addClass("rotate-x");
    var oldValue = state[key];
    // alert(btn)
    if (btn == 'plus') {
      var newVal = parseInt(oldValue) + 1;
    } 
    else {
      if (oldValue > 0) {
        var newVal = parseInt(oldValue) - 1;
      } 
      else {
        newVal = 0;
      }
    }
    if(key === 'adult' && newVal === 0)
      newVal = 1;
    if(key === 'children' && newVal === 0)
      newVal = 0;
    setState({...state,[key] :newVal })
  }

  const onTimeChange = (key, val) =>{
    setState({...state,[key] : val })
  }

  const onAddonChange = (e) => {
    var {name,checked} = e.target;
    var id = name.split('-')[1]
    if(!id) return;
    var data = addons.find(val => val.id == id)
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
    var data = addons.find(val => val.id == id)
    let index = state.addons.findIndex(val => val.id == id)
    if(index === -1){
      tmp.push({...data,quantity})
    }
    else{
      tmp[index] = {...tmp[index],quantity}
    }
    
    setState({...state,addons:tmp})
  }

  



  return (
    <>
      <div className="box_detail booking">
        <div className="price">
          {price !== -1 && <span> {price} ฿ <small>{unit}</small> </span>}
          <div className="score"><span><em>{packages.review_count} Reviews</em></span><strong>{packages.rating ? parseFloat(packages.rating).toFixed(1) : '0.0'}</strong></div>
        </div>
        {boat_amt && <div className="mb-2"> <span>Boat amount : </span>{boat_amt} </div> }
        
        <div className="form-group input-dates">
          <input className="form-control" type="text" name="dates" placeholder="When.." />
          <i className="icon_calendar"></i>
        </div>
        {
          is_boat ? (
            <div className="d-flex">
              <SelectTime active={activeFrom} setActive={setActiveFrom} onTimeChange={onTimeChange} value={state.start_time} name={'start_time'} />
              <SelectTime active={activeTo} setActive={setActiveTo} onTimeChange={onTimeChange} value={state.end_time} name={'end_time'} />
            </div>
          ) : null
        }
        <div>
          <SelectAmount active={active} setActive={setActive} handleButton={handleButton} state={state} />
        </div>

        {
          (addons && addons.length > 0) ? (
            <div>
              <span>Addons</span>
              <div className="mt-2">
                {
                  addons.map(val => 
                    <Checkbox key={val.name} 
                    name={`addon-${val.id}`} 
                    checked={!!state.addons.find(item => item.id == val.id)}
                    value1={val.name} 
                    value2={parseInt(val.price) } 
                    onChange={onAddonChange} 
                    quantity={state.addons.find(item => item.id == val.id)?.quantity || 1}
                    
                    onAmountAddonChange={onAmountAddonChange} />
                  )
                }
              </div>
            </div>
          ) : null
        }
        

          {state.available_boat === 0 && <small className="text-danger my-3" > Not enough boats </small>} 

          {price_error === errors.MIN_HOUR_BOAT && <small className="text-danger my-3" > Minimum rental hours : {error_payload.min_hour}  </small>} 

          {
          price !== -1 && 
          (
            <div className="my-2">
              {<span className="font-24px">Net Price {price+total_price_addons} ฿ </span>}
            </div>
          )
          }
          
          

        {
          process.browser &&  AuthService.isLoggin() ? (
            <button type="button" disabled={price === -1 || !state.canBook} className={`btn_1 full-width purchase ${(price === -1 || !state.canBook) ? 'disabled' : ''}`} onClick={checkout}>Purchase</button>
          ) : (
            <button type="button" className="btn_1 full-width purchase" onClick={() => setShowLogin(true)}>Purchase</button>
          )
        }
        <div className="text-center"><small>No money charged in this step</small></div>
      </div>

      <LoginModal show={showLogin}
          size="md" onHide={() => setShowLogin(false)}/>
    </>
  )
}
export default Price