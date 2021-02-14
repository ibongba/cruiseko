import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';
import SuccessDialog from '../../widget/ModalSuccessDialog';
import api from '../../../utils/api-admin'

const Dialog = ({show, onHide, size, bookings}) => {
  const {slips} = bookings;
  const [modalSuccess, setModalSuccess] = useState(false);
  

  const handleSave = (event) => {
    event.preventDefault();
    var id = slips[0]?.id;
    var data = new FormData(event.target)
    data.append('booking_id', bookings.id);

    api.updateBookingSlip(id, data)
    .then(res=>{
      const data = res.data;
      setModalSuccess(true);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  

  console.log('slips', slips);

  return (
    <Modal className="modal-alert" centered show={show} onHide={onHide} size={size}>
      <Modal.Header>
        <h4>Manage Tranfer Slip</h4>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSave}>
          <div className="row mt-4 justify-content-start">

            <div className="col-12">
              <div className="text-left">
                <label>Tranfer Slip</label>
                <div className="box-slip">
                  <img src={slips[0]?.image ? slips[0]?.image : "/template/img/no-picture.png"} className="img-fluid" />
                </div>
              </div>
            </div>

            <div className="col-12 mt-4">
              <div className="text-left">
                <label>Tranfer Date : {slips[0]?.tranfer_date}</label>
              </div> 
            </div> 

            <div className="col-12">
              <div className="text-left">
                <label>From Bank : {slips[0]?.from_bank}</label>
              </div> 
            </div> 
            

            <div className="col-12">
              <div className="text-left">
                <label>To Bank : {slips[0]?.to_bank}</label>
              </div> 
            </div> 

            <div className="col-12">
              <div className="text-left">
                <label>Tranfer Amount : {slips[0]?.amount} ฿</label>
              </div> 
            </div> 

            <div className="border-bottom"></div>

            <div className="col-12">
              <div className="form-group">
                <input type="radio" name="status" value="2" required /> Approve
                <input type="radio" name="status" value="0" required className="ml-4" /> Cancel
              </div>
            </div>

          </div> 

          <div className="row mt-4 justify-content-center">
            <div className="col-12 mb-4">
              <div className="text-center">
                <button type="button" className="btn btn-outline-primary mr-4" onClick={onHide}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm</button>
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