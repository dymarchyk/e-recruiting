import React, { Component, Fragment } from 'react'
import Checkbox                       from '../components/Checkbox'
import Input                          from '../components/Input'
import QuestionnaireRepository        from '../repositories/QuestionnaireRepository'

const isDevMode = process.env.NODE_ENV === 'development'

class SolveQuestionnaire extends Component {
	state = {
		questionnaire:           null,
		loaded:                  false,
		answers:                 {
			lie_test:  [],
			character: []
		},
		email:                   isDevMode ? 'mail@mail.com' : '',
		currentStep:             0,
		result:                  null,
		sending:                 false,
		currentGroupIndex:       isDevMode ? 1 : null,
		currentQuestionIndex:    0,
		currentQuestionSubIndex: 0,
		suiteFailed:             false,
		suitePassed:             false,
		questionOrder:           ['p', 'w', 'l', 'e'],
		scores:                  {
			e: 0,
			w: 0,
			l: 0,
			p: 0
		},
		lieScores:               0
	}
	repository = new QuestionnaireRepository()
	
	checkAndNext = () => {
		const { currentGroupIndex, currentQuestionSubIndex, currentQuestionIndex, questionnaire: { questions } } = this.state
		const isLastInSubgroup = currentQuestionSubIndex === questions[currentGroupIndex][currentQuestionIndex].length - 1
		const isLastQuestion = currentQuestionIndex === questions[currentGroupIndex].length - 1
		const isLastInGroup = currentGroupIndex === questions.length - 1
		//TODO check if is finish or check intermediate result
		
		if (isLastQuestion && isLastInSubgroup) {
			setTimeout(this.calculateSuite, 100)
		}
		
		this.setState({
			currentQuestionSubIndex: isLastInSubgroup ? 0 : currentQuestionSubIndex + 1,
			currentQuestionIndex:    isLastInSubgroup && !isLastQuestion ? currentQuestionIndex + 1 : currentQuestionIndex
		})
	}
	
