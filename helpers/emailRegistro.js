// import nodemailer from 'nodemailer'
import sgMail from "@sendgrid/mail";

const emailRegistro = async datos => {
    const { email, nombre, token } = datos

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: email,
        // from: 'APV - Administrador de pacientes de veterinaria',
        from: '178n0088@itstb.edu.mx',
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `
                <p>Hola ${nombre}, comprueba tu cuenta en APV.</p>
                <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
                    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
                </p>
    
                <p>Si tu no creaste esta cuenta, puedes ignorar este email</p>
            `
    }

    //enviar email
    sgMail.send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

// const emailRegistro = async (datos) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     // console.log(`transporter: 
//     // ${transporter}`);
//     // console.log(transporter);

//     const { email, nombre, token } = datos

//     //enviar email
//     const info = await transporter.sendMail({
//         from: 'APV - Administrador de pacientes de veterinaria',
//         to: email,
//         subject: 'Comprueba tu cuenta en APV',
//         text: 'Comprueba tu cuenta en APV',
//         html: `
//             <p>Hola ${nombre}, comprueba tu cuenta en APV.</p>
//             <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
//                 <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
//             </p>

//             <p>Si tu no creaste esta cuenta, puedes ignorar este email</p>
//         `
//     })

//     console.log(info);
//     //forma de concatenar string
//     //luego accedemos a una propiedad de info
//     console.log("Mensaje enviado: %s", info.messageId);
// }

export default emailRegistro