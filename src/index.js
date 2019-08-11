const express = require('express')
require('./db/mongoose')//This line ensures that the file runs and connects to the database
const userRouter = require('./routers/user')

const app = express()

const port = 3000 || process.env.PORT

app.use(express.json())
app.use(userRouter)

app.listen(3000, () => {
    console.log('Server up and running on port: ' + port)
})