
import React from 'react';
import Link from 'next/link';

const BillingAddress = (props) => {
  const {packages} = props;

  return (
    packages ? (
      <>
        <div className="form_title">
          <h3><strong>1</strong>Your Details</h3>
          <p>
            Mussum ipsum cacilds, vidis litro abertis.
          </p>
        </div>
        <div className="step">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>First name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="firstname_booking" name="user_firstname" required />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>Last name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="lastname_booking" name="user_lastname" required  />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Email <span className="text-danger">*</span></label>
                <input type="email" id="email_booking" name="user_email" className="form-control" required />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>Telephone <span className="text-danger">*</span></label>
                <input type="text" id="telephone_booking" name="user_phone" className="form-control" required  />
              </div>
            </div>
          </div>
        </div>
        <hr />
      </>
    ) : null
  )
}
export default BillingAddress