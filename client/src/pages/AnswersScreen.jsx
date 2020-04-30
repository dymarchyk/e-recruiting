import { observer }                   from 'mobx-react'
import React, { Component, Fragment } from 'react';
import { QUESTION_TYPES }             from '../constants/questions'
import AnswersState                   from '../store/AnswersState'

@observer
class AnswersScreen extends Component {
	
	
	componentDidMount() {
		AnswersState.data === null && AnswersState.getAnswers()
	}
	
	render() {
		return (
			<div className='container'>
				<div className='d-flex align-items-center justify-content-between'>
					<h1 className='h1'>Ответы</h1>
					
					{
						AnswersState.data &&
						<div className='search-input'>
							<input
								placeholder='Поиск...'
								type='text'
							/>
							<span className='fa fa-search' />
						</div>
					}
				</div>
				
				{
					AnswersState.data !== null &&
					<div>
						{
							AnswersState.data?.map(row => (
								<Fragment key={ row.id }>
									<h2 className='h2 mt-4'>{ row.title }</h2>
									<div className='tab-header'>
										<span>Респондент</span>
										<span>Личность</span>
										<span>Навыки</span>
										<span>Доверие</span>
									</div>
									
									{
										row.applicants.map(col => (
											<div
												key={ col.id }
												className='tab'
											>
												<span>{ col.email }</span>
												<span>{ col.score }</span>
												<span>{ Object.keys(col?.answers?.hard_skill ?? {}).length }/{ row.questions.filter(e => e.type === QUESTION_TYPES.hard_skill).length }</span>
												<span>{ col.lie_score }</span>
											</div>
										))
									}
								</Fragment>
							))
						}
					</div>
				}
				
				{
					AnswersState.data && AnswersState.page < AnswersState.lastPage &&
					<button
						onClick={ () => AnswersState.getAnswers(AnswersState.page + 1) }
						className='btn btn-outline-primary mt-3 mx-auto d-bloc'
					>Показать еще</button>
				}
				
				{
					AnswersState.data?.length === 0 &&
					<div>
						<img
							style={ { padding: '100px 10px' } }
							className='img-fluid mx-auto d-block'
							src={ require('../images/no-content.png') }
							alt='no content created'
						/>
						
						<button className='btn btn-outline-primary mx-auto d-bloc'>Создать первую анкету</button>
					</div>
				}
			
			</div>
		)
	}
}

export default AnswersScreen;