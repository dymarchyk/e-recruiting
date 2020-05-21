import {
	observable,
	action
}                           from 'mobx'
import { observer }         from 'mobx-react'
import React, { Component } from 'react';
import {
	Row,
	Col,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button
}                           from 'reactstrap'
import Checkbox             from '../components/Checkbox'
import Input                from '../components/Input'
import { ANSWER_TYPES }     from '../constants/questions'
import QuestionnaireState   from '../store/QuestionnaireState'

@observer
class AddQuestionScreen extends Component {
	
	dictionary = {
		[ANSWER_TYPES.text]:   'Text',
		[ANSWER_TYPES.multi]:  'Checkbox',
		[ANSWER_TYPES.single]: 'Radio button',
	}
	
	@observable currentIndex = 0
	
	componentDidMount() {
		this.currentIndex = QuestionnaireState.addHardSkill()
	}
	
	@action
	onAddQuestion = () => {
		this.currentIndex = QuestionnaireState.addHardSkill()
	}
	
	_renderQuestionInputs = (type, row, index) => {
		switch (type) {
			default:
				return <>
					{
						row.answers.map((col, colId) => (
							<div
								key={ colId }
								className='d-flex align-items-center mb-3 animated fadeIn'
							>
								<Checkbox
									key={ colId + col.text }
									onChange={ () => QuestionnaireState.changeCorrectAnswer(index, colId) }
									isSelected={ col.isCorrect }
									type={ row.type === ANSWER_TYPES.single
										? 'radio'
										: 'checkbox' }
								/>
								<Input
									onKeyUp={ e => {
										if (e.keyCode !== 13) return
										QuestionnaireState.addAnswerToQuestion(index)
									} }
									placeholder='Enter answer for this question'
									underline
									className='flex-fill mb-0'
									value={ col.text }
									onChange={ QuestionnaireState.changeValue(index, 'answers', `[${ colId }]`, 'text') }
								/>
								{
									row.answers.length > 1 &&
									<span
										onClick={ () => {
											QuestionnaireState.removeAnswerFromQuestion(index, colId)
										} }
										className='animated fadeIn text-primary fa fa-trash pointer pl-2'
									/>
								}
							</div>
						))
					}
					<div className='d-flex justify-content-end text-primary'>
						<small>Press ENTER to add new answer</small>
					</div>
				</>
			case ANSWER_TYPES.text:
				return <Input
					value={ row.correct_text_answer }
					onChange={ QuestionnaireState.changeValue(index, 'correct_text_answer') }
					placeholder='Enter answer for this question'
					type='textarea'
					rows={ 6 }
					cols={ 6 }
				/>
		}
	}
	
	_renderNewQuestion = (row, index) => {
		return (
			<Col
				className='animated fadeIn'
				lg={ 12 }
				key={ row.id }
			>
				<Row>
					<Col className='px-4'>
						<Row>
							<Col
								lg={ 7 }
							>
								<Input
									value={ row.title }
									onChange={ QuestionnaireState.changeValue(index, 'title') }
									className='mb-0'
									placeholder='Enter question'
								/>
							</Col>
							<Col
								lg={ 12 - 7 }
								className=''
							>
								<UncontrolledDropdown className='w-100'>
									<DropdownToggle
										tag={ 'div' }
										className='d-flex align-items-center justify-content-between custom-dropdown'
									>
										<span>{ this.dictionary[row.type] }</span>
										<span className='fa fa-angle-down' />
									</DropdownToggle>
									<DropdownMenu className='w-100'>
										{
											Object.entries(this.dictionary).map(([code, text]) => (
												<DropdownItem
													active={ row.type === code }
													onClick={ () => QuestionnaireState.changeValue(index, 'type')(code) }
													key={ code }
												>
													{ text }
												</DropdownItem>
											))
										}
									</DropdownMenu>
								</UncontrolledDropdown>
							</Col>
							<Col
								lg={ 12 }
								className=' mt-5'
							>
								{ this._renderQuestionInputs(row.type, row, index) }
							</Col>
						</Row>
					</Col>
					<Col
						lg={ 2 }
						className='d-flex align-items-center'
					>
						<div
							className='question-actions justify-content-center d-flex flex-column px-3 py-5'
							style={ { minHeight: '80%' } }
						>
							<div
								onClick={ () => QuestionnaireState.deleteQuestion(index) }
								style={ { color: 'var(--muted)' } }
								className='pointer'
							>
								<span
									style={ { fontSize: 20 } }
									className='fa fa-trash pr-3'
								/>
								<b>Delete</b>
							</div>
							
							<div
								onClick={ () => QuestionnaireState.changeValue(index, 'isEditing')(false) }
								className='mt-5 text-primary pointer'
							>
								<span
									style={ { fontSize: 20 } }
									className='fa fa-check pr-3'
								/>
								<b>Save</b>
							</div>
						</div>
					</Col>
				</Row>
			</Col>
		)
	}
	
