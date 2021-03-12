import React from 'react';
import Section from '../footer/Section'

const Footer = (props) => {
  const {name} = props;

  return (
    <div className="footer">
      <section className="Footer-links" data-selenium="footer-links-section">
        <div className="LinksList container">
          <div className="LinksListGroup LinksListGroup--vertical" data-selenium="footer-help-column">
            <h5 className="LinksListGroup-title LinksListGroup-title--vertical">Help</h5>
            <ul className="LinksListGroup-list">
              <li className="LinksListLink"><a href="" target="_blank" className="LinksListLink-link" >Privacy policy</a></li>
              <li className="LinksListLink"><a href="" target="_blank" className="LinksListLink-link" >Terms of use</a></li>
            </ul>
          </div>
          <div className="LinksListGroup LinksListGroup--vertical">
            <h5 className="LinksListGroup-title LinksListGroup-title--vertical">About us</h5>
            <ul className="LinksListGroup-list">
              <li className="LinksListLink"><a href="" target="_blank" className="LinksListLink-link">Careers</a></li>
              <li className="LinksListLink"><a href="" target="_blank" className="LinksListLink-link">Press</a></li>
              <li className="LinksListLink"><a href="" target="_blank" className="LinksListLink-link" >Blog</a></li>
            </ul>
          </div>
          <div className="LinksListGroup LinksListGroup--vertical">
            <h5 className="LinksListGroup-title LinksListGroup-title--vertical">Destinations</h5>
            <ul className="LinksListGroup-list">
              <li className="LinksListLink"><a href="" className="LinksListLink-link">Countries/Territories</a></li>
              <li className="LinksListLink"><a href="" className="LinksListLink-link">Cities</a></li>
            </ul>
          </div>
          <div className="LinksListGroup LinksListGroup--vertical">
            <h5 className="LinksListGroup-title LinksListGroup-title--vertical">Partner with us</h5>
            <ul className="LinksListGroup-list">
              <li className="LinksListLink"><a href="" className="LinksListLink-link">YCS partner portal</a></li>
              <li className="LinksListLink"><a href="" className="LinksListLink-link">Partner solutions</a></li>
            </ul>
          </div>
        </div>
      </section>
      <Section />
    </div>
  )
}
export default Footer