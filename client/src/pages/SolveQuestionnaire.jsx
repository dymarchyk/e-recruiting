import React, { Component }    from 'react'
import Checkbox                from '../components/Checkbox'
import Input                   from '../components/Input'
import {
	QUESTION_TYPES,
	ANSWER_TYPES
}                              from '../constants/questions'
import QuestionnaireRepository from '../repositories/QuestionnaireRepository'

const isDevMode = process.env.NODE_ENV === 'development'
/*
 {"lie_test":[{"id":173,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"У меня никогда не возникает досады, когда высказывают мнение, противоположное моему.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":true},{"id":170,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"Я никогда ни к кому не испытывал антипатии.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":true},{"id":169,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"Я всегда внимательно слушаю собеседника, кто бы он ни был.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":false},{"id":166,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"Я внимательно читаю каждую книгу, прежде чем вернуть ее в библиотеку.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":false},{"id":172,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"У меня не возникает внутреннего протеста, когда меня просят оказать услугу.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":false},{"id":171,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"Я всегда охотно признаю свои ошибки.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":false},{"id":168,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"Я всегда внимательно слежу за тем, как я одет.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":false},{"id":167,"created_at":"2020-05-21 20:28:44","updated_at":"2020-05-21 20:28:44","user_id":null,"title":"Я не испытываю колебаний, когда кому-нибудь нужно помочь в беде.","type":"lie_test","answer_type":"boolean","group":null,"lie_test_correct_answer":true,"answer":false}],"character":{"l0":[true,true,true,true,true,true,true,true],"e0":[true,false,false,false,false,false,false,false],"p0":[false,false,false,false,false,false,false,false],"w0":[false,false,false,false,false,false,false,false],"l1":[false,false,false,true,true,true,true,true],"l2":[true,false,false,false,false,false,false,false],"e1":[false,false,false,false,false,false,false,false],"e2":[false,true,true,true,true,true,true,true],"p3":[true,true,true,true,true,true,false,false],"p4":[false,false,false,false,true,true,true,true],"w3":[true,true,false,false,false,false,false,true],"w4":[false,false,false,false,true,true,true,true]},"hard_skills":{"1":[1],"2":[4],"3":[9,8],"4":[21,19],"5":["afdsg"]}}
 * */
class SolveQuestionnaire extends Component {
	state = {
		questionnaire:           null,
		loaded:                  false,
		answers:                 {
			lie_test:    [],
			character:   [],
			hard_skills: {}
		},
		email:                   '',
		sending:                 false,
		currentGroupIndex:       null,
		currentQuestionIndex:    0,
		currentQuestionSubIndex: 0,
		suiteFailed:             false,
		suitePassed:             false,
		questionOrder:           [],
		scores:                  {
			e: 0,
			w: 0,
			l: 0,
			p: 0
		},
		lieScores:               0,
		questionnaireSolved:     false
	}
	repository = QuestionnaireRepository
	
	checkAndNext = () => {
		const { currentGroupIndex, currentQuestionSubIndex, currentQuestionIndex, questionnaire: { questions } } = this.state
		const isLastInSubgroup = currentQuestionSubIndex === questions[currentGroupIndex][currentQuestionIndex].length - 1
		const isLastQuestion = currentQuestionIndex === questions[currentGroupIndex].length - 1
		console.log(
			{
				isLastQuestion,
				isLastInSubgroup,
				currentQuestionIndex,
				currentQuestionSubIndex
			}
		)
		if (isLastQuestion && isLastInSubgroup) {
			setTimeout(this.calculateSuite, 10)
		}
		
		this.setState({
			currentQuestionSubIndex: isLastInSubgroup
										 ? 0
										 : currentQuestionSubIndex + 1,
			currentQuestionIndex:    isLastInSubgroup && !isLastQuestion
										 ? currentQuestionIndex + 1
										 : currentQuestionIndex
		})
	}
	
