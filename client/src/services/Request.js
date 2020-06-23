import axios from 'axios'


class Request {
	_axios = axios.create({
							  baseURL        : process.env.REACT_API_API_URL || 'http://127.0.0.1:3333/api',
							  withCredentials: true
						  })
	
	send = async ({ url, data = {}, method = 'get', ...rest }) => {
		try {
			const res = await this._axios({
				url,
				method,
				data,
				...rest
			})
			return res.data
		}
		catch (e) {
			console.log('Request error', e)
			if (e?.response?.data) {
				throw e.response.data?.[0] ?? e.response.data
			}
			throw e.message
		}
	}
}

export default new Request()