const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    { username: String, name: String, last_name: String, email: String, password: String, created_at: Date, last_login: Date,},
    { collection : 'users'})

const offerSchema = new mongoose.Schema(
    { creator_id: String, currency_from: String, currency_to: String, amount_min: Number, amount_max: Number, rate: Number, description: String, status: String, created_at: Date, updated_at: Date },
    { collection : 'offers'})

const User = mongoose.model( 'User', userSchema)
const Offer = mongoose.model( 'Offers', offerSchema)


const getInicio = async (req, res) => {

    return res.json("Haciendo get en /")
}

const getUsers = async (req, res) => {

    try {
        const buscar = await User.find()
        return res.status(200).json(buscar)
    } catch (error) {
        return res.status(500).json(error)
    }
    
}

const getUserById = async ( req , res )=> {

    try {
        
        const { id } = req.params
    
        const user = await User.findById(id)

        const offers = await Offer.find({creator_id : id})
    
        res.status(200).json({ ...user.toObject(), offers})
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const getUserByUserName = async ( req , res )=> {

    try {
        
        const { username } = req.params
    
        const user = await User.findById(id)

        const offers = await Offer.find({username : username})
    
        res.status(200).json({ ...user.toObject(), offers})
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const postUser = async ( req , res , next )=>{

    try {

        // const { username, name, last_name, email, password, created_at, last_login} = req.body
        const { username, name, last_name, email, password} = req.body

        const actualDate = new Date()

        const newUser = new User({
            username, 
            name, 
            last_name, 
            email, 
            password, 
            created_at: actualDate, 
            last_login: actualDate,
        })

        await newUser.save()

        const buscar = await User.find()

        res.status(201).json(buscar)

    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }


}

const updateUser = async ( req , res , next )=>{

    try {

        const { id , ...datos } = req.body

        await User.findByIdAndUpdate( id , datos )

        const buscar = await User.find()

        res.status(201).json(buscar)
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }


}

const deleteUser = async ( req , res , next )=>{

    try {

        const {id} = req.body

        await User.findByIdAndDelete(id)

        const buscar = await User.find()

        res.status(201).json(buscar)

    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }


}

const getOffers = async (req, res) => {

    try {
        const buscar = await Offer.find()
        return res.status(200).json(buscar)
    } catch (error) {
        return res.status(500).json(error)
    }

}

const getOfferById = async (req, res) => {

    try {

        const { id } = req.params
        
        const buscar = await Offer.findById(id)
        
        return res.status(200).json(buscar)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const getOfferByUserId = async (req, res) => {

    try {

        const { user : userId } = req.params
        
        const buscar = await Offer.find({creator_id : userId})
        
        return res.status(200).json(buscar)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const postOffer = async ( req , res , next )=>{

    /* 
    { creator_id,: String, 
      currency_from,: String, 
      currency_to,: String, 
      amount_min,: Number, 
      amount_max,: Number, 
      rate,: Number, 
      description,: String, 
      status,: String, 
      created_at,: String, 
      updated_at,: String },
    */

    try {

        const { creator_id,
                currency_from,
                currency_to,
                amount_min,
                amount_max,
                rate,
                description} = req.body

        const actualDate = new Date()

        const newOffer = new Offer({
            creator_id,
            currency_from,
            currency_to,
            amount_min,
            amount_max,
            rate,
            description,
            status : 'open',
            created_at: actualDate, 
            updated_at: actualDate,
        })

        await newOffer.save()

        const buscar = await Offer.find()

        res.status(201).json(buscar)
        
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }


}

const updateOffer = async ( req , res , next )=>{

    try {

        const { id , ...datos } = req.body

        const actualDate = new Date()

        await Offer.findByIdAndUpdate( id , {...datos, updated_at: actualDate} )

        const buscar = await Offer.find()

        res.status(201).json(buscar)
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }


}

const deleteOffer = async ( req , res , next )=>{

    try {

        const {id} = req.body

        await Offer.findByIdAndDelete(id)

        const buscar = await Offer.find()

        res.status(201).json(buscar)

    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }


}

const calculateAllRatios = async (req , res , next) => {

    try {
        const offers = await Offer.find()
        const pairs = {}

        offers.forEach(offer => {

            const {currency_from, currency_to , rate} = offer

            if(!pairs[currency_from]) pairs[currency_from] = {}

            if (!pairs[currency_from][currency_to]) {
                pairs[currency_from][currency_to] = { totalRates: 0, count: 0 };
            }

            pairs[currency_from][currency_to].totalRates += rate
            pairs[currency_from][currency_to].count++
            
        })

        const ratios = {}
        
        Object.keys(pairs).forEach(currency_from => {

            ratios[currency_from] = {}
            
            Object.keys(pairs[currency_from]).forEach(currency_to => {

                const { totalRates, count } = pairs[currency_from][currency_to]
                ratios[currency_from][currency_to] = totalRates / count
            })
        })

        res.status(201).json(ratios)
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
    

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
}