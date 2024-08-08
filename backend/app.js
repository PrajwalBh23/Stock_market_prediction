import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import './db/connection.js';
import auth from "./routes/auth.js";
// import router from "./routes/rooms.js";
import cors from 'cors';

const app = express();

dotenv.config({ path: './config.env' });

app.use(bodyParser.json({ limit: "50mb", extended: true })); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use(express.json());

app.use('/auth', auth);
// app.use('/stay', router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is on ${PORT}`);
})