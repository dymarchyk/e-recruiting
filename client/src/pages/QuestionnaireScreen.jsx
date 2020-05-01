import { debounce }         from 'lodash'
import { observable }       from 'mobx'
import { observer }         from 'mobx-react'
import React, { Component } from 'react'
import { QUESTION_TYPES }   from '../constants/questions'
import QuestionnaireState   from '../store/QuestionnaireState'

@observer
class QuestionnaireScreen extends Component {
	
	@observable query = ''
	
	componentDidMount() {
		QuestionnaireState.data === null && QuestionnaireState.getAll()
	}
	
	search = debounce(() => QuestionnaireState.search(this.query), 400)
	
	render() {
		return (
			<div className='container min-vh-80'>
				<div className='d-flex align-items-center justify-content-between'>
					<h1 className='h1'>Анкеты</h1>
					{
						(QuestionnaireState.data?.length > 0 || QuestionnaireState.filtered) &&
						<div className='search-input'>
							<input
								value={ this.query }
								onChange={ e => {
									this.query = e.target.value
									this.search()
								} }
								onKeyUp={ e => e.keyCode === 13 && this.search() }
								placeholder='Поиск...'
								type='text'
							/>
							<span className={ `fa ${ QuestionnaireState.filtering ? 'fa-spinner fa-spin' : 'fa-search' }` } />
						</div>
					}
				
				</div>
				
				{
					(QuestionnaireState.data?.length > 0 || QuestionnaireState.filtered) &&
					<div className='mb-5'>
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
						{
							QuestionnaireState.data?.length === 0 && QuestionnaireState.filtered &&
							<div className='tab tab-not-found'>
								<span>Ничего не найдено</span>
							</div>
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
					QuestionnaireState.data?.length === 0 && !QuestionnaireState.filtered &&
					<div>
						<img
							style={ { padding: '60px 10px' } }
							className='img-fluid mx-auto d-block'
							src={ require('../images/no-content.png') }
							alt='no content created'
						/>
						
						<button
							onClick={ () => this.props.history.push('/create') }
							className='btn btn-outline-primary mx-auto d-bloc'
						>Создать первую анкету
						</button>
					</div>
				}
			
			</div>
		)
	}
}

export default QuestionnaireScreen