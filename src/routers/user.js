const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)         //Creating a new user will add a new user to the db
    try{                                    //Method with async await
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch (error){
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch (error) {
        res.status(400).send('Error Logging In')
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(error){
        res.status(500).send()
    }
})

router.get('/users/me', auth, (req, res) => {
    res.send(req.user)
})

// router.post('/users/allergy', auth, async(req, res) => {
//     try {
//         const len = req.user.allergicItems.length;
//         console.log(len)
//         const allergyItem = req.body.allergyItem
//         console.log(req.user.allergicItems)
//         req.user.allergicItems[0] = {allergyItem}
//         console.log(req.user.allergicItems)
//         await req.user.save()
//         res.send()
//     }
//     catch (error) {
//         res.status(500).send(error)
//     }
// })

module.exports = router