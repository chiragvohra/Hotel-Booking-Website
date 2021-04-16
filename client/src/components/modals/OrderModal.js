import { Modal } from "antd";

const OrderModal = ({ session, orderedBy, showModal, setShowModal, checkIn, checkOut, rooms, totalPrice }) => {
  return (
    <Modal
      visible={showModal}
      title="Order payment info"
      onCancel={() => setShowModal(!showModal)}
    >
      <p>Payment intent: {session.payment_intent}</p>
      <p>Payment status: {session.payment_status}</p>
      <p>Stripe customer id: {session.customer}</p>
      <p>Customer Name: {orderedBy.name}</p>


      <p>CheckIn Date: {new Date(checkIn).toLocaleDateString()}</p>
      <p>CheckOut Date: {new Date(checkOut).toLocaleDateString()}</p>
      <p>No. of Rooms : {rooms}</p>
      <p>Total Amount: ${totalPrice}</p>
      
    </Modal>
  );
};

export default OrderModal;
