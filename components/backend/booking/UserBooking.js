import React from 'react';

const UserBooking = (props) => {
  const {data, setModal} = props;

  // console.log(data);

  return (
    <div className="detail">
      <div className="d-flex align-items-center">     
        <h5>User Booking</h5>
        <div className="ml-3">
          <button type="button" className="btn btn-manage" onClick={() => setModal(true)}>Edit</button>
        </div>
      </div>
      <p className="mb-1"><span>User ID : </span> {data.user_id}</p>
      <p className="mb-1"><span>Name : </span> {data.user_firstname} {data.user_lastname}</p>
      <p className="mb-1"><span>Email : </span> {data.user_email}</p>
      <p className="mb-1"><span>Phone : </span> {data.user_phone}</p>
      {
        data.booking_address ? (
          <div className="mt-4">
            <h5>User Address</h5>
            <p className="mb-1"><span>Address : </span> {data.booking_address.address ? data.booking_address.address : '-'}</p>
            <p className="mb-1"><span>Sub District : </span> {data.booking_address.sub_district ? data.booking_address.sub_district : '-'}</p>
            <p className="mb-1"><span>District : </span> {data.booking_address.district ? data.booking_address.district : '-'}</p>
            <p className="mb-1"><span>Province : </span> {data.booking_address.province ? data.booking_address.province : '-'}</p>
            <p className="mb-1"><span>Postal Code : </span> {data.booking_address.postal_code ? data.booking_address.postal_code : '-'}</p>
          </div>
        ) : null
      }
    </div>
  )
}

export default UserBooking