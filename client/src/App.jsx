import 'animate.css/animate.min.css'
import { observer }                       from 'mobx-react'
import React, { Component }               from 'react';
import { hot }                            from 'react-hot-loader/root'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { ToastContainer, toast }          from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Header                             from './components/Header'
import AnswersScreen                      from './pages/AnswersScreen'
import LoginScreen                        from './pages/LoginScreen'
import QuestionnaireScreen                from './pages/QuestionnaireScreen'
import RegisterScreen                     from './pages/RegisterScreen'
import SolveQuestionnaire                 from './pages/SolveQuestionnaire'
import UserState                          from './store/UserState'

window.toast = toast

@observer
class App extends Component {
	
	state = {
		loaded: false
	}
	
	componentDidMount() {
		UserState.getUser()
				 .finally(() => this.setState({ loaded: true }))
	}
	
	_renderPersonal = () => {
		return (
			<>
				{
					!window.location.pathname.includes('solve') && <Redirect to={ '/personal' } />
				}
				<Route
					path='/personal'
					render={ () => (
						<div>
							<Route render={ (props) => <Header { ...props } /> } />
							<Route
								exact
								path={ '/personal' }
								component={ QuestionnaireScreen }
							/>
							<Route
								path={ '/personal/answers' }
								component={ AnswersScreen }
							/>
						</div>
					) }
				/>
			</>
		)
	}
	
	render() {
		return (
			<BrowserRouter>
				<>
					<ToastContainer />
					
					{
						this.state.loaded &&
						<>
							{
								UserState.isAuthorized
									? this._renderPersonal()
									: <>
										<Route
											exact
											path={ '/' }
											component={ RegisterScreen }
										/>
										<Route
											path={ '/login' }
											component={ LoginScreen }
										/>
									</>
							}
						</>
					}
					
					<Route
						exact
						path={ '/solve/:id' }
						component={ SolveQuestionnaire }
					/>
				</>
			
			</BrowserRouter>
		)
	}
}

export default hot(App)