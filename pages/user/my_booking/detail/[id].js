import { useRouter } from 'next/router';
import React, { useEffect,useState } from 'react';
import Layout from '../../../../components/frontend/layout/Layout';
import Print from '../../../../components/backend/report/print'
import api from '../../../../utils/api'
import Summary from '../../../../components/backend/booking/Summary'
import Detail from '../../../../components/backend/booking/Detail';
import UserBooking from '../../../../components/backend/booking/UserBooking';
import Link from 'next/link';
import AddReview from '../../../../components/frontend/product_detail/AddReview';
import SuccessDialog from '../../../../components/widget/ModalSuccessDialog';
import {isCancel} from '../../../../utils/packageHelper'
import dynamic from 'next/dynamic'

const Paypal = dynamic(
  () => import('../../../../components/widget/Paypal'),
  { ssr: false }
)

const Index = (props) => {
  const [bookings, setBooking] = useState();
  const [check, setCheck] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const router = useRouter()
  const {id} = router.query;

  const fetchBookOne = () => {
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
    fetchBookOne();
    fetchPackage();
  }, [id]);

  const fetchPackage = ()=>{
    if(!id) return;
    var data = {'booking_id' : id}
    api.checkRevuew(data)
    .then(res => {
      const data= res.data;
      console.log('fetched data',data)
      setCheck(data);
    })
    .catch(err=>{
      console.log(err.response || err)
    })
  }

  const handleSave = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    api.insertReview(data)
    .then(res=>{
      const data = res.data;
      setModalSuccess(true);
      fetchBookOne();
      fetchPackage();
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const onPaypalSuccess = ()=>{
    Router.push('/order-success')
    // alert('success')
  }


  // console.log(check);


  return (
    <>
      <Layout title="Booking Details" page_name="Bookings" sub_page="details" main_link="booking" banner={false}>
        <div className="container start-content">
          <aside className="main-content border-r8px p-4">
          {
            bookings ? (
              <>
                <div className="row justify-content-between align-items-center px-3">
                  <div className="d-flex align-items-center">
                    <h4>Booking Details</h4>        
                    <div className="ml-4">{bookings.payment_status == 1 ? <span className="text-warning">(Pending)</span> : <span className="text-success">(Success)</span>}</div>
                  </div>
                  <div className="">
                    <Link href="/user/my_booking">
                      <a><button className="btn btn-primary" type="button">Back</button></a>
                    </Link>
                  </div>
                </div>
                <div className="divider"></div>

                <div className="row justify-content-center">
                  <div className="col-lg-9 col-12">
                    <div>
                      <Detail data={bookings} />
                    </div>
                    <div className="mt-4">
                      <UserBooking data={bookings} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-12">
                    <Summary data={bookings} />
                  </div>
                </div>

                {!!bookings && bookings.payment_status == 1 && !isCancel(bookings) && (
                  <div className="row justify-content-center mt-4">
                    <div className="col-12 col-md-8 col-lg-4">
                    <Paypal   
                    onPaypalSuccess={onPaypalSuccess} 
                    booking={bookings}
                    />
                    </div>
                  </div>
                  
                

                )}
                
                {
                  check.can_review ? (
                    <>
                      <div className="divider"></div>
                      <section className="mt-4" id="reviews">
                        <AddReview data={bookings} handleSave={handleSave} />
                      </section>
                    </>
                  ) : null
                }
                
              </>
            ) : null
          }
          </aside>
        </div>
        <div className="end-content"></div>
        <SuccessDialog show={modalSuccess}
          text="Successfully saved data !!!"
          size="md" onHide={() => setModalSuccess(false)}
           />
      </Layout>
    </>
  )
}


export default Index
