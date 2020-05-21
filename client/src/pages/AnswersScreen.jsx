import { debounce }       from 'lodash'
import { observable }     from 'mobx'
import { observer }       from 'mobx-react'
import React, {
	Component,
	Fragment
}                         from 'react';
import { Progress }       from 'reactstrap'
import { QUESTION_TYPES } from '../constants/questions'
import AnswersState       from '../store/AnswersState'

@observer
class AnswersScreen extends Component {
	
	@observable query = ''
	
	componentDidMount() {
		AnswersState.data === null && AnswersState.getAnswers()
	}
	
	search = debounce(() => AnswersState.search(this.query), 400)
	
	render() {
		return (
			<div className='container min-vh-80 animated fadeIn'>
				{
					AnswersState.lastAnswers.length > 0 &&
					<>
						<h1 className='h1'>Last answers</h1>
						<div className='cards'>
							{
								AnswersState.lastAnswers?.map(row => {
									const applicant = row.applicants[0]
									const maxHardSkill = row.questions.filter(e => e.type === QUESTION_TYPES.hard_skill).length
									
									return (
										<div
											key={ row.id }
											className='card'
										>
											<h3>{ row.title }</h3>
											<div className='mb-3'>
												<b>Personality</b>
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
													<b>Hard skills</b>
													<div className='d-flex align-items-center justify-content-between'>
														<Progress
															className='flex-fill'
															color='primary'
															value={ Math.ceil(applicant.hard_skills_score / maxHardSkill * 100) }
														/>
														<b className='percent pl-2'>{ Math.ceil(applicant.hard_skills_score / maxHardSkill * 100) }%</b>
													</div>
												</div>
											}
											
											<div className='mb-3'>
												<b>Plausibility</b>
												<div className='d-flex align-items-center justify-content-between'>
													<Progress
														className='flex-fill'
														color='primary'
														value={ Math.ceil(applicant.lie_score / 8 * 100) }
													/>
													<b className='percent pl-2'>{ Math.ceil(applicant.lie_score / 8 * 100) }%</b>
												</div>
											</div>
											<span className='subtitle'>Applicant:</span>
											<span className='email'>{ applicant.email }</span>
										</div>
									)
								})
							}
						
						</div>
					</>
				}
				
				
				<div className='d-flex align-items-center justify-content-between'>
					<h1 className='h1'>Answers</h1>
					
					{
						(AnswersState.data?.length > 0 || AnswersState.filtered) &&
						<div className='search-input'>
							<input
								value={ this.query }
								onChange={ e => {
									this.query = e.target.value
									this.search()
								} }
								placeholder='Search...'
								type='text'
							/>
							<span
								className={ `fa ${ AnswersState.filtering
									? 'fa-spinner fa-spin'
									: 'fa-search' }` }
							/>
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
										<span>Applicant</span>
										<span>Personality</span>
										<span>Hard skills</span>
										<span>Plausibility</span>
									</div>
									
									{
										row.applicants.map(col => (
											<div
												key={ col.id }
												className='tab'
											>
												<span>{ col.email }</span>
												<span>{ col.score }/96</span>
												<span>{ col.hard_skills_score }/{ row.questions.filter(e => e.type === QUESTION_TYPES.hard_skill).length }</span>
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
								<span>Nothing found</span>
							</div>
						}
					</div>
				}
				
				{
					AnswersState.data && AnswersState.page < AnswersState.lastPage &&
					<button
						onClick={ () => AnswersState.getAnswers(AnswersState.page + 1) }
						className='btn btn-outline-primary mt-3 mx-auto d-block'
					>Show more</button>
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
							onClick={ () => this.props.history.push('/create') }
							className='btn btn-outline-primary mx-auto d-block'
						>Create first questionnaire
						</button>
					</div>
				}
			
			</div>
		)
	}
}

export default AnswersScreen;