// import nodemailer from 'nodemailer'
import sgMail from "@sendgrid/mail";

const emailOlvidePassword = async datos => {
    const { email, nombre, token } = datos

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: email,
        from: '178n0088@itstb.edu.mx',
        subject: 'Reestablece tu password',
        text: 'Reestablece tu password',
        html: `
                <p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
                <p>Da clic en el siguiente enlace para generar un nuevo password
                    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
                </p>
    
                <p>Si tu no hiciste esta accion, puedes ignorar este email</p>
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

// const emailOlvidePassword = async (datos) => {
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
//         subject: 'Reestablece tu password',
//         text: 'Reestablece tu password',
//         html: `
//             <p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
//             <p>Da clic en el siguiente enlace para generar un nuevo password
//                 <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
//             </p>

//             <p>Si tu no hiciste esta accion, puedes ignorar este email</p>
//         `
//     })

//     // console.log(info);
//     //forma de concatenar string
//     //luego accedemos a una propiedad de info
//     console.log("Mensaje enviado: %s", info.messageId);
// }

export default emailOlvidePassword