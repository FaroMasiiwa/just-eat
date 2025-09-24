require('dotenv').config();

const express       = require('express');
const app           = express();
const http          = require('http');
const server        = http.createServer(app);
const { Server }    = require('socket.io');
const seedMenu      = require('./utils/seedMenu');
const { processMessage } = require('./controllers/botController');


const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const connectDB     = require('./config/db');



const PORT = process.env.PORT;

(async () => {
  await connectDB();
  await seedMenu();
})();

//Middleware
app.use(express.json());
app.use(express.static('public'));


io.on('connection', socket => {
  console.log('User connected');

  socket.emit("botMessage", 
    `Welcome! Please choose an option:\n
     1. Place an order\n
     99. Checkout order\n
     98. See order history\n
     97. See current order\n
     0. Cancel order`
  );

  // Listen for messages from frontend
  socket.on('message', async ({ sessionId, message }) => {
    const response = await processMessage(sessionId, message);

    // If response includes a Paystack URL, send clickable link
    if(typeof response === 'object' && response.paystackUrl) {
      socket.emit('botMessage', `Payment link: <a href="${response.paystackUrl}" target="_blank">Pay Here</a>`);
    } else {
      socket.emit('botMessage', response);
    }
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});


//Initialise server
server.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
})
