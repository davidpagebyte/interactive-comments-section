import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './comments-section.css'
import {getCurrentUser, rateUp, rateDown, findCommentParent, getComments, toggleReplySection, remove, getModalStatus, setModalStatus} from './commentsSectionSlice'

import { CreateCommentSection } from './CreateCommentSection';
import deleteIcon from './images/icon-delete.svg'
import editIcon from './images/icon-edit.svg'
import replyIcon from './images/icon-reply.svg'
import plusIcon from './images/icon-plus.svg'
import minusIcon from './images/icon-minus.svg'

export function ModalConfirmation(props){
    const dispatch = useDispatch()
    const modalStatus = useSelector(getModalStatus)
    console.log(modalStatus)
    let className =  `modal ${(modalStatus < 0)? 'hide':''}`

    return (
        <div id="myModal" className={className}>
            <div className="modal-content">
                <h3 className="header">Delete comment</h3>
                <p className="message">Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>
                <div className="delete-confirm" >
                    <button className="cancel align" onClick={(e=>dispatch(setModalStatus(-1)))}>NO, CANCEL</button>
                    <button className="close align" onClick={(e=>dispatch(remove(modalStatus)))}>YES, DELETE</button>
                </div>
            </div>
        </div>
    )
}