	calculateSuite = () => {
		const { currentGroupIndex, questionOrder, answers, questionnaire: { questions } } = this.state
		if (currentGroupIndex <= 2) {
			//calculate lie test in first step
			if (currentGroupIndex === 0) {
				const lieScores = answers.lie_test.reduce((acc, cur) => {
					if (cur.answer === cur.lie_test_correct_answer) acc += 1
					return acc
				}, 0)
				this.setState({
					lieScores
				})
			}
			
			const counts = Object
				//grab all character scores per round
				.entries(answers.character)
				//calculate counts of correct answers in each group
				.map(([k, v]) => {
					return [k, v.filter(Boolean).length]
				})
				//sort result by maximum correct answers
				.sort((a, b) => b[1] - a[1])
			let { scores } = this.state
			
			counts.forEach(([k, v]) => {
				scores[k.replace(/\d/, '')] += v
			})
			const [first, second, third, fourth] = questionOrder
			const map = Object.fromEntries(counts)
			
			
			switch (currentGroupIndex) {
				default:
					break
				case 0:
					const max = counts[0]
					const max2 = counts[1]
					if ([first, second].includes(max[0].replace(/\d/, '')) || [
						first,
						second
					].includes(max2[0].replace(/\d/, ''))) {
						this.setState({
							scores,
						})
						this.toNextStage()
					}
					else {
						this.setState({
							scores,
							suiteFailed: true,
						})
						this.completeQuestionnaire()
					}
					break
				case 1:
					if (map[first + 1] > map[first + 2] && map[second + 2] > map[second + 1]) {
						this.setState({
							scores,
						})
						this.toNextStage()
					}
					else {
						this.setState({
							scores,
							suiteFailed: true,
						})
						this.completeQuestionnaire()
					}
					break
				case 2:
					if (map[third + 3] > map[third + 4] && map[fourth + 4] > map[fourth + 3]) {
						this.setState({
							scores,
							// complete if no hard skills questions
							questionnaireSolved: questions[3][0].length === 0,
							suitePassed:         true,
							suiteFailed:         false
						}, () => !this.state.questionnaireSolved
							? this.toNextStage()
							: null)
						
					}
					else {
						this.setState({
							scores,
							suiteFailed: true,
						})
						this.completeQuestionnaire()
					}
					break
			}
		}
		if (currentGroupIndex === 3) {
			this.setState({
				questionnaireSolved: true,
				suitePassed:         true
			})
			this.completeQuestionnaire()
		}
	}
	
	componentDidMount() {
		const { match: { params: { id } } } = this.props
		this.repository.getById(id)
			.then(data => this.setState({
				questionnaire: data,
				loaded:        true,
				questionOrder: data.order.split('')
			}))
			.catch(() => this.setState({ loaded: true }))
		
	}
	
	completeQuestionnaire = async () => {
		const { email, answers, questionnaire } = this.state
		const data = {
			email,
			answers: {
				[QUESTION_TYPES.lie_test]:   answers.lie_test,
				[QUESTION_TYPES.hard_skill]: Object.keys(answers.hard_skills).map(row => ({
					question_id: row,
					answers:     answers.hard_skills[row]
				})),
				other:                       answers.character
			}
		}
		
		try {
			await this.repository.complete(data, questionnaire.id)
		}
		catch (e) {
		}
	}
	
