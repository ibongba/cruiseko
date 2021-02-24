import React from 'react';

const Detail = (props) => {
  const {data} = props;

  return (
    <div className="detail">
      <h5>Booking Details</h5>
      <p className="mb-1"><span>Booking NO. : </span> {data.booking_details[0]?.booking_id}</p>
      <p className="mb-1"><span>Package Name : </span> {data.booking_details[0]?.product?.name}</p>
      <p className="mb-1"><span>Booking by : </span> {data.booking_by}</p>
    </div>
  )
}

export default Detail