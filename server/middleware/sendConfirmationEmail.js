import nodemailer from 'nodemailer'

export default async function sendConfirmationEmail(destinataire, url) {
    // 1. Configuration du transporteur (le service qui va envoyer l'e-mail)
    // On utilise ici Gmail en récupérant les identifiants sécurisés depuis les variables d'environnement (.env)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GUSER,
            pass: process.env.GPASS, //mot de passe d'application
        }
    })
    // 2. Définition du contenu et des options de l'e-mail
    const mailOptions = {
        from: process.env.GUSER, //L'expéditeur
        to: destinataire,        //Le destinataire
        subject: 'Confirmer votre Email', //L'objet
        html: `
            <h1>Bienvenue</h1>
            <p>Clique !
                <a href="${url}">Là, ici</a>
            </p>
        ` //Le corps
    }

    // 3. Envoi effectif de l'e-mail avec gestion des erreurs
    try {
        // Attente de la réponse de l'envoi de l'e-mail (opération asynchrone)
        await transporter.sendMail(mailOptions)
        console.log('email envoyé')
    } catch (err) {
        console.log("Erreur lors de l'envoi de l'email", err)
    }
}