	renderAnswers = (question) => {
		const {
			answers,
		} = this.state
		const isSingleAnswer = question.answer_type === ANSWER_TYPES.single
		const isMultiAnswer = question.answer_type === ANSWER_TYPES.multi
		const isText = question.answer_type === ANSWER_TYPES.text
		
		let userAnswers = answers.hard_skills[question.id] ?? []
		
		if (isText) {
			return <Input
				caption='Enter your answer'
				value={ userAnswers[0] ?? '' }
				onChange={ e => {
					userAnswers[0] = e.target.value
					this.setState({
						answers: {
							...answers,
							hard_skills: {
								...answers.hard_skills,
								[question.id]: [...userAnswers]
							}
						}
					})
				} }
			/>
		}
		else if (isSingleAnswer || isMultiAnswer) {
			return (
				<ul
					key={ question.id }
					className='list'
				>
					{
						question.answers.map(row => {
							return (
								<li key={ row.id }>
									<Checkbox
										onChange={ () => {
											if (isSingleAnswer) {
												userAnswers = [row.id]
											}
											else {
												if (userAnswers.includes(row.id)) {
													userAnswers = userAnswers.filter(r => +r !== +row.id)
												}
												else {
													userAnswers = userAnswers.concat(row.id)
												}
											}
											this.setState({
												answers: {
													...answers, hard_skills: {
														...answers.hard_skills,
														[question.id]: [...userAnswers]
													}
												}
											})
										} }
										isSelected={ userAnswers?.includes(row.id) }
										type={ isSingleAnswer ? 'radio' : 'checkbox' }
										text={ row.content }
									/>
								</li>
							)
						})
					}
				</ul>
			)
			
		}
		else {
			return (
				<div className='image-answer'>
					<img
						alt='No'
						onClick={ () => {
							if (question.type === 'lie_test') {
								this.setState({
									answers: {
										...answers,
										lie_test: [
											...answers.lie_test,
											{
												...question,
												answer: false
											}
										]
									},
								})
							}
							else {
								this.setState({
									answers: {
										...answers,
										character: {
											...answers.character,
											[question.type + question.group]: answers.character[question.type + question.group]?.concat(false) ?? [false]
										}
									},
								})
							}
							this.checkAndNext()
						} }
						src={ require('../images/No.png') }
					/>
					<img
						onClick={ () => {
							if (question.type === 'lie_test') {
								this.setState({
									answers: {
										...answers,
										lie_test: [...answers.lie_test, { ...question, answer: true }]
									},
								})
							}
							else {
								this.setState({
									answers: {
										...answers,
										character: {
											...answers.character,
											[question.type + question.group]: answers.character[question.type + question.group]?.concat(true) ?? [true]
										}
									},
								})
							}
							this.checkAndNext()
						} }
						src={ require('../images/Yes.png') }
						alt='Yes'
					/>
				</div>
			)
		}
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.currentQuestionSubIndex !== this.state.currentQuestionSubIndex) {window.scrollTo(0, 0)}
	}
	
	renderIntermediateResults = () => {
		const { email } = this.state
		
		return (
			<div style={ { alignSelf: 'center' } }>
				<h1 className='h1 text-center'>{ `Thank you ${ email } for completing questionnaire. We will contact you within a few days.` }</h1>
			</div>
		)
	}
	
	toNextStage = () => {
		this.setState((state) => ({
			currentQuestionSubIndex: 0,
			currentQuestionIndex:    0,
			currentGroupIndex:       state.currentGroupIndex + 1,
			suitePassed:             false,
			suiteFailed:             false,
			scores:                  {
				e: 0,
				w: 0,
				l: 0,
				p: 0
			},
		}))
	}
	
	
	renderFinalResult = () => {
		const { email } = this.state
		return <h1 className='h1 text-center'>Congratulations { email }!<br />Questionnaire completed.</h1>
	}
	
	render() {
		const {
			email, questionnaire, loaded,
			currentGroupIndex, currentQuestionIndex, currentQuestionSubIndex,
			suiteFailed, suitePassed,
			questionnaireSolved
		} = this.state
		if (!questionnaire && loaded) return <div
			style={ {
				minHeight:      '80vh',
				height:         '100%',
				display:        'flex',
				alignItems:     'center',
				justifyContent: 'center'
			} }
		>
			<h1 className='h1 text-center'>This questionnaire not found.</h1>
		</div>
		const currentQuestion = questionnaire?.questions?.[currentGroupIndex]?.[currentQuestionIndex]?.[currentQuestionSubIndex] ?? null
		
		return (
			<div className='questionnaire-content'>
				<div className='questionnaire-content-question'>
					<img
						className='logo'
						src={ require('../images/logo-inverted.png') }
						alt=''
					/>
					{
						!(suiteFailed || suitePassed) &&
						<>
							{
								currentQuestion === null
									? <h1 className='h1'>Please introduce yourself.</h1>
									: <h1
										className='h1 animated fadeIn'
										key={ currentQuestionSubIndex }
									>
										{ isDevMode && <>
											<small>{ currentQuestion?.type }{ currentQuestion?.group }</small>
											<br /> </> }
										{ currentQuestion?.title }
									</h1>
							}
						</>
					}
				
				
				</div>
				{
					(suiteFailed || suitePassed || questionnaireSolved)
						? <div className='questionnaire-content-answer'>
							{ this.renderIntermediateResults() }
						</div>
						: <div className='questionnaire-content-answer'>
							{
								currentQuestion === null &&
								<form
									action='#!'
									onSubmit={ e => {
										e.preventDefault()
										this.setState({ currentGroupIndex: 0 })
									} }
								>
									<Input
										type='email'
										required
										value={ email }
										onChange={ e => this.setState({ email: e.target.value }) }
										postScript='Enter email and press ENTER'
										caption='Email'
									/>
								</form>
							}
							{
								currentQuestion !== null &&
								this.renderAnswers(currentQuestion)
							}
							
							{
								[ANSWER_TYPES.single, ANSWER_TYPES.multi, ANSWER_TYPES.text].includes(currentQuestion?.answer_type) &&
								<button
									// disabled={ (answers.hard_skills?.[currentQuestion?.id] ?? []).length === 0 }
									onClick={ () => this.checkAndNext() }
									className='btn btn-primary mx-auto'
								>Next
								</button>
							}
						</div>
				}
			
			</div>
		)
	}
}

export default SolveQuestionnaire