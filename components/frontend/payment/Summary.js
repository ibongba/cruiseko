
import React from 'react';
import Link from 'next/link';

const Summayry = (props) => {
  const {data,purchase,showButton} = props;

  console.log(data);

  var total_person = data && data.adult + data.children;

  return (
    data ? (
      <>
       
        <div id="total_cart">
          Total <span className="float-right"> {parseFloat(data.price).toFixed(2) }฿</span>
        </div>
        <ul className="cart_details">
          <li>Date <span> {data.date} </span></li>
          {
            data.is_boat == 1 && (
              <>
              <li>Time <span> {data.start_time} - {data.end_time} </span></li>
              <li>duration <span> {data.duration} hour(s) </span></li>
              </>
            )
          }
          <li>Adults <span> {data.adult} </span></li>
          <li>Childs <span>{data.children}</span></li>
        </ul>
        {!!(data.addons && data.addons.length > 0) && 
          (
            <>
              <span className="font-weight-bold">Addons</span>
              {data.addons.map(val =>  <div className="d-flex justify-content-between" key={val.name}> <span>{val.name}</span><span>{parseInt(val.price)} x {val.quantity}</span></div> )}
              <div className="mt-3" id="total_cart">Net Price <span className="float-right"> {parseFloat(data.net_price).toFixed(2) }฿</span></div>
            </>
          ) 
        }
        {showButton && <button type="button" className="btn_1 full-width purchase" onClick={purchase} >Purchase </button>}
        
        {/* <a href="cart-3.html" className="btn_1 full-width purchase">Purchase</a> */}
        {/* <div className="text-center"><small>No money charged in this step</small></div> */}
      </>
    ) : null
  )
}
export default Summayry