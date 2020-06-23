import { observable }          from 'mobx'
import { observer }            from 'mobx-react'
import React, { Component }    from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Checkbox                from '../components/Checkbox'
import { ANSWER_TYPES }        from '../constants/questions'
import ApplicantRepository     from '../repositories/ApplicantRepository'

@observer
class ApplicantDetails extends Component {
	
	@observable loading = true
	@observable applicant = null
	
	
	componentDidMount() {
		ApplicantRepository.getById(+this.props.match.params.id)
						   .then(res => this.applicant = res)
						   .finally(() => this.loading = false)
	}
	
	render() {
		if (!this.loading && !this.applicant) return <div
			style={ {
				minHeight:      '80vh',
				height:         '100%',
				display:        'flex',
				alignItems:     'center',
				justifyContent: 'center'
			} }
		>
			<h1 className='h1 text-center'>This applicant not found.</h1>
		</div>
		if (this.applicant) {
			const maxHardSkill = this.applicant.questionnaire.questions.length
			return (
				<div className='container min-vh-80 animated fadeIn'>
					<div className='d-flex justify-content-between'>
						<h1 className='h1'>{ this.applicant?.questionnaire?.title }</h1>
						
						<div
							style={ { color: '#4C5583' } }
							className='d-flex flex-column align-items-end'
						>
							<b>Applicant:</b>
							<span style={ { color: '#5A5252' } }>{ this.applicant.email }</span>
						</div>
					</div>
					<div className='cards'>
						
						<div className='card justify-content-center align-items-center'>
							<b className='text-primary pb-3'>Desedant scale</b>
							<CircularProgressbar
								text={ Math.ceil(this.applicant.lie_score / 8 * 100) + '%' }
								value={ Math.ceil(this.applicant.lie_score / 8 * 100) }
								styles={ {
									root:       {
										width:  180,
										height: 180
									},
									text:       { fill: '#1AA516' },
									path:       {
										strokeWidth: 4,
										stroke:      '#1AA516'
									},
									trail:      {
										strokeWidth: 4,
										stroke:      '#E2FFE5'
									},
									background: true
								} }
							/>
						</div>
						
						<div className='card justify-content-center align-items-center'>
							<b className='text-primary pb-3'>Personality</b>
							<CircularProgressbar
								text={ Math.ceil(this.applicant.score / 60 * 100) + '%' }
								value={ Math.ceil(this.applicant.score / 60 * 100) }
								styles={ {
									root:       {
										width:  180,
										height: 180
									},
									text:       { fill: '#5356D9' },
									path:       {
										strokeWidth: 4,
										stroke:      '#5356D9'
									},
									trail:      {
										strokeWidth: 4,
										stroke:      '#E2FFE5'
									},
									background: true
								} }
							/>
						</div>
						
						<div className='card justify-content-center align-items-center'>
							<b className='text-primary pb-3'>Hard skills</b>
							<CircularProgressbar
								text={ (maxHardSkill > 0
									? `${ this.applicant.hard_skills_score }/${ maxHardSkill }`
									: '0/0') }
								value={ maxHardSkill > 0
									? Math.floor(this.applicant.hard_skills_score / maxHardSkill * 100)
									: 0 }
								styles={ {
									root:       {
										width:  180,
										height: 180
									},
									text:       { fill: '#E81F29' },
									path:       {
										strokeWidth: 4,
										stroke:      '#E81F29'
									},
									trail:      {
										strokeWidth: 4,
										stroke:      '#E2FFE5'
									},
									background: true
								} }
							/>
						</div>
					</div>
					{
						this.applicant.answers.hard_skill.length > 0 &&
						<div className='card'>
							<b className='pb-3 text-primary'>Hard skills questions</b>
							{
								this.applicant.answers.hard_skill.map((row, index) => {
									
									return (
										<ul
											key={ index }
											className='list ml-3 mb-3 old-question'
										>
											<li>
												<b>Question №{ index + 1 }:</b> { row.question.title }
											</li>
											{
												row.question.answer_type === ANSWER_TYPES.text &&
												<li>
													<b>Answer:</b> { row.answers[0] }
												</li>
											}
											
											{
												row.question.answer_type !== ANSWER_TYPES.text &&
												<li>
													<b>Answers:</b>
													<div>
														{
															row.question.answers.map((col, index) => {
																return <Checkbox
																	type={ row.question.answer_type === ANSWER_TYPES.single
																		? 'radio'
																		: 'checkbox' }
																	isSelected={ row.answers.includes(col.id) }
																	text={ col.content }
																	key={ col.content + index }
																/>
															})
														}
													</div>
												</li>
											}
										</ul>
									)
								})
							}
						
						</div>
					}
				
				</div>
			);
		}
		return <div className='text-center'><span className='fa fa-spinner fa-spin text-primary' /></div>
	}
}

export default ApplicantDetails;