	calculateSuite = () => {
		const { currentQuestionIndex, currentGroupIndex, questionOrder, answers } = this.state
		if (currentGroupIndex <= 4) {
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
				case 0:
					const max = counts[0]
					if ([first, second].includes(max[0].replace(/\d/, ''))) {
						this.setState({
							scores,
							suitePassed: true,
							suiteFailed: false
						})
					}
					else {
						this.setState({
							scores,
							suiteFailed: true,
							suitePassed: false
						});
					}
					break;
				case 1:
					if (map[first + 1] > map[first + 2] && map[second + 2] > map[second + 1]) {
						this.setState({
							scores,
							suitePassed: true,
							suiteFailed: false
						})
					}
					else {
						this.setState({
							scores,
							suiteFailed: true,
							suitePassed: false
						});
					}
					break;
				case 2:
					if (map[third + 3] > map[third + 4] && map[fourth + 4] > map[fourth + 3]) {
						this.setState({
							scores,
							suitePassed: true,
							suiteFailed: false
						})
					}
					else {
						this.setState({
							scores,
							suiteFailed: true,
							suitePassed: false
						});
					}
					break;
			}
			
			
		}
	}
	
	componentDidMount() {
		const { match: { params: { id } } } = this.props
		this.repository.getById(id)
			.then(data => this.setState({ questionnaire: data, loaded: true }))
			.catch(() => this.setState({ loaded: true }))
	}
	
	completeQuestionnaire = async () => {
		const { email, answers, questionnaire } = this.state
		const data = {
			email,
			answers: Object.keys(answers).map(row => ({
				answers:     answers[row],
				question_id: row
			}))
		}
		this.setState({
			sending: true
		})
		try {
			const res = await this.repository.complete(data, questionnaire.id)
			this.setState({
				result:  res,
				sending: false
			});
		}
		catch (e) {
			window.toast.error(e.message)
			this.setState({
				sending: false
			});
			alert(e.message)
		}
	}
	
	renderAnswers = (question) => {
		const {
			answers, questionnaire, currentQuestionSubIndex,
			currentQuestionIndex, currentGroupIndex,
		} = this.state
		const isSingleAnswer = question.answer_type === 'single'
		const isMultiAnswer = question.answer_type === 'multi'
		const isText = question.answer_type === 'text'
		
		let userAnswers = answers[question.id] ?? []
		
		if (isText) {
			return <Input
				caption='Введите Ваш ответ'
				value={ userAnswers[0] ?? '' }
				onChange={ e => {
					userAnswers[0] = e.target.value
					this.setState({
						answers: { ...answers, [question.id]: [...userAnswers] }
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
												answers: { ...answers, [question.id]: [...userAnswers] }
											});
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
			const isLastInGroup = currentQuestionIndex === questionnaire.questions[currentGroupIndex].length - 1
			const isLastInSubgroup = currentQuestionSubIndex === questionnaire.questions[currentGroupIndex][currentQuestionIndex].length - 1
			return (
				<div className='image-answer'>
					<img
						onClick={ () => {
							if (question.type === 'lie_test') {
								this.setState({
									answers: {
										...answers,
										lie_test: [...answers.lie_test, { ...question, answer: false }]
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
							this.checkAndNext({
								isLastInGroup,
								isLastInSubgroup
							})
						} }
						src={ require('../images/No.png') }
						alt='No'
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
							this.checkAndNext({
								isLastInGroup,
								isLastInSubgroup
							})
						} }
						src={ require('../images/Yes.png') }
						alt='Yes'
					/>
				</div>
			)
		}
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.currentStep !== this.state.currentStep) {window.scrollTo(0, 0)}
	}
	
	renderIntermediateResults = () => {
		const { suiteFailed, scores, lieScores, suitePassed } = this.state
		
		return (
			<div style={ { alignSelf: 'center' } }>
				<h1 className='h1 text-center'>{ suiteFailed ? 'Спасибо за участие в анкете.' : 'Этап пройден' }</h1>
				
				<ul className='list result-table'>
					<li>Баллы: { Object.values(scores).reduce((a, c) => a + c, 0) }</li>
					{
						isDevMode &&
						Object.entries(scores).filter(e => e[0] > 0).map(([k, v]) => <li key={ k }>{ k }: { v }</li>)
					}
					{ lieScores > 0 && <li>Шкала лжи: { lieScores }</li> }
				</ul>
				
				{
					suitePassed &&
					<button
						onClick={ () =>
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
						className='btn btn-primary mx-auto d-bloc'
					>
						Дальше
					</button>
				}
			</div>
		
		
		)
	}
	
	render() {
		const {
			email, currentStep, questionnaire, loaded, result,
			currentGroupIndex, currentQuestionIndex, currentQuestionSubIndex,
			suiteFailed, suitePassed
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
			<h1 className='h1 text-center'>Данная анкета не найдена.</h1>
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
									? <h1 className='h1'>Представьтесь пожалуйста.</h1>
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
					suiteFailed || suitePassed
						? <div className='questionnaire-content-answer'>
							{
								this.renderIntermediateResults()
							}
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
										postScript='Введите текст и нажмите Enter'
										caption='Email'
									/>
								</form>
							}
							{
								currentQuestion !== null &&
								this.renderAnswers(currentQuestion)
							}
							
							{
								['multi', 'single', 'text'].includes(currentQuestion?.answer_type) &&
								<div className='buttons'>
									<button
										onClick={ () => this.checkAndNext() }
										className='btn btn-primary'
									>Дальше
									</button>
								</div>
							}
							{
								currentStep >= questionnaire?.questions?.length + 1 &&
								<Fragment>
									<p
										style={ { margin: '0 auto 50px', fontSize: 26 } }
										className='text-center'
									>Спасибо { email } за участие в опросе.</p>
									
									{
										result &&
										<Fragment>
											<p
												style={ { margin: '0 auto 20px', fontSize: 20 } }
												className='text-center'
											>Ваши результаты:</p>
											<ul className='list result-table'>
												<li><span>Результат:</span> <span>{ result.score } баллов</span></li>
												<li><span>Правильные ответы:</span> <span>{ result.counts.correct }</span>
												</li>
												<li><span>Неправильные ответы:</span> <span>{ result.counts.wrong }</span>
												</li>
											</ul>
										</Fragment>
									}
									{
										!result &&
										<button
											onClick={ this.completeQuestionnaire }
											style={ { margin: '0 auto' } }
											className='btn btn-primary'
										>
											{
												this.state.sending
													? 'Обработка...'
													: 'Отправить ответы'
											}
										</button>
										
									}
								
								</Fragment>
								
							}
						</div>
				}
			
			</div>
		);
	}
}

export default SolveQuestionnaire;