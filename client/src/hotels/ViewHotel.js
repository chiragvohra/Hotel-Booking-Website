import React, { useState, useEffect } from "react";
import { read, diffDays } from "../actions/hotel";
import { DatePicker, Select } from "antd";
import { getSessionId } from "../actions/stripe";
import moment from "moment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js"; 

import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'



const { RangePicker } = DatePicker;
const { Option } = Select;


const ViewHotel = ({ match, history }) => {

  const [hotel, setHotel] = useState({});
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [checkIn, setcheckIn] = useState("");
  const [checkout, setcheckOut] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  
  const [rooms, setRooms] = useState(0);
  const [loading, setLoading] = useState(false);

  const { auth } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadSellerHotel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const loadSellerHotel = async () => {
    let res = await read(match.params.hotelId);
    setHotel(res.data);
    setImage(`/api/hotels/image/${res.data._id}`);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!auth || !auth.token) {
      history.push("/login");
      return;
    }

    setLoading(true);
    if (!auth) history.push("/login");


    try {
      let res = await getSessionId(auth.token, match.params.hotelId, checkIn, checkout, rooms);
      const stripe = await loadStripe("pk_test_51IbjczCu4J6f0rVjfbd3VqJprGr1NC2IrkzRnmjEuQdUAmu0Hv7o25f5fDNhufaOPq5VbiD5UAnlEcmxsGxDcfqm00AOCbqx9g");

      stripe.redirectToCheckout({
        sessionId: res.data.sessionId,
      }).then((result) => console.log(result));  
    } catch (error) {
      
    }
  };

  const dateHandler = (dateString) => {

    setcheckIn(dateString[0]);
    setcheckOut(dateString[1]);

    setTotalDays(diffDays(checkIn, checkout));

  };

  const roomHandler = (value) => { 

    setRooms(value);

  };

  return (
    <>  

      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>

      <Row>
        <Col md={3}>
          <ListGroup.Item>
            <Image src={image} alt={hotel.title} fluid />
          </ListGroup.Item>

          <ListGroup.Item>
              <Row>
              <l1>-Room Size : 500 sqft</l1>
              </Row>
              <Row>
              <l1>-Bed Type : King Size Bed</l1>
              </Row>
              <Row>
              <l1>-Free Wifi Available</l1>
              </Row>
              <Row>
              <l1>-Check In : 9am to 12pm</l1>
              </Row>
              <Row>
              <l1>-Check Out : 11am to 2pm</l1>
              </Row>


                
          </ListGroup.Item>

        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h1>{hotel.title}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>Location:</h5> {hotel.location}
            </ListGroup.Item>
            <ListGroup.Item><h5>Price: ${hotel.price}  <i>per night</i></h5> </ListGroup.Item>
            <ListGroup.Item>
              <h5>Description:</h5> {hotel.content}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col >
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col><h5>Price:</h5></Col>
                  <Col>
                    <strong>${hotel.price} <i>per night</i>  </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    <RangePicker
                      onChange={(value, dateString) => {dateHandler(dateString)}}
                      disabledDate={(current) =>
                          current && current.valueOf() < moment().subtract(1, "days")
                      }
                      className="w-100"
                    />
                  </Col>
                  </Row>                
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>

                
                <Col><h5>Booking for: </h5></Col>

                <Col>
                <h6>{Number(diffDays(checkIn, checkout)) ? Number(diffDays(checkIn, checkout)) : 0} Nights and {Number(diffDays(checkIn, checkout)) ? Number(diffDays(checkIn, checkout))+1 : 0} Days </h6>
                </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col md={5} >
                    <h5>Number of Rooms:</h5>         
                  </Col>
                  <Col>
                    <Select
                      onChange={(value) => roomHandler(value)}
                      className="w-100"
                      size="large"
                      placeholder="Number of Rooms"
                      >
                      <Option key={1}>{1}</Option>
                      <Option key={2}>{2}</Option>
                      <Option key={3}>{3}</Option>
                      <Option key={4}>{4}</Option>
                    </Select>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <h3>Total Amount =  ${ Number(diffDays(checkIn, checkout)) ? Number(hotel.price) * Number(rooms) * Number(diffDays(checkIn, checkout)) : 0}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  onClick={handleClick}
                  className='btn-block'
                  type='button'
                  disabled={loading || !checkIn || !checkout || !rooms || checkIn === checkout}
                >
                  {
                        loading
                        ? "Loading..."
                        : auth && auth.token
                        ? "Book Now"
                        : "Login to Book"
                  }
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
          <h2></h2>        
      {/* <Card>   */}
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Col md={10} >
              <Row>
                <Col><h2>Safety Protocols</h2></Col>
              </Row>
              <Row>
                <Col>Our in-depth cleanliness and disinfection protocol is designed to ensure your safety and peace of mind from check-in to check-out</Col>
              </Row>
              </Col>
            </ListGroup.Item>

            <ListGroup.Item>
                
              
              <h6>✅ Physical distancing measures throughout the hotel</h6>
              <h6>✅ Increase cleaning and disinfecting frequency throughout the hotel, especially high-touch items</h6>
              <h6>✅ Install alcohol-based hand sanitizing and glove stations near the front entrance and public areas</h6>
              <h6>✅ Food safety -Adhere to the strict safety procedures while serving all food and beverages</h6>



            </ListGroup.Item>
          
          </ListGroup>

        {/* </Card> */}

        <h1></h1>
        <h1></h1>
        <h1></h1>

        
        <Row>
          <Col md={2}>
                  
              <h5>FOOD AND DRINKS</h5>
              <ul className="extras">
                <li>Bar</li>
                <li>Cafe</li>
                <li>Restaurant</li>
                <li>Dining Area</li>
              </ul>    
          </Col>
          <Col md={2}>
           
              <h5>BEAUTY AND SPA</h5>
                <ul className="extras">
                  <li>Spa</li>
                  <li>Salon</li>
                  <li>Massage</li>
                </ul> 
          </Col>
          <Col md={3}>
            <h5>MEDIA AND TECHNOLOGY</h5>
                <ul className="extras">
                  <li>Electric Chrgers</li>
                  <li>TV</li>
                  <li>Wifi</li>
                </ul>    
          </Col>
          <Col md={2}>
              <h5>COMMON AREA</h5>
                <ul className="extras">
                  <li>Lounge</li>
                  <li>Reception</li>
                  <li>Seating Area</li>
                </ul>     
          </Col>
          <Col md={3}>
            <h5>More Facilities</h5>
            <ul className="extras">
                <li>Swimming Pool</li>
                <li>24-hour Room Service</li>
                <li>Complimentary refreshments</li>
                <li>Garden View</li>
                <li>Air Conditioning</li>
                <li>Laundry Service</li>

            </ul>    
          </Col>
        </Row>

        
    </>
  );
};

export default ViewHotel;
