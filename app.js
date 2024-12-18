const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');


let parkings = require('./parkings.json');
let reservations = require('./reservations.json'); // Assurez-vous que ce fichier existe

app.use(bodyParser.json());

app.use('/', (req, res) => {
    res.status(200).json(parkings);
});

app.get('/parkings', (req, res) => {
    res.status(200).json(parkings);
});


app.post('/parkings', (req, res) => {
    const newParking = {
        id: parkings.length > 0 ? parkings[parkings.length - 1].id + 1 : 1,
        name: req.body.name,
        type: req.body.type,
        city: req.body.city
    };

    parkings.push(newParking);
    fs.writeFileSync('./parkings.json', JSON.stringify(parkings, null, 2));
    res.status(201).json(newParking);
});


app.get('/parkings/:id', (req, res) => {
    const parking = parkings.find(p => p.id === parseInt(req.params.id));
    if (!parking) return res.status(404).send('Parking not found');
    res.json(parking);
});


app.delete('/parkings/:id', (req, res) => {
    const parkingId = parseInt(req.params.id);
    const parkingIndex = parkings.findIndex(p => p.id === parkingId);

    if (parkingIndex === -1) {
        return res.status(404).send('Parking not found');
    }

    const deletedParking = parkings.splice(parkingIndex, 1)[0];
    fs.writeFileSync('./parkings.json', JSON.stringify(parkings, null, 2));
    res.status(200).json(deletedParking);
});


app.post('/parkings/:id/reservations', (req, res) => {
    const parkingId = parseInt(req.params.id);


    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return res.status(404).send('Parking not found');

    const newReservation = {
        id: reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1,
        parkingId,
        city: parking.city, 
        clientName: req.body.clientName,
        vehicle: req.body.vehicle,
        licensePlate: req.body.licensePlate,
        checkin: req.body.checkin,
        checkout: req.body.checkout
    };

    reservations.push(newReservation);
    fs.writeFileSync('./reservations.json', JSON.stringify(reservations, null, 2));
    res.status(201).json(newReservation);
});


app.post('/reservations', (req, res) => {
    const { parkingId, clientName } = req.body;


    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return res.status(404).send('Parking not found');

    const newReservation = {
        id: reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1,
        parkingId,
        clientName,
        date: new Date().toISOString()
    };

    reservations.push(newReservation);
    fs.writeFileSync('./reservations.json', JSON.stringify(reservations, null, 2));
    res.status(201).json(newReservation);
});


app.get('/reservations', (req, res) => {
    res.status(200).json(reservations);
});


app.get('/reservations/:id', (req, res) => {
    const reservation = reservations.find(r => r.id === parseInt(req.params.id));
    if (!reservation) return res.status(404).send('Reservation not found');
    res.json(reservation);
});


app.put('/parkings/:parkingId/reservations/:id', (req, res) => {
    const parkingId = parseInt(req.params.parkingId);
    const reservationId = parseInt(req.params.id);


    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) return res.status(404).send('Parking not found');


    const reservationIndex = reservations.findIndex(r => r.id === reservationId && r.parkingId === parkingId);
    if (reservationIndex === -1) {
        return res.status(404).send('Reservation not found');
    }


    const updatedReservation = {
        ...reservations[reservationIndex],
        clientName: req.body.clientName || reservations[reservationIndex].clientName,
        city:req.body.city || reservations[reservationIndex].city,
        vehicle: req.body.vehicle || reservations[reservationIndex].vehicle,
        licensePlate: req.body.licensePlate || reservations[reservationIndex].licensePlate,
        checkin: req.body.checkin || reservations[reservationIndex].checkin,
        checkout: req.body.checkout || reservations[reservationIndex].checkout
    };

    reservations[reservationIndex] = updatedReservation;
    fs.writeFileSync('./reservations.json', JSON.stringify(reservations, null, 2));

    res.status(200).json(updatedReservation);
});




app.delete('/parkings/:parkingId/reservations/:id', (req, res) => {
    const parkingId = parseInt(req.params.parkingId);
    const reservationId = parseInt(req.params.id);

    // Vérifiez si le parking existe
    const parking = parkings.find(p => p.id === parkingId);
    if (!parking) {
        return res.status(404).send('Parking not found');
    }


    const reservationIndex = reservations.findIndex(
        r => r.id === reservationId && r.parkingId === parkingId
    );


    if (reservationIndex === -1) {
        return res.status(404).send('Reservation not found');
    }


    const deletedReservation = reservations.splice(reservationIndex, 1)[0];


    fs.writeFileSync('./reservations.json', JSON.stringify(reservations, null, 2));


    res.status(200).json(deletedReservation);
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
