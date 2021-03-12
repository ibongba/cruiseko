import React from 'react';

const Section = (props) => {
  const {name} = props;

  return (
    <section className="Footer-copyrights" data-selenium="footer-copyright-section">
      <div className="Copyrights l-container">
        <p className="Copyrights--info">Copyright © 2005 – 2021 Cruiseko Company Ltd. สงวนลิขสิทธิ์ตามกฎหมาย</p>
        <p className="Copyrights--info">Cruiseko เป็นส่วนหนึ่งของ Booking Holdings Inc. ผู้ให้บริการการท่องเที่ยวออนไลน์และบริการที่เกี่ยวข้องชั้นนำระดับโลก</p>
        <ul className="Copyrights-brands">
          {/* <li className="Copyrights-brandsItem"><i className="Copyrights-brandsIcon icon agoda"></i></li>
          <li className="Copyrights-brandsItem"><i className="Copyrights-brandsIcon icon priceline"></i></li>
          <li className="Copyrights-brandsItem"><i className="Copyrights-brandsIcon icon kayak"></i></li>
          <li className="Copyrights-brandsItem"><i className="Copyrights-brandsIcon icon rental-cars"></i></li>
          <li className="Copyrights-brandsItem"><i className="Copyrights-brandsIcon icon booking-com"></i></li>
          <li className="Copyrights-brandsItem"><i className="Copyrights-brandsIcon icon open-table"></i></li> */}
        </ul>
        {/* <small className="Copyrights-machine" id="server-name">SG-AGWEB-6F02</small> */}
      </div>
    </section>
  )
}
export default Section