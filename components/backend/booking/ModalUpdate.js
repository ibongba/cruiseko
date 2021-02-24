import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';
import SuccessDialog from '../../widget/ModalSuccessDialog';
import api from '../../../utils/api-admin'

const Dialog = ({show, onHide, size, bookings, getBookingOne}) => {
  // const {slips} = bookings;
  const [modalSuccess, setModalSuccess] = useState(false);
  

  const handleSave = (event) => {
    event.preventDefault();
    var booking_id = bookings.id;
    const data = new FormData(event.target);
    alert(booking_id);

    api.updateBooking(booking_id, data)
    .then(res=>{
      const data = res.data;
      setModalSuccess(true);
      getBookingOne();
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  

  console.log('bookings', bookings  );

  return (
    <Modal className="modal-alert" centered show={show} onHide={onHide} size={size}>
      <Modal.Header>
        <h4>Edit User</h4>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSave}>
          <div className="row mt-4 justify-content-start">

        
            <div className="col-6">
              <div className="form-group mb-2">
                <label>First name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="firstname_booking" name="user_firstname" defaultValue={bookings.user_firstname} required />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-2">
                <label>Last name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="lastname_booking" name="user_lastname" defaultValue={bookings.user_lastname} required  />
              </div>
            </div>
  
            <div className="col-6">
              <div className="form-group mb-2">
                <label>Email <span className="text-danger">*</span></label>
                <input type="email" id="email_booking" name="user_email" className="form-control" defaultValue={bookings.user_email} required />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-2">
                <label>Telephone <span className="text-danger">*</span></label>
                <input type="text" id="telephone_booking" name="user_phone" className="form-control" defaultValue={bookings.user_phone} required  />
              </div>
            </div>


            <div className="col-6">
              <div className="form-group mb-2">
                <label>Address</label>
                <input type="text" id="address" name="address" className="form-control" defaultValue={bookings.booking_address?.address} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-2">
                <label>Sub District</label>
                <input type="text" id="sub_district" name="sub_district" className="form-control" defaultValue={bookings.booking_address?.sub_district} />
              </div>
            </div>
         
            <div className="col-6">
              <div className="form-group mb-2">
                <label>District</label>
                <input type="text" id="district" name="district" className="form-control" defaultValue={bookings.booking_address?.district} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-2">
                <label>Province</label>
                <input type="text" id="province" name="province" className="form-control" defaultValue={bookings.booking_address?.province} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-2">
                <label>Postal code</label>
                <input type="text" id="postal_code" name="postal_code" className="form-control" defaultValue={bookings.booking_address?.postal_code} />
              </div>
            </div>
          </div> 

          <div className="row mt-4 justify-content-center">
            <div className="col-12 mb-4">
              <div className="text-center">
                <button type="button" className="btn btn-outline-primary mr-4" onClick={onHide}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </div>
          </div>
        </form>
        <SuccessDialog show={modalSuccess}
          text="Successfully saved data !!!"
          size="md" onHide={() => setModalSuccess(false)}
          route={"/backend/booking"} />
      </Modal.Body>
    </Modal>  
  )
}

export default Dialog