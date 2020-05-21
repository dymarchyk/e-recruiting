import classNames from 'classnames'
import React, {
	forwardRef,
	useState
}                 from 'react'

export default forwardRef((props, ref) => {
	const [focused, setFocus] = useState(!!props?.value)
	
	const { postScript, caption, className, underline, inputClassName, style, ...rest } = props
	
	const Tag = rest?.type === 'textarea'
		? 'textarea'
		: 'input'
	
	return (
		<div
			style={ style }
			className={ classNames('input', className, rest?.type, {
				focused: focused && !underline
			}) }
		>
			{ caption && <span className='label'>{ caption }</span> }
			<Tag
				onBlur={ () => setFocus(!!props?.value) }
				onFocus={ () => setFocus(true) }
				{ ...rest }
				className={ inputClassName }
				ref={ ref }
			/>
			
			{ postScript && <span className='post-script'>{ postScript }</span> }
		</div>
	)
})