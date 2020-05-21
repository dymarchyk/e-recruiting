import classNames                           from 'classnames'
import { observer }                         from 'mobx-react'
import React, { Component }                 from 'react';
import {
	Row,
	Col,
	Button
}                                           from 'reactstrap'
import Input                                from '../components/Input'
import QuestionnaireState                   from '../store/QuestionnaireState'
import AddQuestionScreen                    from './AddQuestionScreen'
import SelectQuestionnairePersonalityScreen from './SelectQuestionnairePersonalityScreen'

@observer
class CreateQuestionnaireScreen extends Component {
	render() {
		return (
			<div className='container min-vh-80'>
				<h1 className='h1'>{ QuestionnaireState.title === ''
					? 'Create questionnaire'
					: QuestionnaireState.title }</h1>
				{
					QuestionnaireState.title === ''
						? <Row className='fancy-block py-3 px-4 mt-5 mb-4 animated fadeIn'>
							<Col>
								<b className='text-primary'>Input title of questionnare</b>
								<Input
									ref={ (node) => {this.titleInput = node} }
									onKeyUp={ e => {
										if (e.keyCode !== 13) return
										QuestionnaireState.title = this.titleInput.value
									} }
									onBlur={ () => QuestionnaireState.title = this.titleInput.value }
									className='mt-3'
									placeholder='Questionnaire title'
								/>
							</Col>
						</Row>
						: <Row className='fancy-block px-3 py-5 mb-3 mt-5 animated fadeIn'>
							<Col
								style={ { color: '#4C5583' } }
								className='d-flex align-items-center'
							>
								<b className='py-1 pr-2'>Title:</b>
								{
									QuestionnaireState.editingTitle
										? <Input
											onKeyUp={ e => {
												if (e.keyCode !== 13) return
												QuestionnaireState.title = this.titleInput2.value
												QuestionnaireState.editingTitle = false
											} }
											style={ { height: 30 } }
											inputClassName='m-0'
											className='m-0'
											underline
											ref={ node => this.titleInput2 = node }
											defaultValue={ QuestionnaireState.title }
										/>
										: <span>{ QuestionnaireState.title }</span>
								}
							</Col>
							<Col
								lg={ 1 }
								className='d-flex align-items-center justify-content-center'
							>
								<span
									onClick={ () => {
										if (QuestionnaireState.editingTitle) {
											QuestionnaireState.title = this.titleInput2.value
											QuestionnaireState.editingTitle = false
										}
										else {
											QuestionnaireState.editingTitle = true
										}
									} }
									className={ classNames('fa  pointer', {
										'fa-pencil': !QuestionnaireState.editingTitle,
										'fa-check':  QuestionnaireState.editingTitle,
									}) }
									style={ {
										fontSize: 20,
										color:    'var(--muted)'
									} }
								/>
							</Col>
						</Row>
				}
				
				{
					QuestionnaireState.addingQuestion &&
					<AddQuestionScreen />
				}
				{
					QuestionnaireState.addingPersonality &&
					<SelectQuestionnairePersonalityScreen />
				}
				
				
				<Row>
					{
						!QuestionnaireState.addingQuestion &&
						<>
							<Col className='p-0'>
								<div className='py-5 fancy-block'>
									<Row className=' align-items-stretch'>
										<Col
											lg={ QuestionnaireState.addingPersonality
												? 3
												: 6 }
										>
											<img
												style={ { maxHeight: 300 } }
												className='img-fluid px-4'
												src={ require('../images/hard-skills.png') }
												alt='hard skills'
											/>
										</Col>
										<Col>
											<div className='px-4 d-flex flex-fill h-100 flex-column justify-content-between'>
												<div
													className={ QuestionnaireState.addingPersonality
														? ''
														: 'text-center' }
												>
													<p className='text-primary font-weight-bold'>Hard skills</p>
													<p className='py-3 font-alt'>
														Lorem ipsum dolor sit amet, consectetur adipisicing elit.
													</p>
												</div>
												
												
												<Button
													onClick={ () => QuestionnaireState.addingQuestion = true }
													style={ { minWidth: 'unset' } }
													className={ `d-block ${ QuestionnaireState.addingPersonality
														? 'mr-auto'
														: 'mx-auto' }` }
													color='primary'
													outline
												>
													Add
												</Button>
											</div>
										
										</Col>
									</Row>
								</div>
							</Col>
							<div
								style={ {
									width:  20,
									height: 20
								} }
							/>
						</>
					}
					
					
					{
						!QuestionnaireState.addingPersonality &&
						<Col className='p-0'>
							<div className='py-5 fancy-block'>
								<Row className=' align-items-stretch'>
									<Col
										lg={ QuestionnaireState.addingQuestion
											? 3
											: 6 }
									>
										<img
											style={ { maxHeight: 300 } }
											className='img-fluid d-block ml-auto px-4'
											src={ require('../images/character-type.png') }
											alt='personality'
										/>
									</Col>
									<Col>
										<div className='px-4 d-flex flex-fill h-100 flex-column justify-content-between'>
											<div
												className={ QuestionnaireState.addingQuestion
													? ''
													: 'text-center' }
											>
												<p className='text-primary font-weight-bold'>Personality</p>
												<p className='py-3 font-alt'>
													Lorem ipsum dolor sit amet, consectetur adipisicing elit.
												</p>
											</div>
											
											
											<Button
												onClick={ () => QuestionnaireState.addingPersonality = true }
												style={ { minWidth: 'unset' } }
												className={ `d-block ${ QuestionnaireState.addingQuestion
													? 'mr-auto'
													: 'mx-auto' }` }
												color='primary'
												outline
											>
												Add
											</Button>
										</div>
									</Col>
								</Row>
							</div>
						</Col>
					}
				
				</Row>
			
			</div>
		);
	}
}

export default CreateQuestionnaireScreen;