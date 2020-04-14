import React, { Component } from 'react';
import { Link }             from 'react-router-dom'
import Input                from '../components/Input'
import AuthRepository       from '../repositories/AuthRepository'
import UserState            from '../store/UserState'

class LoginScreen extends Component {
	state = { email: '', password: '', loading: false }
	
	login = async e => {
		e.preventDefault()
		const { email, password } = this.state
		this.setState({
			loading: true
		})
		try {
			const user = await AuthRepository.login({ email, password })
			UserState.setUser(user)
		}
		catch (e) {
			window.toast.error(e.message)
		}
		finally {
			this.setState({ loading: false })
		}
		
		
	}
	
	render() {
		const { email, password, loading } = this.state
		return (
			<div className='auth-page'>
				<div className='auth-content'>
					<img
						className='logo'
						src={ require('../images/logo.png') }
						alt='logo'
					/>
					<form
						onSubmit={ this.login }
						className='form'
						action='#!'
					>
						<h1 className='h1 text-center'>Увійти</h1>
						<Input
							caption='Email'
							required
							type='email'
							value={ email }
							onChange={ e => this.setState({ email: e.target.value }) }
						/>
						<Input
							caption='Пароль'
							required
							type='password'
							value={ password }
							onChange={ e => this.setState({ password: e.target.value }) }
						/>
						<button
							className='btn btn-outline-primary'
							type='submit'
						>
							{
								loading
									? 'Загрузка...'
									: 'Войти'
							}
						</button>
						<Link to={ '/' }>Регистрация</Link>
					</form>
				</div>
				<div className='auth-image'>
				
				</div>
			</div>
		);
	}
}

export default LoginScreen;