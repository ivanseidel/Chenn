var env = process.env;
var port = process.env.PORT || 3000;
var domain = 'http://localhost:'+port;

module.exports = {
	port: port,
	domain: domain,

	session: {
		secret: 'w@i@s@e@p@i@x',
	},
	
	db: env.MONGODB_URL || 'mongodb://localhost:27017/wisepix_development',
	
	facebook: {
		clientID: '875357199180183',
		clientSecret: '3ee434f170563dcce4be88b454f59a27',
		callbackURL: domain + '/auth/facebook-callback',
		scope: [
			'email',
			'user_photos',
			'user_friends',
			'user_about_me',
			'publish_actions',
		]
	},
};