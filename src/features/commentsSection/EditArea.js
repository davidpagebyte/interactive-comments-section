import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    add,
    reply,
    edit,
    remove,
    rateUp,
    rateDown,
    textareaChanged,
    getComments,
    getCurrentUser,
    getCurrentText,
    getLatestId,
    ongoingTextEdit,
    finishEdit
} from './commentsSectionSlice'

export function EditArea(props){
    const dispatch = useDispatch()
    const className = `edit-area ${props.isEditing? '' : 'hide'}`
    return (
        <div className={className}>
            <textarea className="edit-message raw-comment-text" value={props.content} onChange={(e)=>dispatch(ongoingTextEdit({id:props.id,text:e.target.value}))}>

            </textarea>
            <button className="update-submit primary-button submit-btn" onClick={(e)=>dispatch(finishEdit(props.id))}>UPDATE</button>
        </div>
    )
}