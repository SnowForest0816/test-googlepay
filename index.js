const stripe = Stripe('pk_test_51MzJUPEQJGo8pVHjNIoutQBdkAlUBVzy0AtZFUoH9OhGfLiGICKgjuA7MboYViLtUORMhCMK3BRf6i23Jb4sVoDk00pes2MRvd');

document.addEventListener('DOMContentLoaded', async () => {
  const paymentRequest = stripe.paymentRequest({
    currency: 'usd',
    country: 'US',
    requestPayerName: true,
    requestPayerEmail: true,
    total: {
      label: 'total',
      amount: 19.99
    }
  });

  const elements = stripe.elements();
  const prButton = elements.create('paymentRequestButton', {
    paymentRequest: paymentRequest,
  });

  paymentRequest.canMakePayment().then((result) => {
    if (result) {
      prButton.mount('#payment-request-button');
    } else {
      document.getElementById('payment-request-button').style.display = 'none';
      addMessage('Google Pay is unavailable');
    }
  });

  paymentRequest.on('paymentmethod', async(e) => {
    const amount = 1999;
    // const clientSecret = await (await fetch(`https://2o68cldz87.execute-api.us-east-1.amazonaws.com/test/card_pay?amount=${amount}`, { mode: 'cors' })).json();
    const clientSecret = 'pi_3N81pbEQJGo8pVHj1Maiv03A_secret_Zw2dohiJv9xfZzzYH4OpBvxvT';
    addMessage("Payment Intent Created");
    const {error, paymentIntent} = stripe.confirmCardPayment(clientSecret, {
      payment_method: e.paymentMethod.id
    }, {handleActions:false});

    if (error) {
      addMessage('Payment failed')
      e.complete('fail');
    }

    e.complete('success');
    addMessage("success");

    if (paymentIntent.status == 'requires_action') {
      stripe.confirmCardPayment(clientSecret);
    }
    console.log(e);
  });
});