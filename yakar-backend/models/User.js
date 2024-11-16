const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: String,
  telephone: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'] },
  codeSecret: { type: String, required: true, unique: true }
});

userSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password); // Comparer les mots de passe
};

module.exports = mongoose.model('User', userSchema);
