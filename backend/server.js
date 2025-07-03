const express = require('express')
const server= express(); /*l'app est une instance d'express */
const cors = require('cors');


const dotenv =require('dotenv')
dotenv.config({path:"./.env"});
const  mongoose =require('mongoose');
server.use(express.json());
const port = process.env.PORT || 5000;
server.listen(port,()=>{
    console.log(`App is running  on port ; ${port}...`)

}
); 
server.use(cors({ origin: 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  
}));

const userRoutes = require("./Routes/UserRoutes");
server.use('/users', userRoutes);
const DB = process.env.DATABASE.replace("<db_password>",process.env.DATABASE_PASSWORD);
mongoose
.connect(DB)
.then((connection)=>{
    console.log("DB connected suc ");

})
.catch((err) => {
    console.log(err);
}); 