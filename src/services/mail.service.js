const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

/**
 * Envía un correo con código de verificación
 * @param {string} to - correo destino
 * @param {string} code - código a enviar
 */
const sendVerificationCode = async (to, code) => {
    try {
        const info = await transporter.sendMail({
            from: `"Mi App" <${process.env.MAIL_USER}>`,
            to,
            subject: 'Código de verificación',
            text: `Tu código de verificación es: ${code}`,
            html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Verificación</h2>
          <p>Tu código es:</p>
          <h1 style="letter-spacing: 5px;">${code}</h1>
          <p>Este código expira en unos minutos.</p>
        </div>
      `
        });

        return info;
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw new Error('No se pudo enviar el correo');
    }
};

module.exports = {
    sendVerificationCode
};
