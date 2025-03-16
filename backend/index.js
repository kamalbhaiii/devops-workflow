const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.json())

const UserSchema = new mongoose.Schema({ username: String, email: String, password: String });
const User = mongoose.model("User", UserSchema);

app.post("/signup", async (req,res) => {
    const {username, email, password} = req.body;

    try{
        const newUser = new User({username, email, password})

        await newUser.save()

        res.status(200).json({
            status:200,
            message: "User registered successfully.",
            data: newUser._id
        })
    }
    catch(err){
        res.status(400).json({
            status:400, 
            message: err.message
        })
    }
})


mongoose.connect(`${process.env.DB_URL}`).then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log(err)
})
