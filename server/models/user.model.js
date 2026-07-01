import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {type: String, required:true, unique:true},
    email: {type:String, required:true, lowercase:true, trim:true},
    password: {type:String, required:true, minlenght:6, trim:true},
    role: {type:String, required:true, default:'user'},
    image: {type:String},
    isActive: {type:Boolean, default:false},
    token: {type:String}
}, {timestamps:true})

const User = mongoose.model('users', userSchema)
export default User