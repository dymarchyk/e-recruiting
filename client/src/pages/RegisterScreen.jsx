import { observer }         from 'mobx-react'
import React, { Component } from 'react';
import { Link }             from 'react-router-dom'
import Input                from '../components/Input'
import UserState            from '../store/UserState'

@observer
class RegisterScreen extends Component {
	state = {
		username:         '',
		password:         '',
		email:            '',
		confirm_password: '',
		loading:          false
	}
	register = async e => {
		e.preventDefault()
		const { confirm_password, password, email, username } = this.state
		
		if (password !== confirm_password) {
			return window.toast.error('Passwords don`t match.')
		}
		
		this.setState({
			loading: true
		})
		try {
			await UserState.register({ password, email, username })
			this.props.history.push('/')
		}
		catch (e) {
			window.toast.error(e.message)
		}
		finally {
			this.setState({ loading: false })
		}
	}
	
	render() {
		const { username, password, confirm_password, email, loading } = this.state
		return (
			<div className='auth-page'>
				<div className='auth-content'>
					<img
						className='logo'
						src={ require('../images/logo.png') }
						alt='logo'
					/>
					<form
						className='form'
						action='#'
						onSubmit={ e => this.register }
					>
						<h1 className='h1 text-center'>Registration</h1>
						<Input
							caption='E-mail'
							value={ email }
							onChange={ e => this.setState({ email: e.target.value }) }
						/>
						<Input
							caption='Name'
							required
							type='text'
							value={ username }
							onChange={ e => this.setState({ username: e.target.value }) }
						/>
						<Input
							caption='Password'
							required
							type='password'
							value={ password }
							onChange={ e => this.setState({ password: e.target.value }) }
						/>
						<Input
							caption='Confirm password'
							required
							type='password'
							value={ confirm_password }
							onChange={ e => this.setState({ confirm_password: e.target.value }) }
						/>
						<button
							className='btn btn-primary'
							type='submit'
							onClick={ this.register }
						>{
							loading
								? 'Loading...'
								: 'Register'
						}</button>
						
						<Link to={ '/login' }>Sign in</Link>
					</form>
				</div>
				<div className='auth-image'>
				
				</div>
			</div>
		);
	}
}

export default RegisterScreen;