import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body

    //validando si existe el usuario
    const existeUsuario = await Veterinario.findOne({ email })

    if (existeUsuario) {
        const error = new Error('usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        //guardar nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        //enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }
}

const perfil = (req, res) => {
    const { veterinario } = req

    res.json(veterinario)
}

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Veterinario.findOne({ token })

    if (!usuarioConfirmar) {
        const error = new Error('token no valido')
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({ msg: 'usuario confirmado correctamente' })
    } catch (error) {
        console.log(error);
    }

}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email })

    if (!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(401).json({ msg: error.message })
    }

    //comprobar si el usaurio esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no esta confirmada')
        return res.status(401).json({ msg: error.message })
    }


    //revisar el password
    if (await usuario.comprobarPassword(password)) {
        //autenticar el usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error('Password incorrecto')
        return res.status(401).json({ msg: error.message })
    }
}

// const autenticar = async (req, res) => {
//     const { email, password } = req.body;

//     //comprobar si el usuario existe
//     const usuario = await Veterinario.findOne({ email })

//     if (!usuario) {
//         const error = new Error('El usuario no existe')
//         return res.status(401).json({ msg: error.message })
//     }

//     //comprobar si el usaurio esta confirmado
//     if (!usuario.confirmado) {
//         const error = new Error('Tu cuenta no esta confirmada')
//         return res.status(401).json({ msg: error.message })
//     }

//     //revisar el password
//     if (await usuario.comprobarPassword(password)) {
//         //autenticar el usuario
//         res.json({ token: generarJWT(usuario.id) })
//     } else {
//         const error = new Error('Password incorrecto')
//         return res.status(401).json({ msg: error.message })
//     }
// }

const olvidePassword = async (req, res) => {
    const { email } = req.body
    const existeVeterinario = await Veterinario.findOne({ email })
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe')
        return res.status(400).json({ msg: error.message })
    }

    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: 'Hemos enviado un email con las instrucciones' })
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params

    const tokenValido = await Veterinario.findOne({ token })

    if (tokenValido) {
        //el token es valido el usuario existe
        res.send('token valido')
    } else {
        const error = new Error('Token no valido')
        res.status(400).json({ msg: error.message })
    }

}

const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const veterinario = await Veterinario.findOne({ token })
    // console.log(veterinario);
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({ msg: 'Password modificado correctamente' })
    } catch (error) {
        console.log(error);
    }
}

//
const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }



    //validamos que no exista el nuevo email
    const { email } = req.body
    if (veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({ email })

        if (existeEmail) {
            const error = new Error('El email ya esta en uso')
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    //leer los datos
    const { id } = req.veterinario
    const { pwd_nuevo, pwd_actual } = req.body

    //comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    //comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        //almacenar el nuevo password
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({msg: 'Password almacenado correctamente'})
    } else {
        const error = new Error('El password actual es incorrecto')
        return res.status(400).json({ msg: error.message })
    }

}

export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword }