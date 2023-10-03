import hallData from "./data.js";
import express from "express";
const app = express();
const PORT = 9000;

// Middleware
app.use(express.json());


// Getting specific room data
app.get("/hall-details", (request, response) => {
    const {roomtype} = request.query;
    //console.log(roomtype);

    //filtering only "e.g:Duplex room" data from the params value
    let filtered_Room
    if(roomtype) {
       filtered_Room = hallData.filter((hall)=>hall.RoomType === roomtype)
       return response.send(filtered_Room)
    }
    //if no "e.g:Duplex room" is available get all room data
    return response.send(hallData)
});


// Qn - 1:- Add a new room with new RoomId
app.post("/hall-details/add-room", (req, res) => {
  const id = req.body.RoomId  
  const halls = hallData.find((hall) => (hall.RoomId === id));
  
    if (halls) {
      res.status(400).send("Please give a new RoomId.");
      return;
    } 
    else {
      const newRoom = {
        id: hallData.length + 1,
        numberOfSeats: req.body.numberOfSeats,
        amenities: req.body.amenities,
        price: req.body.price,
        RoomType: req.body.RoomType,
        RoomId: req.body.RoomId,
      };
      hallData.push(newRoom);
      return res.send(newRoom);
    } 
});

// Qn - 2:- Book a room with unique RoomId & startTime
app.post("/hall-details/book-room", (req, res) => {
  const id = req.body.RoomId
  const time = req.body.startTime
  // book new room with unique RoomId & startTime
  const halls = hallData.find((hall) => ((hall.startTime === time) && (hall.RoomId === id)));

    if (halls) {
      res.status(400).send("Sorry, this room is already booked.");
      return;
    } 
    else {
      const newBooking = {
        id: hallData.length + 1,
        customerName: req.body.customerName,
        numberOfSeats: req.body.numberOfSeats,
        amenities: req.body.amenities,
        price: req.body.price,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        RoomType: req.body.RoomType,
        RoomId: req.body.RoomId,
        bookedStatus: req.body.bookedStatus
      };
    hallData.push(newBooking);
    return res.send(newBooking);
    } 
});

let filteredHall = hallData;
filteredHall = filteredHall.filter((halls) => halls.bookedStatus === "confirmed");

// Qn - 3:- Get booked rooms details
app.get("/hall-details/booked-rooms", (request, response) => {
  let booked_rooms=[];
    for(let i=0;i<filteredHall.length;i++){
      booked_rooms.push(`${filteredHall[i].RoomType} room(${filteredHall[i].RoomId}) booked by Mr/Mrs ${filteredHall[i].customerName} from ${filteredHall[i].startTime} to ${filteredHall[i].endTime}.`)
    }
  //console.log(booked_rooms);
  return response.send(booked_rooms)
});

// Qn - 4:- Get booked customers details
app.get("/hall-details/booked-customers", (request, response) => {
  let booked_customers=[];
    for(let i=0;i<filteredHall.length;i++){
      booked_customers.push(`Mr/Mrs ${filteredHall[i].customerName} booked ${filteredHall[i].RoomType} room(${filteredHall[i].RoomId}) from ${filteredHall[i].startTime} to ${filteredHall[i].endTime}.`)
    }
  //console.log(booked_customers);
  return response.send(booked_customers)
});

// Qn - 5:- Getting number of bookings of a specific customer
app.get("/hall-details/bookedCustomer", (request, response) => {
  const {customerName} = request.query;
  console.log(request.query, customerName);

  let specificCustomer;
    if (customerName) {
      specificCustomer = filteredHall.filter((halls) => halls.customerName == customerName);
    }
  
  response.send(specificCustomer);
});


// Edit booked/hold/not booked room
app.put("/hall-details/edit-room/:id", (req, res) => {
  const { id } = req.params;
  const halls = hallData.find((hall) => hall.id === id);

  halls.customerName = req.body.customerName;
  halls.date = req.body.date;
  halls.RoomId= req.body.RoomId;
  halls.numberOfSeats = req.body.numberOfSeats;
  halls.startTime = req.body.startTime;
  halls.endTime = req.body.endTime;
  halls.amenities = req.body.amenities;
  halls.price = req.body.price;
  halls.RoomType = req.body.RoomType;  
  halls.bookedStatus = req.body.bookedStatus;

  res.send(halls);
});

// Delivering the Port address
app.listen(PORT, () =>
  console.log(`Server started on port: localhost:${PORT}/hall-details`, PORT)
);