import React, { useRef } from "react";
import ReactToPrint from "react-to-print";


class ComponentToPrint extends React.Component {
  
    getTimePeriod = () =>{
        var str = ''
        if(!this.props.data) str
        const data = this.props.data
        var start_date = new Date(data.start_date)
        var end_date = new Date(data.end_date)
        var start_hour = start_date.getHours().toString().padStart(2,'0')
        var start_minute = start_date.getMinutes().toString().padStart(2,'0')
        var end_hour = end_date.getHours().toString().padStart(2,'0')
        var end_minute = end_date.getMinutes().toString().padStart(2,'0')
        var start_time = start_hour + '.' + start_minute
        var end_time = end_hour + '.' + end_minute
        return [start_time,end_time].join('-')
    }

  render() {
    const {data} = this.props
    const {booking_boats,booking_details,user_type} = data;
    const type = (booking_boats[0]?.boat?.boat_category?.code ?? '') + '-' +  
    (booking_boats[0]?.boat?.boat_category?.name ?? '');
    // console.log(user_type);
    return (
      <div className="container">
        <div className="row border-p ">
            <div className="col-2 d-flex justify-content-center align-self-center">
                <img src="/icon/logo.svg" />    
            </div>
            <div className="col-7 px-3 py-2">
                <p className="text-bold text-pint">
                    บริษัท ครุยเซโกะ จำกัด เลขประจำตัวผู้เสียภาษี 0105557050492
                    สนง 65/207 ชั้น 24 อาคารชำนาญเพ็ญชาติ ถนนพระราม 9
                    เขตห้วยขวาง กทม 10310
                </p>
                <p className="text-bold mb-0" >
                    ที่อยู่จดทะเบียน 9 ซอยจันทน์ 51 แยก 12-3 ถนนจันทน์ เขตบางคอแหลม แขวงวัดพระยาไกร กรุงเทพ 10120
                </p>
            </div>  
            <div className="col-3 align-self-end px-3 py-2">
                <a href="www.cruiseko.com"><p className="text-pint mb-1">www.cruiseko.com</p></a>
                <a href="E:trip@cruiseko.com"><p className="text-pint mb-1">E:trip@cruiseko.com</p></a>
                <p className="text-bold text-pint mb-0">T: 099 449 6690</p>
            </div>  
        </div>     
        <div className="row">
            <div className="col-5">
                <div className="row mb-4 mr-1">
                    <div className="col-5 border-p-b border-p-x align-self-end pl-3 py-2 pr-1">
                        <p className="text-bold mb-0"> Date reservation</p>
                        <p className="text-bold mb-0">วันที่จอง</p>    
                        
                    </div>
                    <div className="col-5 border-p-b border-p-r align-items-end d-flex justify-content-center px-3 py-2">
                        <p className="mb-0">
                            {data.createdAt ? new Date(data.createdAt).toLocaleDateString('en') : '-'  } 
                        </p>
                    </div>
                    <div className="col-2"></div>
                </div>
                <div className="row mr-1">
                    <div className="col-5 border-p d-flex align-items-end px-3 py-2">
                        <p className="text-bold mb-0 "> No:</p>
                    </div>
                    <div className="col-5 border-p-y border-p-r align-items-end d-flex justify-content-center px-3 py-2">
                        <p className="mb-0">017/15122020</p>
                    </div>
                    <div className="col-2"></div>
                </div>
                <div className="row mr-1">
                    <div className="col-5 border-p-x border-p-b d-flex align-items-end px-3 py-2">
                        <p className="text-bold mb-0">Type:</p>
                    </div>
                    <div className="col-5 border-p-b border-p-r align-items-end d-flex justify-content-center px-3 py-2">
                        <p className="mb-0"> {type} </p>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
            <div className="col-7">
                <div className="row border-p-x">
                    <div className="col-4 border-p-r border-p-b align-items-end d-flex px-3 py-2">
                        <p className="text-bold mb-0 ">Client ลูกค้า </p>
                    </div>
                    <div className="col-8 border-p-b align-items-end d-flex px-3 py-2">
                        <p className="mb-0"> {data.user_firstname} {data.user_lastname}</p>
                    </div>
                </div>

                <div className="row border-p-x">
                    <div className="col-4 border-p-r border-p-b align-items-end d-flex px-3 py-2">
                        <p className="text-bold mb-0 ">Company บริษัท</p>
                    </div>
                    <div className="col-8 border-p-b align-items-end d-flex px-3 py-2">
                        
                    </div>
                </div>

                <div className="row border-p-x">
                    <div className="col-4 border-p-r border-p-b align-items-end d-flex px-3 py-2">
                        <p className="text-bold mb-0 ">Tel โทร </p>
                    </div>
                    <div className="col-8 border-p-b align-items-end d-flex px-3 py-2">
                        <p className="mb-0"> {data.user_phone} </p>
                    </div>
                </div>

                <div className="row border-p-x">
                    <div className="col-4 border-p-r border-p-b align-items-end d-flex px-3 py-2">
                        <p className="text-bold mb-0">Email อีเมลล์</p>
                    </div>
                    <div className="col-8 border-p-b align-items-end d-flex px-3 py-2">
                        {data.user_email}
                    </div>
                </div>

                <div className="row border-p-x">
                    <div className="col-4 border-p-r align-items-end d-flex px-3 py-2">
                        <p className="text-bold mb-0">Ref: </p>
                    </div>
                    <div className="col-8 pl-1 text-pint text-bold px-3 py-2">
                        <p className="mb-0">บริษัท เอฟดับบลิวดีประกันชีวิต จำกัด (มหาชน)</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row border-p-x border-p-y mb-3">
            <div className="col-2 border-p-r d-flex align-items-end px-3 py-2">
                <p className="text-bold mb-0 ">Date Use วันที่ใช้</p>
            </div>
            <div className="col-2 border-p-r d-flex align-items-end px-3 py-2">
                <p className="mb-0"> { new Date(data.start_date).toLocaleDateString()} </p>
            </div>
            <div className="col-2 border-p-r d-flex align-items-end px-3 py-2">
                <p className="text-bold mb-0">Period เวลา</p>
            </div>
            <div className="col-4 border-p-r d-flex align-items-end px-3 py-2">
                <p className="mb-0"> {this.getTimePeriod()}  </p>
            </div>
            <div className="col-2">

            </div>
        </div>
        <div className="row border-p">
            <div className="col-2 border-p-r d-flex align-items-center px-3 py-2">
               <div> <p className="text-bold mb-0 ">Requested Boat</p>
                <p className="text-bold mb-0 ">เรื่อที่จอง</p></div>
            </div>
            <div className="col-4 border-p-r d-flex align-items-end justify-content-center px-3 py-2">
                <h5 className="mb-0"> {booking_boats.map(val => val.boat?.name ?? 'Unknown').join(',')} </h5>
            </div>
            <div className="col-2">
                <div className="row border-p-b border-p-r d-flex align-items-end px-3 py-2">
                    <p className="text-bold mb-0">Departure จุบรับ</p>
                </div>
                <div className="row border-p-r d-flex align-items-end px-3 py-2" >
                    <p className="text-bold mb-0">End จุบส่ง</p>
                </div>
            </div>
            <div className="col-4">
                <div className="row border-p-b d-flex align-items-end px-3 py-2">
                    <p className="mb-0">{booking_details[0]?.product?.pickup_location ?? '-'}</p>
                </div>
                <div className="row d-flex align-items-end px-3 py-2">
                    <p className="mb-0">{booking_details[0]?.product?.dropoff_location ?? '-'}</p>
                </div>
            </div>
        </div>
        <div className="row border-p-b border-p-x">
            <div className="col-2 border-p-r d-flex align-items-center px-3 py-2">
              <div>  <p className="text-bold mb-0">Tour Program</p>
                <p className="text-bold mb-0">รายการทัวร์</p></div>
            </div>
            <div className="col-6 border-p-r d-flex align-items-center px-3 py-2">
                <p className="text-red text-bold mb-0"> {booking_details[0]?.product?.name ?? '-'} </p>
            </div>
            
            <div className="col-4">
                <div className="row border-p-b ">
                    <div className="col-6 d-flex justify-content-center px-3 py-2">
                        <p className="mb-0 ">THB</p>
                    </div>
                    <div className="col-6 d-flex justify-content-start px-3 py-2">
                        <p className="mb-0  text-bold">THB บาท/คน</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 d-flex justify-content-center px-3 py-2">
                        <p className="mb-0 ">26</p>
                    </div>
                    <div className="col-6 d-flex justify-content-start px-3 py-2">
                        <p className="mb-0 text-bold">Pax คน</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row border-p-b border-p-x">
            <div className="col-2 border-p-r d-flex align-items-center px-3 py-2">
                <div>
                    <p className="text-bold mb-0">Surcharge</p>
                    <p className="text-bold mb-0">รายการซื้อเพิ่มเติม</p>
                </div>
            </div>
            <div className="col-6">
                <div className="row">
                    <div className="col-9 border-p-r border-p-b d-flex align-items-end px-3 py-2">
                        <p className="mb-0 ">Adult THB 850</p>
                    </div>
                    <div className="col-3 border-p-r border-p-b d-flex align-items-end px-3 py-2">
                        <p className="text-bold mb-0">THB บาท</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-9 border-p-r border-p-b"></div>
                    <div className="col-3 border-p-r d-flex align-items-end px-3 py-2 border-p-b">
                        <p className="text-bold mb-0 ">THB บาท</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-9 border-p-r"></div>
                    <div className="col-3 border-p-r d-flex align-items-end px-3 py-2">
                        <p className="text-bold mb-0 ">THB บาท</p>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <div className="row">
                    <div className="col-12 border-p-b d-flex justify-content-center px-3 py-2">
                        <h5 className="text-bold mb-0  align-self-end">หมายเหตุ Note</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 px-3 py-2">
                    
                        <h5 className="mb-0">{booking_details[0]?.product?.remark ?? '-'}</h5>
        
                    </div>
                </div>
                
            </div>
            
        </div>
        {
            user_type == 'fit' ? (
                <div className="row border-p-l border-p-b mb-3">
                    <div className="col-4 border-p-r d-flex align-items-end px-3 py-2">
                    <div className="">
                            <p className="text-bold mb-0">
                            Total Selling Price 
                            </p>
                            <p className="text-bold mb-0">ราคาขายรวมทั้งสิ้น</p>
                        </div>
                    </div>
                    <div className="col-4 border-p-r d-flex justify-content-center px-3 py-2">
                        <h4 className="mb-0 text-bold align-self-end">{data.net_price}</h4>
                    </div>
                    <div className="col-4 border-p-r d-flex justify-content-center px-3 py-2">
                        <h5 className="mb-0 text-bold align-self-end">THB บาท</h5>
                    </div>
                </div>
            ) : null
        }
        {
            user_type != 'fit' ? (
                <>
                    <div className="row mb-3 border-p-r">
                        <div className="col-8">
                            <div className="row border-p-l border-p-b mb-3">
                                <div className="col-4 border-p-r d-flex align-items-end px-3 py-2">
                                <div className="">
                                        <p className="text-bold mb-0">
                                        Total Selling Price 
                                        </p>
                                        <p className="text-bold mb-0">ราคาขายรวมทั้งสิ้น</p>
                                    </div>
                                </div>
                                <div className="col-4 border-p-r d-flex justify-content-center px-3 py-2">
                                    <h4 className="mb-0 text-bold align-self-end">{data.net_price}</h4>
                                </div>
                                <div className="col-4 d-flex justify-content-center px-3 py-2">
                                    <h5 className="mb-0 text-bold align-self-end">THB บาท</h5>
                                </div>
                            </div>
                            <div className="row border-p-l border-p-y mb-3">
                                <div className="col-4 border-p-r d-flex align-items-end px-3 py-2">
                                    <p className="text-bold mb-0 ">
                                    เพิ่มเติม
                                    </p>
                                </div>
                                <div className="col-4 border-p-r px-3 py-2">
                                    
                                </div>
                                <div className="col-4 d-flex justify-content-center px-3 py-2">
                                    <h5 className="mb-0 text-bold align-self-end">THB บาท</h5>
                                </div>
                            </div>
                            <div className="row border-p-l border-p-y">
                                <div className="col-4 border-p-r d-flex align-items-end px-3 py-2">
                                    <p className="text-bold mb-0 ">
                                    Deposit มัดจำ
                                    </p>
                                </div>
                                <div className="col-4 border-p-r px-3 py-2">
                                    
                                </div>
                                <div className="col-4 d-flex justify-content-center px-3 py-2">
                                    <h5 className="mb-0 text-bold align-self-end">THB บาท</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 border-p-l border-p-b px-3 py-2">
                            <div>
                                <p className="mb-1 text-14"><span className="text-bold">ชื่อ: </span>บริษัท เอฟดับบลิวดีประกันชีวิต จำกัด (มหาชน)</p>
                            </div>
                            <div>
                                <p className="mb-1 text-14"><span className="text-bold">เลขทะเบียนบริษัท: </span>0107563000304</p>
                            </div>
                            <div className="d-flex ">
                                <div className="w-75" >
                                    <p className="mb-1 text-14 text-bold">ที่อยู่ตามที่จดทะเบียน: </p>
                                </div>
                                <div className="w-100">
                                    <p className="mb-1 text-14">เลขที่ 130-132 อาคารสินธรกาวเวอร์ 3 ชั้น 14, 16, 26-29 ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพ 10330</p>
                                </div>
                            </div>
                            <div>
                                <p className="mb-1 text-14"><span className="text-bold">บัญชีเพื่อการชำระเงินและทำธุรกรรม: </span>ไม่มีการเปลี่ยนแปลง</p>
                            </div>
                        </div>
                    </div>
                    <div className="row border-p-t ">
                        <div className="col-8  pb-3">
                            <div className="row border-p-b border-p-l">
                                <div className="col-4 border-p-r d-flex align-items-end px-3 py-2">
                                    <div className="">
                                        <p className="text-bold mb-0">Outstanding balance</p>
                                        <p className="text-bold mb-0">เงินคงเหลือ</p>  
                                    </div>
                                    
                                </div>
                                <div className="col-4 border-p-r px-3 py-2">
                                    
                                </div>
                                <div className="col-4 d-flex justify-content-center px-3 py-2">
                                    <h5 className="mb-0 text-bold align-self-end">THB บาท</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 border-p-x">
                            <div className="row border-p-b px-3 py-2">
                                <p className="mb-0 text-bold">Cruiseko Company Bank Account บัญชี ธนาคารของบริษัทครุยเซโกะ จำกัด</p>
                            </div>
                            <div className="row px-3 py-2">
                                <p className="mb-0 text-bold">Kasikorn Bank/ Acc No 049 148 2540</p>
                                <p className="mb-0 text-bold">ธนาคารกสิกรไทย เลขที่049 148 2540</p>
                            </div>
                        </div>
                    </div>
                    <div className="row border-p-t">
                        <div className="col-2 border-p-x border-p-b d-flex align-items-center justify-content-center px-3 py-2">
                            <div className="text-align-last-center">
                                <p className="text-bold mb-0">For internal </p>
                                <p className="text-bold mb-0">สำหรับเจ้าหน้าที่ </p> 
                            </div>
                        
                        </div>
                        <div className="col-3 border-p-b1 px-3 py-2">
                            <p className="text-bold">Client type ประเภทลูกค้า </p>
                        </div>
                        <div className="col-7 border-p-b1 border-p-r ">
                            <div className="row">
                                <div className="col-5 px-3 py-2">
                                    <p className="text-bold ">____    Direct</p>
                                    <p className="text-bold mt-2 mb-0">__/__    Line @cruiseko</p>
                                </div>
                                <div className="col-7 px-3 py-2">
                                    <p className="text-bold ">________  Corporate/Agent</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row  border-p-b">
                        <div className="col-2 border-p-x d-flex align-items-center px-3 py-2">
                            <div>
                                <h5 className="text-bold mb-0">Invoice</h5>
                                <h5 className="text-bold mb-0">ใบวางบิล</h5>  
                            </div>
                            
                        </div>
                        <div className="col-3 border-p-r1"></div>
                        <div className="col-7 border-p-r">
                            <div className="row">
                                <div className="col-3 d-flex align-items-center px-3 py-2">
                                    <div> 
                                        <h5 className="text-bold mb-0">Status</h5>
                                        <h5 className="text-bold mb-0">สถานะ</h5>   
                                    </div>
                                    
                                </div>
                                <div className="col-4 px-3 py-2">
                                    <p className="text-bold mb-3">__/___  complete เสร็จ</p>
                                    <p className="text-bold mb-0">____     Pending ค้าง</p>
                                </div>
                                <div className="col-5 px-3 py-2">
                                    <p className="text-bold  mb-0 ">____  Cancel ยกเลิก</p>
                                    <p className="text-bold mb-0">เหตุผล:</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null
        }
        
      </div>
    );
  }
}
const Pint = (props) =>{
  const componentRef = useRef();
//   const {_click, _class, invoice, _dis} = props;

  return (
    <div>
        <ReactToPrint
          trigger={() => <button className="btn btn-outline-primary" href="javascript:void(0)" >พิมพ์</button>}
          content={() => componentRef.current}
          pageStyle="A4"
        //   onBeforePrint={_click}

        />
        <div style={{ display: "none" }}>
            {!!props.data && <ComponentToPrint  data={props.data} ref={componentRef} /> }
            
        </div>
    </div>
  )
}
export default Pint;