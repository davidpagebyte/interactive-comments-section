import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    ongoingTextEdit,
    finishEdit
} from './commentsSectionSlice'

export function EditArea(props){
    const textareaRef = useRef(null);
    useEffect(()=>{
        if(props.isEditing){
            textareaRef.current.focus() 
            textareaRef.current.selectionStart = textareaRef.current.value.length;
        }
    }, [props.isEditing])
    const dispatch = useDispatch()
    const className = `edit-area ${props.isEditing? '' : 'hide'}`
    return (
        <div className={className}>
            <textarea ref={textareaRef} className="edit-message raw-comment-text" value={props.content} onChange={(e)=>dispatch(ongoingTextEdit({id:props.id,text:e.target.value}))}>

            </textarea>
            <button className="update-submit primary-button submit-btn" onClick={(e)=>dispatch(finishEdit(props.id))}>UPDATE</button>
        </div>
    )
}