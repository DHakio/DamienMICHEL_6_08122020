const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Crypto = require('../classes/Crypto');

const crypto = new Crypto();

exports.signup = (request, response, next) => {
    // Request : {email: String, password: String}
    // Response : {message: String}
    bcrypt.hash(request.body.password, 10)
        .then(hash => {
            let crypted_email = crypto.encrypt(request.body.email);
            const user = new User({
                email: crypted_email,
                password: hash
            });
            user.save()
                .then(() => {
                    response.status(201).json({message: 'L\'utilisateur a bien été créé.'})
                })
                .catch(error => response.status(400).json({error}));
        })
        .catch(error => response.status(500).json({error}));
}

exports.login = (request, response, next) => {
    // Request : {email: String, password: String}
    // Response : {userId: String, token: String}
    let encrypted_email = crypto.encrypt(request.body.email);
    User.findOne({email: encrypted_email})
        .then(user => {
            if(!user) {
                return response.status(401).json({error: 'Mot de passe incorrect'});
            }
            bcrypt.compare(request.body.password, user.password)
                .then(isValid => {
                    if(!isValid) {
                        return response.status(401).json({error: 'Mot de pass incorrect'});
                    }
                    response.status(200).json({
                        userId:user._id,
                        token: jwt.sign({userId: user._id}, ENCODING_KEY, {expiresIn: '12h'})
                    });
                })
                .catch(error => response.status(500).json({error}));
        })
        .catch(error => response.status(500).json({error}));
}