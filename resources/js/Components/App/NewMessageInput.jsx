import React, { useEffect, useRef } from 'react'

function NewMessageInput({value, onChange, onSend}) {
  // console.log(value)
  let input = useRef()
  const onInputKeyDown = (ev) =>{
    if(ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      onSend()
    } 
    if(ev.shiftKey) {
      // console.log('first')
      adjustHeight()
    }
  }

  const onChangeEvent = (ev) =>{
    setTimeout(()=>{
      adjustHeight();
    },10)
    onChange(ev)
  }

  const adjustHeight= () =>{
    // console.log('first')
    setTimeout(()=>{
      // console.log('aut')
      input.current.style.height = 'auto'
      input.current.style.height = input.current.scrollHeight + 1 + 'px'
    },100)
  }

  useEffect(()=>{
    adjustHeight();
  },[value])

  return (
    <>
      <textarea 
        ref={input}
        value={value}
        rows='1'
        placeholder='Type a Message'
        onKeyDown={(ev)=>onInputKeyDown(ev)}
        onChange={(ev)=>onChangeEvent(ev)}
        className='w-full overflow-y-auto rounded-l rounded-r-none resize-none input-bordered max-h-40'
      >

      </textarea>
    </>
  )
}

export default NewMessageInput