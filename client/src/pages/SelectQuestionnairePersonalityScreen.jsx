import { observer }         from 'mobx-react'
import React, { Component } from 'react';
import {
	SortableContainer,
	SortableElement,
	arrayMove
}                           from 'react-sortable-hoc'
import {
	Row,
	Col,
	Button
}                           from 'reactstrap'
import QuestionnaireState   from '../store/QuestionnaireState'

const dictionary = {
	'w': 'Will',
	'l': 'Logic',
	'e': 'Emotion',
	'p': 'Physic',
}

@observer
class SelectQuestionnairePersonalityScreen extends Component {
	
	
	render() {
		return (
			<Row className='fancy-block mb-4 animated fadeIn py-3'>
				<Col lg={ 12 }>
					<p className='text-primary font-weight-bold px-4'>Personality</p>
				</Col>
				
				<Col
					id='ctn'
					lg={ 6 }
					className='px-4'
				>
					<Pyramid
						helperClass={ 'active' }
						axis='y'
						helperContainer={ () => document.querySelector('.pyramid') }
						onSortEnd={ ({ newIndex, oldIndex }) => {
							QuestionnaireState.questionnaireType = arrayMove(QuestionnaireState.questionnaireType.split(''), oldIndex, newIndex).join('')
						} }
						type={ QuestionnaireState.questionnaireType }
					/>
				</Col>
				<Col
					lg={ 6 }
					className='px-4'
				>
					<b className='text-primary'>{ QuestionnaireState.questionnaireType.toUpperCase() }</b>
					<p
						style={ { color: '#645A5A' } }
						className='mt-3'
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias asperiores, assumenda atque
						beatae delectus ducimus eveniet ex facilis fugit inventore nam nesciunt nostrum officia
						perspiciatis, possimus quidem saepe sed soluta.
					</p>
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

const Pyramid = SortableContainer(({ type, ...props }) => {
	return <div className='pyramid' { ...props }>
		{
			type.split('').map((r, i) => <Word
				children={ dictionary[r] }
				key={ i + r }
				index={ i }
				position={ i }
			/>)
		}
	</div>
	
})
const Word = SortableElement((props) => (
	<div className={ `item-${ props.position + 1 }` }><span className='drag-mark' /><span>{ props.children }</span>
	</div>
))

export default SelectQuestionnairePersonalityScreen;