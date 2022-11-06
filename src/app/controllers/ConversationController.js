const Conversation = require('../models/Conversation');
const uniqid = require('uniqid');
class ConversationController {
    index(req, res) {
        const { self, target } = req.body;
        Conversation.findOne({ member1: self, member2: target })
            .then((result) => {
                if (!result) {
                    Conversation.findOne({ member1: target, member2: self }).then((result) => {
                        if (!result) {
                            console.log(result);
                            const conversation = new Conversation({
                                id: uniqid(),
                                member1: self,
                                member2: target,
                                message: [],
                            });

                            conversation
                                .save()
                                .then((result) => {
                                    console.log('create ');
                                    res.status(200).send({ data: result });
                                })
                                .catch((err) => {
                                    res.status(500).send({ err: err, message: 'Create Convesation error' });
                                });
                        } else {
                            console.log(result);
                            res.status(200).send({
                                data: result,
                            });
                        }
                    });
                } else {
                    console.log(result);
                    res.status(200).send({
                        data: result,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({ err: err, message: 'Create Convesation error' });
            });
    }

    sendMessage(req, res) {
        const { room, content, sender } = req.body;

        Conversation.findOneAndUpdate({ id: room }, { $push: { message: { sender, content } } })
            .then((result) => {
                res.status(200).send({
                    message: 'Send Success',
                    data: result,
                });
            })
            .catch((err) => {
                res.send(500).send({
                    message: 'Error with fin and update message',
                    error: err,
                });
            });
    }

    findAllByUser(req, res) {
        const users = new Set();
        Conversation.find({ member1: req.body.email }).then((result) => {
            users.add(...result);
            Conversation.find({ member2: req.body.email }).then((result) => {
                users.add(...result);

                const listChated = Array.from(users);
                res.status(200).send({ message: 'List Chated Users ', data: listChated });
            });
        });
    }
}

module.exports = new ConversationController();
