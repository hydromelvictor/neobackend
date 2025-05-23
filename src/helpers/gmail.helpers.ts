import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Création du transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NEO_EMAIL,
        pass: process.env.NEO_EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,  // Autoriser les connexions non sécurisées pour certains cas
    },
});

// Fonction d'envoi d'email
const gmail = async (
    to: string,
    subject: string,
    htmlContent: string
): Promise<boolean | null> => {
    try {
        const info = await transporter.sendMail({
            from: process.env.NEO_EMAIL,
            to,
            subject,
            html: htmlContent,
        });
        console.log('Email envoyé');
        return true;
    } catch (err) {
        console.error("Erreur lors de l'envoi de l'email :", err);
        return null;
    }
};

export default gmail;
