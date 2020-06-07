import {
	observable,
	action,
	computed
}                     from 'mobx'
import AuthRepository from '../repositories/AuthRepository'

class UserState {
	repository = AuthRepository
	@observable user = null
	
	@computed
	get isAuthorized() {
		return this.user !== null
	}
	
	
	@action
	async getUser() {
		this.user = await this.repository.getUser()
	}
	
	@action
	async login(data) {
		this.user = await this.repository.login(data)
	}
	
	@action
	logout() {
		return this.repository.logOut()
				   .finally(() => {
					   this.user = null
				   })
	}
	
	@action
	async register(data) {
		this.user = await this.repository.register(data)
	}
}

export default new UserState()