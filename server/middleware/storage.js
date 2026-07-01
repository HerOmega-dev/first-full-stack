import multer from 'multer'
import path from 'path'

// 1. Configuration du moteur de stockage de Multer (diskStorage)
// On définit ici où et comment les fichiers téléchargés seront enregistrés sur le serveur.
const storage = multer.diskStorage({
    // Détermine le dossier de destination pour les fichiers téléversés
    destination: (req, file, cb) => {
        // cb(erreur, chemin_du_dossier)
        // null signifie qu'il n'y a pas d'erreur, et 'uploads/' est le dossier cible
        cb(null, 'uploads/')
    },
    // Détermine le nom que portera le fichier une fois enregistré
    filename: (req, file, cb) => {
        // Option 1 : générer un nom unique basé sur le timestamp actuel pour éviter les doublons
        const uniqueName = Date.now() + path.extname(file.originalname)
        // cb(null, uniqueName)
        // Option 2 : garder le nom d'origine. ! Si 2 utilisateurs envoient un fichier avec le même nom, le second écrasera le premier.
        cb(null, file.originalname)
    }
})

// 2. Initialisation du middleware Multer
// On crée l'instance 'upload' en lui passant notre configuration de stockage.
// C'est cet objet 'upload' qui sera utilisé ensuite dans vos routes Express (ex: upload.single('image'))
export const upload = multer({storage})