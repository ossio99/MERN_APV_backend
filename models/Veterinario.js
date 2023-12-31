import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarId.js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
})

veterinarioSchema.pre('save', async function(next) {
    //para que un password que ya esta hasheado no lo vuelta a hashear
    //para cuando el user modifique su info
    //porque valida si no esta modificado???
    if(!this.isModified('password')) {
        console.log('se ejecuto el if');
         next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    console.log('se ejecuto el salt');
})

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema)
export default Veterinario