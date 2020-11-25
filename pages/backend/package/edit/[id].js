import React, { useState,useEffect } from 'react';
import Layout from '../../../../components/backend/layout/Layout';
import PackageDetail from '../../../../components/backend/package/PackageDetail';
import PackageImage from '../../../../components/backend/package/PackageImage';
import PackagePrice from '../../../../components/backend/package/PackagePrice';
import ShowPrice from '../../../../components/backend/package/ShowPrice';
import Button from '../../../../components/widget/Button';
import LoadingButton from '../../../../components/widget/LoadingButton';
import api from '../../../../utils/api-admin'
import {useRouter} from 'next/router'
import {toPriceListState} from '../../../../utils/packageHelper'
import Router from 'next/router'
import SuccessDialog from '../../../../components/widget/ModalSuccessDialog';
import Link from 'next/link'
import EventMain from '../../../../components/backend/package/EventMain';
import MetaTag from '../../../../components/backend/package/MetaTag';

const Index = (props) => {
  const [show, setShow] = useState(true);
  const [pkg,setPkg] = useState();
  const [priceList, setPriceList] = useState([]);
  const [events,setEvents] = useState([]);
  const [editData,setEditData] = useState()
  const [saving,setSaving] = useState(false)
  const [galleryOrder,setGalleryOrder] = useState()
  const [modalSuccess, setModalSuccess] = useState(false);
  const [delImg, setDelImg] = useState([]);

  const router = useRouter()
  const {id} = router.query;

  useEffect(() => {
    if(!id) return;
    fetchPackage();
  }, [id]);

  useEffect(() => {
    if(!priceList.length) return;
    setShow(false);
  }, [priceList]);

  const fetchPackage = ()=>{
    api.getPackageOne(id)
    .then(res => {
      const data= res.data;
      setPkg(data)
      console.log('fetched data',data)
      // console.log('transform',toPriceListState(data.price_dates))
      setPriceList(toPriceListState(data.price_dates))
      setEvents(data.events)
    })
    .catch(err=>{
      console.log(err.response || err)
    })
  }

  const handleShow = () => {
    setShow(true);
    if(editData) setEditData(null)
  }
  const handleCancel = () => {
    setShow(false);
  }

  const handleAdd = (price_data) => {
    setPriceList([...priceList,price_data]);
    setShow(false);
  }

  const onClickEdit = (index)=>{
    setEditData({...priceList[index],index})
    setShow(true)
  }

  const onClickDelete = (index) =>{
    var tmp = [...priceList]
    tmp.splice(index,1)
    setPriceList(tmp)
  }

  const handlePriceSave =(data,index)=>{
    var tmp = [...priceList]
    tmp[index] = data
    // console.log('editing data',tmp)
    setPriceList(tmp)
    setShow(false);
  }

  const handleSubmit = (method) =>{
    // e.preventDefault()
    var form = document.getElementById('package-form')
    var formData = new FormData(form)

    if(!form.reportValidity()){
      return;
    }
    formData.append('price_date_list',JSON.stringify(priceList))
    formData.append('events',JSON.stringify(events))
    formData.append('method',method)

    if(galleryOrder) formData.append('images_order',JSON.stringify(galleryOrder))
    if(delImg) formData.append('images_deleted', JSON.stringify(delImg))

    for(let i = 0 ; i < events.length ; i++){
      if(events[i].file) formData.append('event_img'+i,events[i].file)
    }


    setSaving(true)
    api.updatePackageOne(id,formData)
    .then(() => {
      setSaving(false)
      setModalSuccess(true);
    })
    .catch(err =>{
      setSaving(false)
      console.log(err.response || err)
    })
  }
  
  const setImage = (id) => {
    if(!pkg) return;
    var deltmp = [...delImg];
    var tmp = [...pkg.products_images];
    let in1 = tmp.filter((val) => val.id == id);
    let in2 = tmp.indexOf(in1[0])
    tmp.splice(in2, 1);
    tmp.products_images = tmp;
    deltmp.push(id);
    setPkg({...pkg, products_images : tmp});
    setDelImg(deltmp);
  }

  console.log('delImg', delImg)


  return (
    <>
      <Layout title="Edit Package" page_name="Package" sub_page="Edit" main_link="package">
        <div className="row justify-content-start">
          <div className="col-6">
            <h4>Edit Package</h4>
          </div>
          <div className="col-6">
            <div className="text-right">
              <LoadingButton type="button" 
                className="btn-outline-primary"  
                loading={saving}
                onClick={() => handleSubmit('draft')} >
                Save Draft
              </LoadingButton> 

              <LoadingButton type="button" 
                className="btn-primary ml-3"  
                loading={saving}
                onClick={() => handleSubmit('publish')} >
                Publish
              </LoadingButton> 
            </div>
          </div>
        </div>
        <div className="divider"></div>

        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" data-toggle="tab" href="#details">Package Detail</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#images">Package Gallery</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#events">Events Detail</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#price">Schedule and Pricing</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#tags">Meta Tags</a>
          </li>
        </ul>
        <form  id="package-form" >
          <div className="tab-content">
            <div className="tab-pane active" id="details">
              <div>
                <PackageDetail pkg={pkg} />
              </div>
            </div>
            <div className="tab-pane fade" id="images">
              <PackageImage  images={pkg? pkg.products_images.filter((val) => val.type === 'banner') : []} 
                setImage={setImage}
                setGalleryOrder={setGalleryOrder}
                galleryOrder={galleryOrder}
                dropzone_header="Banner Images" pixel_text="1600px x 1067px" input_name="banners" index="0"
              />
              <PackageImage  images={pkg? pkg.products_images.filter((val) => val.type === 'gallery') : []} 
                setImage={setImage}
                setGalleryOrder={setGalleryOrder}
                galleryOrder={galleryOrder}
                dropzone_header="Image Gallery" pixel_text="960px x 640px" input_name="images" index="1"
              />
            </div>
            <div className="tab-pane fade" id="events">
              <EventMain pkg={pkg} events={events} setEvents={setEvents} />
            </div>
            <div className="tab-pane fade" id="price">
              <div className="row">
                <div className="col-12">
                  <div className="text-right">
                    {!show ?<Button _type="button" _name="Add" _class="btn-primary" _click={() => handleShow()} /> :null}
                  </div>
                </div>
              </div>

              {
                show ? (
                  <>
                    <div>
                      <PackagePrice 
                      handleAdd={handleAdd} 
                      handleCancel={handleCancel} 
                      editData={editData}
                      handlePriceSave={handlePriceSave}
                      lasted={priceList[priceList.length-1]} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <ShowPrice price={priceList} onClickEdit={onClickEdit} onClickDelete={onClickDelete}  />
                    </div>
                  </>
                )
              }
            </div>
            <div className="tab-pane fade" id="tags">
              <MetaTag pkg={pkg} />
            </div>
          </div>
          {/* <div className="row mt-4">
            <div className="col-12">
              <div className="text-right">
                <Link href="/backend/package">
                  <a>
                    <Button _type="button" _name="Cancel" _class="btn-outline-default mr-4" />
                  </a>
                </Link>
                <LoadingButton type="button" 
                  className="btn-outline-primary"  
                  loading={saving}
                  onClick={() => handleSubmit('draft')} >
                  Save Draft
                </LoadingButton> 

                <LoadingButton type="button" 
                  className="btn-primary ml-3"  
                  loading={saving}
                  onClick={() => handleSubmit('publish')} >
                  Publish
                </LoadingButton> 
              </div>
            </div>
          </div> */}
        </form>
        
        <SuccessDialog show={modalSuccess}
          text="Successfully saved data !!!"
          size="md" onHide={() => setModalSuccess(false)}
          route={"/backend/package"} />

      </Layout>
    </>
  )
}


export default Index
