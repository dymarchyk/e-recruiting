import 'animate.css/animate.min.css'
import { observer }              from 'mobx-react'
import React, { Component }      from 'react'
import {
	BrowserRouter,
	Route
}                                from 'react-router-dom'
import {
	ToastContainer,
	toast
}                                from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header                    from './components/Header'
import AnswersScreen             from './pages/AnswersScreen'
import ApplicantDetails          from './pages/ApplicantDetails'
import CreateQuestionnaireScreen from './pages/CreateQuestionnaireScreen'
import LoginScreen               from './pages/LoginScreen'
import QuestionnaireScreen       from './pages/QuestionnaireScreen'
import RegisterScreen            from './pages/RegisterScreen'
import SolveQuestionnaire        from './pages/SolveQuestionnaire'
import UserState                 from './store/UserState'

window.toast = toast

@observer
class App extends Component {
	
	state = {
		loaded: false
	}
	
	componentDidMount() {
		UserState.getUser()
				 .catch(() => null)
				 .finally(() => this.setState({ loaded: true }))
	}
	
	_renderPersonal = () => {
		return (
			<Route
				render={ ({ location }) => {
					if (location.pathname.includes('solve')) return null
					return (
						<div style={ { minHeight: '100vh' } }>
							<Route
								path={ '/' }
								render={ (props) => <Header { ...props } /> }
							/>
							<Route
								exact
								path={ '/' }
								component={ QuestionnaireScreen }
							/>
							<Route
								path={ '/answers' }
								component={ AnswersScreen }
							/>
							<Route
								path={ '/create' }
								component={ CreateQuestionnaireScreen }
							/>
							<Route
								path={ '/applicant/:id' }
								component={ ApplicantDetails }
							/>
							<Route
								path={ '/' }
								render={ () => (
									<footer className='footer container text-center'>
										<span className='fa fa-copyright' />
										<span className='px-2'>2020</span>
										<span>Develop by Dmitriy Dymarchyk</span>
									</footer>
								) }
							/>
						
						</div>
					)
				} }
			/>
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

export default App