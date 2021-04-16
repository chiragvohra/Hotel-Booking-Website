import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { stripeSuccessRequest } from "../actions/stripe";
import { LoadingOutlined } from "@ant-design/icons";

const StripeCancel = ({ match, history }) => {
  const {
    auth: { token },
  } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    stripeSuccessRequest(token, match.params.hotelId).then((res) => {
      if (res.data.success) {
        history.push("/dashboard");
      } else {
        history.push("/stripe/cancel");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.hotelId]);

  return (
    <div className="container">
      <div className="d-flex justify-content-center p-5">
        <LoadingOutlined className="display-1 text-danger p-5" />
      </div>
    </div>
  );
};

export default StripeCancel;
