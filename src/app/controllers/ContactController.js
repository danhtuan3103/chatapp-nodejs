const Contact = require('../models/Contact');
const uniqid = require('uniqid');
class ContactController {
    index(req, res) {
        const { self, target } = req.body;

        Contact.findOne({ self: self })
            .then((result) => {
                if (!result) {
                    const newContact = new Contact({
                        self: self,
                        contact: { room_id: uniqid(), target },
                        z,
                    });
                    newContact
                        .save()
                        .then((conva) => {
                            res.status(200).send({
                                room_id: conva.contact[0].room_id,
                            });
                        })
                        .catch((error) => {
                            res.status(500).send({ message: 'Create contact error ', error: error });
                        });
                } else {
                    const contact = result.contact;
                    const room = contact.find((ct) => ct.target == target);
                    console.log(room);
                    res.status(200).send({
                        room_id: room.room_id,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: 'Find contact error ', error: err });
            });
    }
}

module.exports = new ContactController();
