const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function authenticate(req, res) {
	User.findOne({ username: req.body.username })
		.then(user => {
			if (user === null) 
			{
                bcrypt.hash(req.body.password, 5)
                .then(hash => {
                    const user = new User({
                        username: req.body.username,
                        password: hash
                    });
                    user.save()
                        .then((savedUser) => res.status(200).json(savedUser))
                        .catch(error => res.status(500).json({ error: error }));
                })
                .catch(error => res.status(500).json({ error:error }));
			}
			bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					if (!valid) 
					{
						return res.status(401).json({ error: 'Wrong password !' });
					}
					const token = jwt.sign({userId: user._id}, 'secret_key', {expiresIn: "1h"});
					res.status(200).json({userId: user._id, token: token});
				})
			.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
}

async function getUsers(token) {
	try {
		const users = await User.find();
		const data = users.map((user) => ({
		  username: user.username,
		  picture: user.picture,
		}));
		res.status(200).json({username: user.username, token: token})
	}
	catch(error){ res.status(500).json({ error })};

}

module.exports = {
    authenticate: authenticate,
    getUsers: getUsers
};