import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import OrderModal from "../modals/OrderModal";

const BookingCard = ({ key, hotel, session, orderedBy, checkIn, checkOut, rooms, totalPrice }) => {
  const [showModal, setShowModal] = useState(false);


  const history = useHistory();

  return (
    <>
      <div className="card mb-3">
        <div className="row no-gutters">
          <div className="col-md-4">
            {hotel.image && hotel.image.contentType ? (
              <img
                src={`/api/hotels/image/${hotel._id}`}
                alt="default hotel image"
                className="card-image img img-fluid padd"
              />
            ) : (
              <img
                src="https://via.placeholder.com/900x500.png?text=MERN+Booking"
                alt="default hotel image"
                className="card-image img img-fluid padd"
              />
            )}
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">
                {hotel.title}{" "}
                <div className="float-right text-primary">
                  Total Price: ${totalPrice}
                </div>{" "}
              </h3>
              <p className="alert alert-info">{hotel.location}</p>
              <p className="card-text">{`${hotel.content.substring(
                0,
                190
              )}...`}</p>
              <p className="card-text">
                <span className="float-right text-primary">
                <h6 className="card-text">No. of Rooms : {rooms}</h6>
                </span>
              </p>
              
              <h6 className="card-text">CheckIn Date: {new Date(checkIn).toLocaleDateString()}</h6>
              <h6 className="card-text">CheckOut Date: {new Date(checkOut).toLocaleDateString()}</h6>
              

              {showModal && (
                <OrderModal
                  session={session}
                  orderedBy={orderedBy}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  rooms={rooms}
                  totalPrice={totalPrice}
                />
              )}
              

              <div className="d-flex justify-content-between h4">
                <button
                  onClick={() => setShowModal(!showModal)}
                  className="btn btn-primary"
                >
                  Show Payment info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCard;
