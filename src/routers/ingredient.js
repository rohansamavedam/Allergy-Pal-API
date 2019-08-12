const express = require('express')
const Ingredient = require('../models/ingredient')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/ingredient', auth, async (req, res) => {
    const ingredient = new Ingredient({
        ...req.body,
        owner: req.user._id
    })

    try{
        await ingredient.save()
        res.status(200).send(ingredient)
    }
    catch (error){
        console.log(error)
        res.status(500).send('Unable to Save ingredient')
    }
})

router.delete('/ingredient/:id', auth, async (req, res) => {
    try{
        const ingredient = await Ingredient.findOneAndDelete({_id: req.params.id, owner: req.user._id })
        if(!ingredient){
            res.status(404).send()
        }
        res.send(ingredient)
    }
    catch (error) {
        res.status(500).send()
    }
})

router.get('/ingredient/me', auth, async (req, res) => {
    try{
        const items = await Ingredient.find({owner: req.user._id})
        res.status(200).send(items)
    }
    catch (error) {
        res.status(500).send()
    }
})

module.exports = router