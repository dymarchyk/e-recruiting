import classNames                      from 'classnames'
import React, { forwardRef, useState } from 'react'

export default forwardRef((props, ref) => {
	const [focused, setFocus] = useState(!!props?.value)
	
	const { postScript, caption, ...rest } = props
	
	return (
		<div
			className={ classNames('input', {
				focused
			}) }
		>
			{ caption && <span className='label'>{ caption }</span> }
			<input
				onBlur={ () => setFocus(!!props?.value) }
				onFocus={ () => setFocus(true) }
				{ ...rest }
				ref={ ref }
			/>
			
			{ postScript && <span className='post-script'>{ postScript }</span> }
		</div>
	)
})