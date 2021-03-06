const express = require('express')
const cors = require('cors')
require('./db/mongoose')//This line ensures that the file runs and connects to the database
const userRouter = require('./routers/user')
const ingredientRouter = require('./routers/ingredient')

const app = express()

app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(ingredientRouter)

app.listen(process.env.PORT, () => {
    console.log('App running on ' + process.env.PORT)
})