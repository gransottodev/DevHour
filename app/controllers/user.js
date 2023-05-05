const User = require("../models/User");

module.exports.register = async (application, req, res) => {
  const connection = require("../../config/db");
  const bcrypt = require("bcrypt");
  const erros = [];
  const User = require("../models/User");

  const {
    firstName,
    lastName,
    age,
    email,
    password,
    confirmPass,
    phoneNumber,
  } = req.body;

  if (!firstName) {
    erros.push("firstName is required!");
  }
  if (!lastName) {
    erros.push("lastName is required!");
  }
  if (!age) {
    erros.push("age is required!");
  }
  if (!email) {
    erros.push("email is required!");
  }
  if (!password) {
    erros.push("password is required!");
  }
  if (!confirmPass) {
    erros.push("confirmPass is required!");
  }
  if (!phoneNumber) {
    erros.push("phoneNumber is required!");
  }

  if (password !== confirmPass) {
    erros.push("passwords must be the same");
  }

  if (erros.length > 0) {
    return res.status(500).json({ erros });
  }

  //Verificar se o usuário existe
  const exist = await User.findOne({ email: email });

  if (exist) {
    erros.push("Usuário já cadastrado");
    return res.status(400).json({ erros });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  console.log(passwordHash);

  const user = new User({
    firstName,
    lastName,
    age,
    email,
    password: passwordHash,
    phoneNumber,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(400).json({ err });
  }
};

module.exports.login = async (application, req, res) => {
  const connection = require("../../config/db");
  const bcrypt = require("bcrypt");
  const User = require("../models/User");
  const jwt = require('jsonwebtoken')

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ msg: "Preencha email e senha para logar!" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ msg: "Usuário não encontrado!" });
  }

  //Comparar Password
  const checkPassword = bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(401).json({ msg: "Senha incorreta!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user.id,
      },
      secret
    );

    res.status(200).json({ msg: "Usuário logado!", token });
  } catch (error) {
    res.status(401).json({ error });
  }
};


module.exports.getById = async (application, req, res, checkToken) => {
  const connection = require("../../config/db");
  const id = req.params.id
  const User = require("../models/User");
  const jwt = require('jsonwebtoken')

  const user = await User.findById(id, '-password')

  res.json({user})

  
  function checkToken (req, res, next){
  
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
  
    if(!token){
      res.status(401).json({msg : 'Acesso negado'})
    }
  
    try{
  
      const secret = process.env.SECRET
      jwt.verify(token, secret)
  
      next()
  
    } catch(error) {
      res.status(400).json({msg : "Token inválido!"})
    }
  }
}