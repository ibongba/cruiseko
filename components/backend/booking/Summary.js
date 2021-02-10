import React from 'react';
import tools from '../../../utils/tools';

const Summary = (props) => {
  const {data} = props;

  console.log(data)

  return (
    <>
      <h5>Summary</h5>
      <div className="sum-text"><span className="total">Total </span> <span className="total">{data.booking_details[0]?.price}</span></div>
      <div className="sum-text"><span>Date </span> <span>{data.start_date ? tools.formatDate(data.start_date,false,false) : null}</span></div>
      <div className="sum-text"><span>Adults </span> <span>{data.adult}</span></div>
      <div className="sum-text"><span>Childs </span> <span>{data.children}</span></div>

      {
        (data.booking_addons && data.booking_addons.length > 0) && (
          <div className="my-3">
            <div className="sum-text"><span className="addon">Addons</span></div>
            {data.booking_addons.map((val, index) => (
              <div className="sum-text" key={index}><span>{val.addon?.name} </span> <span>{val.price} x {val.quantity}</span></div>
            ))}
          </div>
        )
      }
      <div className="sum-text"><span className="total">Net Price </span> <span className="total">{data.net_price}</span></div>

      
    </>
  )
}

export default Summary