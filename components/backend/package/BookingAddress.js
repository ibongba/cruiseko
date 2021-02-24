import React from 'react';

const BookingAddress = (pros) => {
  
  return (
    <>
      <div className="row mt-4 justify-content-start">

        <div className="col-12">
          <h5>Details</h5>
        </div>
        <div className="col-6">
          <div className="form-group mb-2">
            <label>First name <span className="text-danger">*</span></label>
            <input type="text" className="form-control" id="firstname_booking" name="user_firstname" required />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group mb-2">
            <label>Last name <span className="text-danger">*</span></label>
            <input type="text" className="form-control" id="lastname_booking" name="user_lastname" required  />
          </div>
        </div>

        <div className="col-6">
          <div className="form-group mb-2">
            <label>Email <span className="text-danger">*</span></label>
            <input type="email" id="email_booking" name="user_email" className="form-control" required />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group mb-2">
            <label>Telephone <span className="text-danger">*</span></label>
            <input type="text" id="telephone_booking" name="user_phone" className="form-control" required  />
          </div>
        </div>
      </div>

      <div className="row mt-4 justify-content-start">
        <div className="col-12">
          <h5>Billing Address</h5>
        </div>
        <div className="col-6">
          <div className="form-group mb-2">
            <label>Address</label>
            <input type="text" id="address" name="address" className="form-control" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group mb-2">
            <label>Sub District</label>
            <input type="text" id="sub_district" name="sub_district" className="form-control" />
          </div>
        </div>
      
        <div className="col-6">
          <div className="form-group mb-2">
            <label>District</label>
            <input type="text" id="district" name="district" className="form-control" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group mb-2">
            <label>Province</label>
            <input type="text" id="province" name="province" className="form-control"  />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group mb-2">
            <label>Postal code</label>
            <input type="text" id="postal_code" name="postal_code" className="form-control" />
          </div>
        </div>
      </div> 
    </>  
  )
}

export default BookingAddress