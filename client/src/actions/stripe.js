import axios from "axios";

export const createConnectAccount = async (token) =>
  await axios.post(`/api/stripe/create-connect-account`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getAccountStatus = async (token) =>
  axios.post(`/api/stripe/get-account-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getAccountBalance = async (token) =>
  axios.post(`/api/stripe/get-account-balance`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const currencyFormatter = (data) => {
  return (data.amount / 100).toLocaleString(data.currency, {
    style: "currency",
    currency: data.currency,
  });
};

export const payoutSetting = async (token) =>
  await axios.post(`/api/stripe/payout-setting`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getSessionId = async (token, hotelId, checkIn, checkout, rooms) =>
  await axios.post(`/api/stripe/stripe-session-id`,
      {hotelId, checkIn, checkout, rooms},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } 
  );  

export const stripeSuccessRequest = async (token, hotelId) =>
  await axios.post(`/api/stripe/stripe-success`,
    { hotelId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
