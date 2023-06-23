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
} from './commentsSectionSlice'

export function EditArea(props){
    const dispatch = useDispatch()
    const className = `edit-area ${!props.isEditing? '' : 'hide'}`
    return (
        <div className={className}>
            <textarea className="edit-message" value={props.content}>

            </textarea>
            <button className="update-submit">UPDATE</button>
        </div>
    )
}