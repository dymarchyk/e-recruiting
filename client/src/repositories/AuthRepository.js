import Request from '../services/Request'

class AuthRepository {
	
	register = (data) => {
		return Request.send({ url: 'auth/register', method: 'post', data })
	}
	login = (data) => {
		return Request.send({ url: 'auth/login', method: 'post', data })
	}
	logOut = () => {
		return Request.send({ url: 'auth/logout', method: 'post' })
	}
	
	getUser = () => {
		return Request.send({ url: 'auth/info', method: 'post' })
	}
}

export default new AuthRepository()