const express = require('express')
const cors = require('cors')
require('./db/mongoose')//This line ensures that the file runs and connects to the database
const userRouter = require('./routers/user')
const ingredientRouter = require('./routers/ingredient')

const app = express()

const port = 3000 || process.env.PORT

app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(ingredientRouter)

app.listen(3000, () => {
    console.log('Server up and running on port: ' + port)
})