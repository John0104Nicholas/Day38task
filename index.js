const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());


  rooms = [];
  customers = [];
  bookings = [];
  
  //1. Creating a Room


  app.post('/rooms', (req, res) => {
    const { numberofseats, amenities, pricePerHour } = req.body;
    const room = {
        id: rooms.length + 1,
        numberofseats,
        amenities,
        pricePerHour
    };
    rooms.push(room);
    res.status(201).json(room);
});

//2. Booking a Room


app.post('/bookings', (req, res) => {
    const { customerName, roomId, date, startTime, endTime } = req.body;
    const booking = {
        id: bookings.length + 1,
        date,
        startTime,
        endTime,
        roomId,
    };
    bookings.push(booking);
    res.status(201).json(booking);
});


//3. List All Rooms with Booked Data


app.get('/rooms', (req, res) => {
    const roomsWithBookings = rooms.map(room => ({
        ...room,
        bookings: bookings.filter(booking => booking.roomId === room.id),
    }));
    res.json(roomsWithBookings);
});

//4. List All Customers with Booked Data


app.get('/customers', (req, res) => {
    const customerBookings = bookings.map(booking => {
        const room = rooms.find(room => room.id === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: room ? room.roomName : 'Unknown',
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });
    res.send(customerBookings);
});

//5. List How Many Times a Customer Has Booked the Room


app.get('/customers/customerbookingcount', (req, res) => {
    let customerStats = {};
    bookings.forEach(booking => {
        const key = booking.customerName;
        if (!customerStats[key]) {
            customerStats[key] = { count: 0, bookings: [] };
        }
        customerStats[key].count += 1;
        customerStats[key].bookings.push(booking);
    });

    res.send(customerStats);
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
