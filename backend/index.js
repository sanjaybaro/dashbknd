const express = require('express');
const { connection } = require('./Config/db');
require('dotenv').config()
const cors = require('cors');
const { userRouter } = require('./Routes/UserRouter');


const app = express()
app.use(express.json())
app.use(cors())
app.use('/user', userRouter)
app.use('/userProfileUpdate', express.static('userProfile'));

app.listen(process.env.PORT, async()=>{
    try {
        console.log('connectig to DB');
        await connection;
        console.log(`server is running at port ${process.env.PORT}`);
    } catch (error) {
        console.log('something went wrong');
        console.log(error);
    }

})