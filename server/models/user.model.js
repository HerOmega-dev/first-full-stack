import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {type: String},
    email: {type:String, required:true, unique:true, lowercase:true, trim:true},
    password: {type:String, required:true, minlenght:3, trim:true},
    isActive: {type:Boolean, default:false}
}, {timestamps:true})

const User = mongoose.model('users', userSchema)
export default User