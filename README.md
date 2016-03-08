# WisePix Server

Main routes:

/client 	-> Publicly available, but requires Facebook auth for some cases

/api		-> Administration level only. Forbidden except for Authentication routes

/auth 		-> Authentication handling for both cases. Logs in with Facebook or Local user/pass


/client
	
	/me (Requires Authentication and Facebook link)
		/participations
			/id
				/collect-tag [tagName]
				/uncollect-tag [tagName]

	/tags
		/find [name]

