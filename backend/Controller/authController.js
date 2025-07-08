const User = require("../Model/User");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");



const createToken=(name,id )=>
    {
         return jwt.sign({name,id }, 
        process.env.SECRET_KEY,
        {expiresIn: "30d"

         })
    }
exports.signup = async (req, res) => {
  console.log(req.body); 
    try {
        const { name,email,role,password,confirmPassword,age,birthdate,gender}= req.body
        console.log("create ");
        const newUser = await User.create({
        
        name , 
        email,
        role,
        password ,
        confirmPassword,
        age ,
        birthdate,
        gender
    });
      res.status(201).json({
        status: "success",
        data: { newUser },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail ",
        message: err,
      });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Vérifier si l'email et le mot de passe sont fournis
      if (!email || !password) {
        return res.status(400).json({
          status: "fail",
          message: "L'email et le mot de passe sont requis.",
        });
      }
  
      // Vérifier si l'email existe dans la base de données
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Email incorrect ou utilisateur non trouvé.",
        });
      }
  
      // Vérifier si le mot de passe est correct
     const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(400).json({
          status: "fail",
          message: "Mot de passe incorrect.",
        });
      }
  
      // Si tout est valide, générer un token et renvoyer une réponse réussie
      const token = createToken(user.name, user._id);
      res.status(200).json({
        status: "success",
        message: "Connexion réussie.",
        token,
        data: { user },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: "Une erreur s'est produite lors de la connexion.",
        error: err.message, // Renvoyer uniquement le message d'erreur pour plus de clarté
      });
    }
  };
 exports.protectionMW = async (req, res, next) => {
  try {
    console.log('[protectionMW] Starting middleware'); // Debug log
    
    let token;
    // 1) Check if user is logged in
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log('[protectionMW] Token found:', token); // Debug log
    }
    
    if (!token) {
      console.log('[protectionMW] No token provided'); // Debug log
      return res.status(401).json({
        status: "fail",
        message: "You need to be logged in to access this resource",
      });
    }

    // 2) Verify token validity
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
      console.log('[protectionMW] Decoded token:', decoded); // Debug log
    } catch (jwtError) {
      console.error('[protectionMW] JWT verification error:', jwtError); // Debug log
      return res.status(401).json({
        status: "fail",
        message: "Invalid or expired token",
      });
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log('[protectionMW] User not found for ID:', decoded.id); // Debug log
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists",
      });
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      console.log('[protectionMW] Password changed after token issued'); // Debug log
      return res.status(401).json({
        status: "fail",
        message: "User recently changed password. Please log in again",
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    console.log('[protectionMW] User authenticated:', currentUser.email); // Debug log
    next();
  } catch (error) {
    console.error('[protectionMW] Unexpected error:', error); // Debug log
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during authentication",
      error: error.message // Include actual error message
    });
  }
};
  
exports.howCanDo = (...roles) => {
  return (req, res, next) => { // Removed async since we don't need await
    console.log('[howCanDo] Checking roles:', roles); // Debug log
    console.log('[howCanDo] User role:', req.user?.role); // Debug log
    
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      console.log('[howCanDo] User or role missing'); // Debug log
      return res.status(403).json({
        status: "fail",
        message: "Access denied - user information missing",
      });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      console.log('[howCanDo] Role not allowed'); // Debug log
      return res.status(403).json({
        status: "fail",
        message: `Access denied - required roles: ${roles.join(', ')}`,
        yourRole: req.user.role // Include user's actual role in response
      });
    }

    console.log('[howCanDo] Role check passed'); // Debug log
    next();
  };
};
  exports.logout = (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Logged out successfully.",
      token: null, // Le client peut vider son stockage local en réponse
    });
  };


  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "Cet email n'existe pas.",
        });
      }
  
      const resetCode = crypto.randomInt(100000, 999999).toString();
      user.resetCode = resetCode;
      user.resetCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);
      if (user.resetCodeExpiration < new Date()) {
        return res.status(400).json({
          status: "fail",
          message: "Le code de réinitialisation a expiré.",
        });
      }
      await user.save();
  
      await sendEmail({
        email: user.email,
        subject: "Réinitialisation de votre mot de passe",
        message: `Bonjour, voici votre code de réinitialisation : ${resetCode}. Il est valide pendant 10 minutes.`,
      });
  
      res.status(200).json({
        status: "success",
        message: "Un email de réinitialisation a été envoyé.",
      });
    } catch (err) {
      console.error("Erreur :", err);
      res.status(500).json({
        status: "fail",
        message: "Erreur lors de l'envoi de l'email.",
      });
    }
  };
  exports.resetPassword = async (req, res) => {
    const { email, resetCode, newPassword, confirmPassword } = req.body;
  
    try {
      // 1) Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "Cet email n'existe pas.",
        });
      }
  
      // 2) Vérifier si le code de réinitialisation est correct et non expiré
      if (user.resetCode !== resetCode || user.resetCodeExpiration < new Date()) {
        return res.status(400).json({
          status: "fail",
          message: "Code de réinitialisation invalide ou expiré.",
        });
      }
  
      // 3) Afficher les logs pour déboguer
      console.log("Nouveau mot de passe :", newPassword);
      console.log("Confirmation du mot de passe :", confirmPassword);
  
      // 4) Vérifier si le nouveau mot de passe correspond à la confirmation
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: "fail",
          message: "Les mots de passe ne correspondent pas.",
        });
      }
  
      // 5) Mettre à jour le mot de passe de l'utilisateur
      user.password = newPassword;
      user.confirmPassword = confirmPassword;
      user.resetCode = undefined; // Effacer le code de réinitialisation
      user.resetCodeExpiration = undefined; // Effacer la date d'expiration
      await user.save();
  
      // 6) Répondre avec un message de succès
      res.status(200).json({
        status: "success",
        message: "Mot de passe réinitialisé avec succès.",
      });
    } catch (err) {
      console.error("Erreur :", err);
      res.status(500).json({
        status: "fail",
        message: "Erreur lors de la réinitialisation du mot de passe.",
      });
    }
  };