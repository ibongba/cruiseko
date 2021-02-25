import { useRouter } from 'next/router';
import React, { useEffect,useState } from 'react';
import Layout from '../../../../components/backend/layout/Layout';
import Print from '../../../../components/backend/report/print'
import api from '../../../../utils/api-admin'
import Summary from '../../../../components/backend/booking/Summary'
import Detail from '../../../../components/backend/booking/Detail';
import UserBooking from '../../../../components/backend/booking/UserBooking';
import ModalSlip from '../../../../components/backend/booking/ModalSlip';
import ModalUpdate from '../../../../components/backend/booking/ModalUpdate';
import {isCancel} from '../../../../utils/packageHelper'

const Index = (props) => {
  const [bookings, setBooking] = useState();
  const [show, setShow] = useState();

  const [modal, setModal] = useState();

  const router = useRouter();
  const {id} = router.query;

  const getBookingOne = () => {
    api.getBookingOne(id)
    .then(res => {
      setBooking(res.data)
      // console.log('data',res.data)
    })
    .catch(err=>{
      console.log(err.response || err)
    })
  }

  useEffect(() => {
    if(!id) return;
    getBookingOne();
  }, [id]);

  
   // console.log(bookings);


  return (
    <>
      <Layout title="Booking Details" page_name="Bookings" sub_page="details" main_link="booking">
        {
          bookings ? (
            <>
              <div className="row justify-content-between align-items-center px-3">
                <div className="d-flex align-items-center">
                  <h4>Booking Details</h4>
                  <div className="ml-4">
                    {
                    
                    bookings.payment_status == 2 ? 
                    <span className="text-success">(Success)</span> :
                    isCancel(bookings) ? 
                    <span className="text-danger">(Cancel)</span> :
                    <span className="text-warning">(Pending)</span> 
                    
                    
                    }
                    </div>
                </div>
                <div className="">
                  <Print  data={bookings} />
                </div>
              </div>
              <div className="divider"></div>

              <div className="row justify-content-center">
                <div className="col-lg-9 col-12">
                  <div>
                    <Detail data={bookings} />
                  </div>
                  <div className="mt-4">
                    <UserBooking data={bookings} setModal={setModal} />
                  </div>
                </div>
                <div className="col-lg-3 col-12">
                  <Summary data={bookings} />
                </div>
              </div>

              {
                (bookings.payment_status == 1 && bookings.slips.length > 0) && (
                  <button className="btn btn-primary mt-3" onClick={() => setShow(true)}>Check Tranfer Slip</button>
                )
              }
              <div>

              </div>
              <ModalSlip show={show}
                size="md" onHide={() => setShow(false)} bookings={bookings} />

              <ModalUpdate show={modal}
                size="lg" onHide={() => setModal(false)} bookings={bookings} getBookingOne={getBookingOne} />
            </>
          ) : null
        }
        
      </Layout>
    </>
  )
}


export default Index
