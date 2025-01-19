const mongoose = require("mongoose");

// Definicion del schema de User
const userSchema = new mongoose.Schema(
  {
    username: String,
    name: String,
    last_name: String,
    email: String,
    password: String,
    tg_handle: String,
    created_at: Date,
    last_login: Date,
  },
  { collection: "users" }
);

// Definicion del schema de Oferta
const offerSchema = new mongoose.Schema(
  {
    creator_id: String,
    currency_from: String,
    currency_to: String,
    amount_min: Number,
    amount_max: Number,
    rate: Number,
    description: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "offers" }
);

const User = mongoose.model("User", userSchema);
const Offer = mongoose.model("Offers", offerSchema);

const getInicio = async (req, res) => {
  return res.json("Haciendo get en /");
};

// Controlador para obtener listado de usuarios
const getUsers = async (req, res) => {
  try {
    const buscar = await User.find();
    return res.status(200).json(buscar);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Controlador para obtener usuario segun el ID

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener usuario segun el username
const getUserByUserName = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username });

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para crear usuario
// Recibe estos valores dentro del body
// username
// name
// last_name
// email
// password
const postUser = async (req, res, next) => {
  try {

    const { username, name, last_name, email, password } = req.body;

    const actualDate = new Date();

    const newUser = new User({
      username,
      name,
      last_name,
      email,
      password,
      created_at: actualDate,
      last_login: actualDate,
    });

    await newUser.save();

    const buscar = await User.find();

    res.status(201).json(buscar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para actualizar usuario
// Recibe estos valores dentro del body
// ID
// Datos actualizar
const updateUser = async (req, res, next) => {
  try {
    const { id, ...datos } = req.body;

    await User.findByIdAndUpdate(id, datos);

    const buscar = await User.find();

    res.status(201).json(buscar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;

    await User.findByIdAndDelete(id);

    const buscar = await User.find();

    res.status(201).json(buscar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para obtener listado de ofertas
const getOffers = async (req, res) => {

  try {
    const {limit, currencyFrom : currency_from , currencyTo : currency_to, amount } = req.query

    const query = {};

    if (currency_from) query.currency_from = currency_from;
    if (currency_to) query.currency_to = currency_to;
    
    if (amount) {
      const numericValue = Number(amount);
      if (isNaN(numericValue)) {
        return res.status(400).json({ error: "Invalid value parameter" });
      }
      query.amount_min = { $lte: numericValue };
      query.amount_max = { $gte: numericValue };
    }

      let buscar;
    if (limit) {
      buscar = await Offer.find(query).limit(Number(limit)).sort({ updated_at: -1 });
    } else {
      buscar = await Offer.find(query).limit(15).sort({ updated_at: -1 });
    }
    
    return res.status(200).json(buscar);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Controlador para obtener una oferta segun el ID
const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    const buscar = await Offer.findById(id);

    return res.status(200).json(buscar);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener listado de ofertas de un usuario especifico por su ID
const getOfferByUserId = async (req, res) => {
  try {
    const { user: userId } = req.params;

    const buscar = await Offer.find({ creator_id: userId }).sort({ updated_at: 1 });

    return res.status(200).json(buscar);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para crear una oferta
// Recibe estos valores dentro del body
// creator_id
// currency_from
// currency_to
// amount_min
// amount_max
// rate
// description
const postOffer = async (req, res, next) => {

  try {
    const {
      creator_id,
      currency_from,
      currency_to,
      amount_min,
      amount_max,
      rate,
      description,
    } = req.body;

    const actualDate = new Date();

    const newOffer = new Offer({
      creator_id,
      currency_from,
      currency_to,
      amount_min,
      amount_max,
      rate,
      description,
      created_at: actualDate,
      updated_at: actualDate,
    });

   await newOffer.save();
    
    const buscar = await Offer.find({ creator_id });

    res.status(201).json(buscar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para actualizar una oferta
// Recibe estos valores dentro del body
// id
// Datos actualizar
const updateOffer = async (req, res, next) => {
  try {
    const { id, creator_id, ...datos } = req.body;
    
    const actualDate = new Date();

    const updated = await Offer.findByIdAndUpdate(id, {creator_id, ...datos, updated_at: actualDate });

    const buscar = await Offer.find({ creator_id });

    res.status(201).json(buscar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para eliminar una oferta
const deleteOffer = async (req, res, next) => {
  try {
    
    const { id } = req.body;
    
    const {creator_id}  = await Offer.findByIdAndDelete(id);

    const buscar = await Offer.find({ creator_id });


    res.status(201).json(buscar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para calcular obtener listado de las tasas
const calculateAllRatios = async (req, res, next) => {
  try {

    const offers = await Offer.find();
    
    if (offers.length === 0) {
      return res.status(200).json({ message: 'No offers available', pairs: {} });
    }

    const pairs = {};

    offers.forEach((offer) => {
      const { currency_from, currency_to, rate, id} = offer;

      if (!pairs[currency_from]) pairs[currency_from] = {};

      if (!pairs[currency_from][currency_to]) {
        pairs[currency_from][currency_to] = { 
           totalRates: 0, count: 0, maxOffered : 0, maxOfferedId: '', minOffered : Infinity, minOfferedId: '' 
      }
  
      pairs[currency_from][currency_to].totalRates += rate;
      pairs[currency_from][currency_to].count++;

      if ( rate > pairs[currency_from][currency_to].maxOffered) {
        pairs[currency_from][currency_to].maxOffered = rate
        pairs[currency_from][currency_to].maxOfferedId = id
      } else if ( rate < pairs[currency_from][currency_to].minOffered) {
        pairs[currency_from][currency_to].minOffered = rate
        pairs[currency_from][currency_to].minOfferedId = id
      }
    }
    })
    
    const ratios = {};

    Object.keys(pairs).forEach((currency_from) => {
      ratios[currency_from] = {};

      Object.keys(pairs[currency_from]).forEach((currency_to) => {
        const { totalRates, count  } = pairs[currency_from][currency_to];
        ratios[currency_from][currency_to] = Number((totalRates / count).toFixed(2));
      });
    });

    res.status(201).json(ratios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para el login
const login = async (req, res, next) => {
  try {
    const { user, pass } = req.body;


    if (containsAtSymbol(user)) {
      if (isValidEmail(user)) {
        try {
          const userMatched = await User.findOne({ email: user });

          if (!userMatched == null) {
            return res
              .status(400)
              .json({ error: "No hay ningun usuario con ese mail" });
          }
          if (userMatched.password === pass) {
            res.status(200).json(userMatched.id);
          } else
            return res.status(400).json({ error: "Contraseña Incorrecta" });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(400).json({ error: "Email No valido" });
      }
    } else {

      try {
        const userMatched = await User.findOne({ username: user });

        if (userMatched.password == pass) {
          res.status(200).json({ id: userMatched.id });
        } else return res.status(400).json({ error: "Contraseña Incorrecta" });
      } catch (error) {
        res.status(400).json({ error: "Usuario y/o contraseña incorrecta" });
      }
    }
  } catch {
    res.status(400).json({ error: error.message });
  }
};

function containsAtSymbol(str) {
  return str.includes("@");
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  getInicio,
  getUsers,
  getUserById,
  getUserByUserName,
  postUser,
  updateUser,
  deleteUser,
  getOffers,
  getOfferById,
  postOffer,
  updateOffer,
  deleteOffer,
  getOfferByUserId,
  calculateAllRatios,
  login,
};
