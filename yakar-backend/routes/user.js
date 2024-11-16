const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Fonction pour générer un code secret unique
const generateUniqueCode = async () => {
  let codeSecret;
  let isUnique = false;

  while (!isUnique) {
    codeSecret = Math.floor(1000 + Math.random() * 9000); // Valeur aléatoire entre 1000 et 9999
    const existingUser = await User.findOne({ codeSecret });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return codeSecret;
};
router.post('/register', async (req, res) => {
  const { prenom, nom, email, password, confirmPassword, photo, telephone, role } = req.body;

  // Validation des champs
  if (!prenom || !nom || !email || !password || !confirmPassword || !telephone || !role) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Génération du code secret unique
    const codeSecret = await generateUniqueCode();

    const newUser = new User({
      prenom,
      nom,
      email,
      password: hashedPassword,
      photo,
      telephone,
      role,
      codeSecret,  // Code secret sans cryptage
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur enregistré avec succès', user: newUser });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(400).json({ message: 'Erreur lors de l\'enregistrement', error: error.message });
  }
});

// Login with email and password
// Connexion avec email et mot de passe
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur introuvable.' });
    }

    // Vérifier le mot de passe hashé
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Répondre avec les données nécessaires (sans mot de passe)
    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// Connexion avec code secret
router.post('/login-secret', async (req, res) => {
  const { secretCode } = req.body;

  if (!secretCode || secretCode.length !== 4 || isNaN(secretCode)) {
    return res.status(400).json({ message: 'Code secret invalide.' });
  }

  try {
    const user = await User.findOne({ codeSecret: secretCode });
    if (!user) {
      return res.status(400).json({ message: 'Code secret incorrect.' });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


module.exports = router;
