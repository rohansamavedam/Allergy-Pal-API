const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
     },
     email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
         validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please provide a valid email')
            }
        }
     },
     password: {
         type: String,
         required: true,
         trim: true,
         minlength: 7,
         validate(value){
            if(value.toLowerCase().includes("password") ){
                throw new Error('Please enter a stronger password')
            }
        }
     },
     tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    },
    {
        timestamps: true
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token: token})
    await user.save()
    return token
}

userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next() //need to call this method, or else the function will hang forever
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User