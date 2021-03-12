import React from 'react';
import Section from '../footer/Section'

const Footer = (props) => {
  const {name} = props;

  return (
    <div className="footer">
      <section class="Footer-links" data-selenium="footer-links-section">
        <div class="LinksList container">
          <div class="LinksListGroup LinksListGroup--vertical" data-selenium="footer-help-column">
            <h5 class="LinksListGroup-title LinksListGroup-title--vertical">Help</h5>
            <ul class="LinksListGroup-list">
              <li class="LinksListLink"><a href="" target="_blank" class="LinksListLink-link" >Privacy policy</a></li>
              <li class="LinksListLink"><a href="" target="_blank" class="LinksListLink-link" >Terms of use</a></li>
            </ul>
          </div>
          <div class="LinksListGroup LinksListGroup--vertical">
            <h5 class="LinksListGroup-title LinksListGroup-title--vertical">About us</h5>
            <ul class="LinksListGroup-list">
              <li class="LinksListLink"><a href="" target="_blank" class="LinksListLink-link">Careers</a></li>
              <li class="LinksListLink"><a href="" target="_blank" class="LinksListLink-link">Press</a></li>
              <li class="LinksListLink"><a href="" target="_blank" class="LinksListLink-link" >Blog</a></li>
            </ul>
          </div>
          <div class="LinksListGroup LinksListGroup--vertical">
            <h5 class="LinksListGroup-title LinksListGroup-title--vertical">Destinations</h5>
            <ul class="LinksListGroup-list">
              <li class="LinksListLink"><a href="" class="LinksListLink-link">Countries/Territories</a></li>
              <li class="LinksListLink"><a href="" class="LinksListLink-link">Cities</a></li>
            </ul>
          </div>
          <div class="LinksListGroup LinksListGroup--vertical">
            <h5 class="LinksListGroup-title LinksListGroup-title--vertical">Partner with us</h5>
            <ul class="LinksListGroup-list">
              <li class="LinksListLink"><a href="" class="LinksListLink-link">YCS partner portal</a></li>
              <li class="LinksListLink"><a href="" class="LinksListLink-link">Partner solutions</a></li>
            </ul>
          </div>
        </div>
      </section>
      <Section />
    </div>
  )
}
export default Footer