import { observer }              from 'mobx-react'
import React, { Component }      from 'react';
import { BrowserRouter, Route }  from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import LoginScreen               from './pages/LoginScreen'
import RegisterScreen            from './pages/RegisterScreen'
import SolveQuestionnaire        from './pages/SolveQuestionnaire'
import AuthRepository            from './repositories/AuthRepository'
import UserState                 from './store/UserState'

window.toast = toast

@observer
class App extends Component {
	
	
	componentDidMount() {
		AuthRepository.getUser()
					  .then(user => UserState.setUser(user))
					  .catch(() => null)
	}
	
	render() {
		
		return (
			<BrowserRouter>
				<>
					<ToastContainer />
					{
						UserState.isAuthorized
							? <Route
								exact
								path='/'
								render={ () => <h1>Ok</h1> }
							/>
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
					<Route
						path={ '/solve/:id' }
						component={ SolveQuestionnaire }
					/>
				</>
			
			</BrowserRouter>
		)
	}
}

export default App;