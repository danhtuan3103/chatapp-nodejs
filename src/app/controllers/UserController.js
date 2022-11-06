const { User } = require('../models');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
class UserController {
    // [GET] /home
    index(req, res) {
        console.log(req.body);
        User.find({}, (err, users) => {
            if (!err) return res.json(users);
            return res.status(400).json({ data: [], error: err.message });
        });
    }

    register(request, response) {
        console.log(request.body);
        // hash the password
        bcrypt
            .hash(request.body.password, 10)
            .then((hashedPassword) => {
                // create a new user instance and collect the data
                const user = new User({
                    user_id: uniqid(),
                    name: request.body.name,
                    email: request.body.email,
                    avatar: request.body.avatar,
                    password: hashedPassword,
                    gender: '',
                });

                console.log(user);
                // save the new user
                user.save()
                    // return success if the new user is added to the database successfully
                    .then((result) => {
                        console.log(result);
                        response.status(201).send({
                            message: 'User Created Successfully',
                            result,
                        });
                    })
                    // catch error if the new user wasn't added successfully to the database
                    .catch((error) => {
                        console.log(error);
                        response.status(500).send({
                            message: 'Error creating user',
                            error,
                        });
                    });
            })
            // catch error if the password hash isn't successful
            .catch((e) => {
                response.status(500).send({
                    message: 'Password was not hashed successfully',
                    e,
                });
            });
    }

    // login endpoint
    login(request, response) {
        console.log(request.body);
        // check if email exists
        User.findOne({ email: request.body.email })

            // if email exists
            .then((user) => {
                // compare the password entered and the hashed password found
                bcrypt
                    .compare(request.body.password, user.password)

                    // if the passwords match
                    .then((passwordCheck) => {
                        // check if password matches
                        if (!passwordCheck) {
                            return response.status(400).send({
                                message: 'Passwords does not match',
                                error,
                            });
                        }

                        //   create JWT token
                        const token = jwt.sign(
                            {
                                userId: user.user_id,
                                userEmail: user.email,
                            },
                            'RANDOM-TOKEN',
                            { expiresIn: '24h' },
                        );

                        console.log(passwordCheck);

                        //   return success response
                        response.status(200).send({
                            message: 'Login Successful',
                            name: user.name,
                            email: user.email,
                            user_id: user.user_id,
                            token,
                            avatar: user.avatar,
                            gender: user.gender,
                        });
                    })
                    // catch error if password does not match
                    .catch((error) => {
                        response.status(400).send({
                            message: 'Passwords does not match',
                            error,
                        });
                    });
            })
            // catch error if email does not exist
            .catch((e) => {
                response.status(404).send({
                    message: 'Email not found',
                    e,
                });
            });
    }

    updateUser(req, res) {}

    getUser(req, res) {
        console.log(req.params.id);
        User.findOne({ user_id: req.params.id })
            .then((user) => {
                return res.send({ data: user });
            })
            .catch((err) => {
                return res.send({ error: err });
            });
    }

    // free endpoint
    freePoint(request, response) {
        response.json({ message: 'You are free to access me anytime' });
    }

    // authentication endpoint
    authPoint(request, response) {
        response.json({ message: 'You are authorized to access me' });
    }
}

module.exports = new UserController();
