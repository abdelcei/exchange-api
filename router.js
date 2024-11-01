const express = require('express')
const router = express.Router()
const { getInicio,
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
    calculateAllRatios } = require('./controllers')

router.route('/').get(getInicio)
router.route('/users').get(getUsers)
router.route('/user/:id').get(getUserById)
router.route('/user/:username').get(getUserByUserName)
router.route('/:user/offers').get( getOfferByUserId)
router.route('/user').post(postUser)
router.route('/user').put(updateUser)
router.route('/user').delete(deleteUser)

router.route('/offers').get(getOffers)
router.route('/offer/:id').get( getOfferById)
router.route('/offer').post(    postOffer)
router.route('/offer').put(     updateOffer)
router.route('/offer').delete(  deleteOffer)

router.route('/rates').get(  calculateAllRatios)

module.exports = router