import { getConfig } from "../../lib/utils/config";
import { decode } from 'jwt-simple';
import passport from 'passport';
import { findUserByName } from "../../services/user";


export const requireAuth = passport.authenticate('jwt', { session: false });

export const requireValidUser = (req, res, next) => {
	const token = decode(req.get('authorization'), getConfig().App.JwtSecret);
	req.authToken = token;
	findUserByName(token.username)
		.then((user) => {
			if (!user) {
				res.status(403).send('User logged in unknown');
			} else {
				next();
			}
		})
		.catch(() => {
			res.status(403).send('User logged in unknown');
		});
};


export const requireAdmin = (req, res, next) => {
	const token = decode(req.get('authorization'), getConfig().App.JwtSecret);
	if (token.role === 'admin') {
		next();
	} else {
		res.status(403).send('Only admin can use this function');
	}

};