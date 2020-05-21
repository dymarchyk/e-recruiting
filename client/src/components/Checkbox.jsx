import classNames            from 'classnames'
import React, { forwardRef } from 'react'

export default forwardRef((props, ref) => {
	const { isSelected, text, className, ...rest } = props
	return (
		<div
			onClick={ props.onChange }
			className={ classNames('checkbox', className) }
		>
			<label>
				<input
					value={ isSelected }
					{ ...rest }
					ref={ ref }
					type='checkbox'
				/>
				<span
					className={ classNames('checkbox-icon', {
						square: props?.type !== 'radio',
						round:  props?.type === 'radio',
						active: isSelected
					}) }
				>
				</span>
			</label>
			{ text }
		</div>
	)
})