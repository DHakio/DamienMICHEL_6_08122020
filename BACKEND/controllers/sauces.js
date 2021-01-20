const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAll = (request, response, next) => {
    // Request : null
    // Response : JSON of Sauces
    Sauce.find()
        .then(sauces => response.status(200).json(sauces))
        .catch(error => response.status(400).json({error}));
}

exports.getOne = (request, response, next) => {
    // Request : null
    // Response : Sauce
    Sauce.findOne({_id: request.params.id})
        .then(sauce => response.status(200).json(sauce))
        .catch(error => response.status(400).json({error}));
}

exports.save = (request, response, next) => {
    // Request : {sauce: String, image: File}
    // Response : {message : String}
    const sauce = new Sauce({
        ...JSON.parse(request.body.sauce),
        imageUrl: request.protocol + "://" + request.get('host') + "/images/" + request.file.filename
    });
    sauce.save()
        .then(() => response.status(201).json({message: 'La sauce a bien été enregistrée'}))
        .catch(error => response.status(400).json({error}))
}

exports.update = (request, response, next) => {
    // Request : Sauce || {sauce: Sauce, image: File}
    // Response : {message:  String}
    if(request.file) { 
        Sauce.findOne({_id: request.params.id})
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink('images/' + filename, () => {
                    Sauce.updateOne({_id: request.params.id}, {
                        _id: request.params.id,
                        ...JSON.parse(request.body.sauce),
                        imageUrl: request.protocol + "://" + request.get('host') + "/images/" + request.file.filename
                    })
                    .then(() => response.status(200).json({message: "Sauce modifiée avec succès."}))
                    .catch(error => response.status(400).json({error}));
                });
            })
            .catch(error => response.status(400).json({error}))
    }
    else {
        Sauce.updateOne({ _id: request.params.id }, { _id: request.params.id, ...request.body })
            .then(() => response.status(200).json({message: "Sauce modifiée avec succès."}))
            .catch(error => response.status(400).json({error}));
    }
}

exports.delete = (request, response, next) => {
    // Request : null
    // Response : {message: String}
    Sauce.findOne({_id: request.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: request.params.id})
                    .then(() => response.status(200).json({message: "La sauce a bien été supprimée."}))
                    .catch(error => response.status(400).json({error}));
            });
        })
        .catch(error => response.status(500).json({error}));
}

exports.like = (request, response, next) => {
    // Request : {userId: String, like: Number}
    // Response : { message : String}
    function deleteFromArray(array, element) {
        let index = array.indexOf(element);
        if(index > -1) {
            array.splice(index, 1);
        }
    }
    Sauce.findOne({_id: request.params.id})
        .then(sauce => {
            switch(request.body.like) {
                case 0:
                    if(sauce.usersLiked.includes(request.body.userId)) {
                        deleteFromArray(sauce.usersLiked, request.body.userId);
                        sauce.likes--;
                        sauce.save();
                        response.status(200).json({message: "Like supprimé."})
                    }
                    else if(sauce.usersDisliked.includes(request.body.userId)) {
                        deleteFromArray(sauce.usersDisliked, request.body.userId);
                        sauce.dislikes--;
                        sauce.save();
                        response.status(200).json({message: "Dislike supprimé."})
                    }
                    break;
                case 1:
                    if(!sauce.usersLiked.includes(request.body.userId)) {
                        sauce.usersLiked.push(request.body.userId);
                        sauce.likes++;
                        sauce.save();
                        response.status(200).json({message: "Like ajouté."})
                    }
                    break;
                case -1:
                    if(!sauce.usersDisliked.includes(request.body.userId)) {
                        sauce.usersDisliked.push(request.body.userId);
                        sauce.dislikes++;
                        sauce.save();
                        response.status(200).json({message: "Dislike ajouté."})
                    }
                    break;
                default:
                    break;
            }
        })
        .catch(error => response.status(500).json({error}));
}