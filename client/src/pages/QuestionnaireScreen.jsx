import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { QUESTION_TYPES } from '../constants/questions'
import QuestionnaireState from '../store/QuestionnaireState'

@observer
class QuestionnaireScreen extends Component {
	
	componentDidMount() {
		QuestionnaireState.data === null && QuestionnaireState.getAll()
	}
	
	render() {
		return (
			<div className='container'>
				<div className='d-flex align-items-center justify-content-between'>
					<h1 className='h1'>Анкеты</h1>
					{
						QuestionnaireState.data &&
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
					QuestionnaireState.data?.length > 0 &&
					<div>
						<div className='tab-header'>
							<span>Название</span>
							<span>Личность</span>
							<span>Навыки</span>
							<span>Ответов</span>
						</div>
						
						{
							QuestionnaireState.data?.map(row => (
								<div
									key={ row.id }
									className='tab'
								>
									<span>{ row.title || '-' }</span>
									<span>{ row.order.toUpperCase() }</span>
									<span>{ row.questions.filter(e => e.type === QUESTION_TYPES.hard_skill).length ||
											<span className='fa fa-minus' /> }</span>
									<span>{ row.respond_count }</span>
								</div>
							))
						}
					</div>
				}
				{
					QuestionnaireState.data && QuestionnaireState.page < QuestionnaireState.last &&
					<button
						onClick={ () => QuestionnaireState.getAll(QuestionnaireState.page + 1) }
						className='btn btn-outline-primary mt-3 mx-auto d-bloc'
					>Показать еще</button>
				}
				
				{
					QuestionnaireState.data?.length === 0 &&
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

export default QuestionnaireScreen