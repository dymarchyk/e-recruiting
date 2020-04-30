import { observer }                                                         from 'mobx-react'
import React, { Component }                                                 from 'react'
import ReactAvatar                                                          from 'react-avatar';
import { NavLink }                                                          from 'react-router-dom'
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap'
import UserState                                                            from '../store/UserState'

@observer
class Header extends Component {
	render() {
		return (
			<header className='container header-personal'>
				<div className='top-line'>
					<img
						src={ require('../images/logo.png') }
						alt='e-recruiting'
					/>
					<div className='d-flex align-items-center justify-content-between'>
						<button
							className='btn my-2 btn-outline-primary'
							onClick={ () => this.props.history.push('/create') }
						>Создать анкету
						</button>
						<UncontrolledDropdown className='ml-5'>
							<DropdownToggle
								tag='div'
								style={ { cursor: 'pointer' } }
							>
								<span
									style={ { color: '#5A5F7C' } }
									className='pr-2'
								>{ UserState.user.username }</span>
								<ReactAvatar
									round
									size='40'
									name={ UserState.user.username }
								/>
								<span
									style={ { color: 'var(--icon)' } }
									className='pl-2 fa fa-angle-down'
								/>
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem>
									Профиль
								</DropdownItem>
								<DropdownItem
									onClick={ () => {
										UserState.logout()
												 .finally(() => this.props.history.push('/'))
									} }
								>
									Выйти
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</div>
				
				</div>
				<nav className='nav'>
					<NavLink
						exact
						to={ '/personal' }
					>Анкеты</NavLink>
					<NavLink to={ '/personal/answers' }>Ответы</NavLink>
				</nav>
			</header>
		)
	}
}

export default Header