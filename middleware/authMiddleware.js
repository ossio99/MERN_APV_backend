import Veterinario from "../models/Veterinario.js"
import jwt from "jsonwebtoken"

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado')
            // console.log(req.veterinario);
            return next()
        } catch (e) {
            const error = new Error('Token no valido')
            return res.status(403).json({ msg: error.message })
        }
    }

    if (!token) {
        const error = new Error('Token no valido o inexistente')
        res.status(403).json({ msg: error.message })
    }

    next()
}

export default checkAuth