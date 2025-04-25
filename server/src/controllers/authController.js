const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email ou nom d'utilisateur déjà utilisé" });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Générer le token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

JWT_SECRET =
  "3cadf123a0f34b20678d9c3cf3758cbad69abf540a68c22752e42ced1ada2d55a31c95a5d5123cf2b44bb11c3dc4229351890c1430f891be7d26add155b38186";
JWT_EXPIRATION = "24h"; // ou toute autre durée souhaitée

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Personnalisation du token JWT
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role, // Ajout du rôle dans le payload si nécessaire
    };

    // Utilisation de la clé secrète et du temps d'expiration depuis .env
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION || "24h", // Durée configurable, avec un fallback à '24h'
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // Inclure le rôle si nécessaire
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le profil de l'utilisateur
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