	_renderOldQuestion = (row, index) => (
		<Col
			key={ row.id }
			lg={ 12 }
			className='mb-4'
		>
			<Row className='animated fadeIn'>
				<Col>
					<ul className='list ml-3 old-question'>
						<li>
							<b>Question:</b> { row.title }
						</li>
						<li>
							<b>Type:</b> { this.dictionary[row.type] }
						</li>
						{
							row.type === ANSWER_TYPES.text &&
							<li>
								<b>Answer:</b> { row.correct_text_answer }
							</li>
						}
						
						{
							row.answers.length > 0 && row.type !== ANSWER_TYPES.text &&
							<li>
								<b>Answers:</b>
								<div>
									{
										row.answers.map((col, index) => {
											return <Checkbox
												type={ row.type === ANSWER_TYPES.single
													? 'radio'
													: 'checkbox' }
												isSelected={ col.isCorrect }
												text={ col.text }
												key={ col.text + index }
											/>
										})
									}
								</div>
							</li>
						}
					</ul>
				</Col>
				<Col
					lg={ 2 }
					className='d-flex align-items-center justify-content-center'
				>
					<div
						style={ { color: 'var(--muted)' } }
						className='question-actions d-flex align-items-center my-auto px-3 h-100'
					>
						<span
							onClick={ () => QuestionnaireState.changeValue(index, 'isEditing')(true) }
							style={ { fontSize: 20 } }
							className='pointer fa fa-pencil '
						/>
						
						<span
							onClick={ () => QuestionnaireState.deleteQuestion(index) }
							style={ { fontSize: 20 } }
							className='pointer fa fa-trash ml-3'
						/>
					
					</div>
				</Col>
			</Row>
		</Col>
	)
	
	
	render() {
		return (
			<Row className='fancy-block mb-4 animated fadeIn py-3'>
				<Col lg={ 12 }>
					<p className='text-primary font-weight-bold px-4'>Questions</p>
				</Col>
				{
					QuestionnaireState.hardSkills.map((row, index) => {
						if (row.isEditing) return this._renderNewQuestion(row, index)
						return this._renderOldQuestion(row, index)
					})
				}
				
				<Col
					lg={ 12 }
					className='px-4 d-flex align-items-center justify-content-center my-3 px-4'
				>
					<div
						style={ {
							height:          1,
							flex:            1,
							backgroundColor: 'var(--primary)'
						} }
					/>
					<div
						onClick={ this.onAddQuestion }
						className='add-question text-primary mx-4 d-flex align-items-center pointer'
					>
						<span
							style={ { fontSize: 20 } }
							className='fa fa-plus pr-3'
						/>
						<b>Add question</b>
					</div>
					<div
						style={ {
							height:          1,
							flex:            1,
							backgroundColor: 'var(--primary)'
						} }
					/>
				</Col>
				
				<Col
					lg={ 12 }
					className='d-flex align-items-center justify-content-between px-4 mt-5'
				>
					<Button
						color='primary'
						outline
					>
						Cancel
					</Button>
					<Button
						onClick={ QuestionnaireState.createQuestionnaire }
						color='primary'
					>
						Save
					</Button>
				</Col>
			</Row>
		);
	}
}

export default AddQuestionScreen