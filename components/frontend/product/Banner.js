import React from 'react';

const Banner = (props) => {
  const {data} = props;

  return (
    data ? (
      <>
        <section class="hero_single version_2">
          <div class="wrapper">
            <div class="container">
              <h3>Book unique experiences</h3>
              <p>Expolore top rated tours, hotels and restaurants around the world</p>
            </div>
          </div>
        </section>
      </>
    ) : null
  )
}
export default Banner