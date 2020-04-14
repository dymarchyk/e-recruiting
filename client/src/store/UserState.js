import { observable, action, computed } from 'mobx'

class UserState {
	@observable user = null
	
	@computed
	get isAuthorized() {
		return this.user !== null
	}
	
	@action setUser = user => this.user = user
}

export default new UserState()