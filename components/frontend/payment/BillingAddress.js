
import React from 'react';
import Link from 'next/link';

const BillingAddress = (props) => {
  const {packages} = props;

  return (
    packages ? (
      <>
        <div className="form_title">
          <h3><strong>2</strong>Billing Address</h3>
          <p>
            Mussum ipsum cacilds, vidis litro abertis.
          </p>
        </div>
        <div className="step">

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Address</label>
                <input type="text" id="address" name="address" className="form-control" />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>Sub District</label>
                <input type="text" id="sub_district" name="sub_district" className="form-control" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <label>District</label>
                <input type="text" id="district" name="district" className="form-control" />
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="form-group">
                <label>Province</label>
                <input type="text" id="province" name="province" className="form-control" />
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="form-group">
                <label>Postal code</label>
                <input type="text" id="postal_code" name="postal_code" className="form-control" />
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