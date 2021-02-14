import React from "react";
import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import ModalTranfer from '../../components/frontend/payment/ModalTranfer'

const client_id = process.env.PAYPAL_CLIENT_ID

let PayPalButton = null;


class PaypalButton extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showButtons: false,
      loading: true,
      paid: false,
      modal: false,
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }
  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      this.setState({ loading: false, showButtons: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        this.setState({ loading: false, showButtons: true });
      }
    }
  }

  createOrder = (data, actions) => {
    console.log("createOrder data: ", data);
    const {booking} = this.props
    
    return actions.order.create({
      purchase_units: [
        {
          invoice_id : booking.id,
          description: booking.name,
          amount: {
            currency_code: "THB",
            value: booking.net_price
          }
        }
      ],
    });
  };

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      console.log("Payment Approved: ", details);
      console.log("Payment data: ", data);
      this.props.onPaypalSuccess?.()
      this.setState({ showButtons: false, paid: true });
    });
  };

  

  render() {
    const { showButtons, loading, paid, modal } = this.state;

    return (
      <div className="main">
        {loading &&  <div>Loading...</div> }

        {showButtons && (
          <div>
            <PayPalButton
              createOrder={(data, actions) => this.createOrder(data, actions)}
              onApprove={(data, actions) => this.onApprove(data, actions)}
            />
          </div>
        )}

        <button type="button" className="btn btn-primary w-100 border-r-4px" onClick={() => this.setState({ modal: true })}>Tranfer Slip</button>


        {paid && (
          <div className="main">
            <h2>
              Congrats! you just paid for that picture. Work a little harder and
              you'll be able to afford the car itself{" "}
              <span role="img" aria-label="emoji">
                {" "}
                😉
              </span>
            </h2>
          </div>
        )}
        <ModalTranfer show={modal} size={'md'} 
          onHide={() => this.setState({ modal: false })} 
          total_price={this.props.total_price}
          booking={this.props.booking} />    
      </div>
    );
  }

}


export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${client_id}&currency=THB`)(PaypalButton)