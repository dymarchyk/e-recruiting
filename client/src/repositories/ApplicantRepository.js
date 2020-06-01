import Request from '../services/Request'

class ApplicantRepository {
	getById = async (id) => {
		try {
			return Request.send({
				url:    'applicant/show/' + id,
				method: 'get'
			})
		}
		catch (e) {
			return null
		}
	}
}

export default new ApplicantRepository()