import { debounce }         from 'lodash'
import { observable }       from 'mobx'
import { observer }         from 'mobx-react'
import React, { Component } from 'react'
import { CopyToClipboard }  from 'react-copy-to-clipboard';
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
			<div className='container min-vh-80 animated fadeIn'>
				<div className='d-flex align-items-center justify-content-between'>
					<h1 className='h1'>Questionnares</h1>
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
								placeholder='Search...'
								type='text'
							/>
							<span
								className={ `fa ${ QuestionnaireState.filtering
									? 'fa-spinner fa-spin'
									: 'fa-search' }` }
							/>
						</div>
					}
				
				</div>
				
				{
					(QuestionnaireState.data?.length > 0 || QuestionnaireState.filtered) &&
					<div className='mb-5'>
						<div className='tab-header'>
							<span>Title</span>
							<span>Personality</span>
							<span>Hard skills</span>
							<span>Respond count</span>
						</div>
						
						{
							QuestionnaireState.data?.map(row => (
								<div
									key={ row.id }
									className='tab'
								>
									<span className='justify-content-between d-flex align-items-center'>
										{ row.title || '-' }
										<span className='d-flex justify-content-end align-items-center p-0'>
											<CopyToClipboard
												onCopy={ () => window.toast.success('Link copied!') }
												text={ `${ window.location.origin }/solve/${ row.id }` }
											>
											<span
												title='Copy link'
												className='pointer p-2 fa fa-copy text-primary'
											/>
										</CopyToClipboard>
									<a
										className='p-2'
										href={ `solve/${ row.id }` }
										target='_blank'
										rel='noopener noreferrer'
										title='Open in new tab'
									><span className='fa fa-link p-0' /></a>
										</span>
									</span>
									
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
								<span>Nothing found</span>
							</div>
						}
					</div>
				}
				{
					QuestionnaireState.data && QuestionnaireState.page < QuestionnaireState.last &&
					<button
						onClick={ () => QuestionnaireState.getAll(QuestionnaireState.page + 1) }
						className='btn btn-outline-primary mt-3 mx-auto d-block'
					>Show more</button>
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
							className='btn btn-outline-primary mx-auto d-block'
						>Create first questionnaire
						</button>
					</div>
				}
			
			</div>
		)
	}
}

export default QuestionnaireScreen