import { debounce, last } from 'lodash'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component, Fragment } from 'react';
import { Progress } from 'reactstrap'
import { QUESTION_TYPES } from '../constants/questions'
import AnswersState from '../store/AnswersState'

@observer
class AnswersScreen extends Component {
	
	@observable query = ''
	
	componentDidMount() {
		AnswersState.data === null && AnswersState.getAnswers()
	}
	
	search = debounce(() => AnswersState.search(this.query), 400)
	
	render() {
		return (
			<div className='container min-vh-80'>
				{
					AnswersState.lastAnswers.length > 0 &&
					<>
						<h1 className='h1'>Последние ответы</h1>
						<div className='cards'>
							{
								AnswersState.lastAnswers?.map(row => {
									const applicant = last(row.applicants)
									const maxHardSkill = row.questions.filter(e => e.type === QUESTION_TYPES.hard_skill).length
									const hardSkillScore = Object.keys(applicant?.answers?.hard_skill ?? {}).length
									return (
										<div
											key={ row.id }
											className='card'
										>
											<h3>Lorem ipsum dolor.</h3>
											<div className='mb-3'>
												<b>Личность</b>
												<div className='d-flex align-items-center justify-content-between'>
													<Progress
														className='flex-fill'
														color='primary'
														value={ Math.ceil(applicant.score / 96 * 100) }
													/>
													<b className='percent pl-2'>{ Math.ceil(applicant.score / 96 * 100) }%</b>
												</div>
											</div>
											{
												maxHardSkill > 0 &&
												<div className='mb-3'>
													<b>Навыки</b>
													<div className='d-flex align-items-center justify-content-between'>
														<Progress
															className='flex-fill'
															color='primary'
															value={ Math.ceil(hardSkillScore / maxHardSkill * 100) }
														/>
														<b className='percent pl-2'>{ Math.ceil(hardSkillScore / maxHardSkill * 100) }%</b>
													</div>
												</div>
											}
											
											<div className='mb-3'>
												<b>Доверие</b>
												<div className='d-flex align-items-center justify-content-between'>
													<Progress
														className='flex-fill'
														color='primary'
														value={ Math.ceil(applicant.lie_score / 8 * 100) }
													/>
													<b className='percent pl-2'>{ Math.ceil(applicant.lie_score / 8 * 100) }%</b>
												</div>
											</div>
											<span className='subtitle'>Респондент:</span>
											<span className='email'>{ applicant.email }</span>
										</div>
									)
								})
							}
						
						</div>
					</>
				}
				
				
				<div className='d-flex align-items-center justify-content-between'>
					<h1 className='h1'>Ответы</h1>
					
					{
						(AnswersState.data?.length > 0 || AnswersState.filtered) &&
						<div className='search-input'>
							<input
								value={ this.query }
								onChange={ e => {
									this.query = e.target.value
									this.search()
								} }
								placeholder='Поиск...'
								type='text'
							/>
							<span className={ `fa ${ AnswersState.filtering ? 'fa-spinner fa-spin' : 'fa-search' }` } />
						</div>
					}
				</div>
				
				{
					AnswersState.data !== null &&
					<div className='mb-5'>
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
												<span>{ col.score }/96</span>
												<span>{ Object.keys(col?.answers?.hard_skill ?? {}).length }/{ row.questions.filter(e => e.type === QUESTION_TYPES.hard_skill).length }</span>
												<span>{ col.lie_score }/8</span>
											</div>
										))
									}
								</Fragment>
							))
						}
						{
							AnswersState.data?.length === 0 && AnswersState.filtered &&
							<div className='tab tab-not-found'>
								<span>Ничего не надено</span>
							</div>
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
					AnswersState.data?.length === 0 && !AnswersState.filtered &&
					<div>
						<img
							style={ { padding: '60px 10px' } }
							className='img-fluid mx-auto d-block'
							src={ require('../images/no-content.png') }
							alt='no content created'
						/>
						
						<button
							onClick={ () => this.props.history.push('//create') }
							className='btn btn-outline-primary mx-auto d-bloc'
						>Создать первую анкету
						</button>
					</div>
				}
			
			</div>
		)
	}
}

export default AnswersScreen;