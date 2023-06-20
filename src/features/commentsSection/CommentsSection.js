import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './comments-section.css'

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

import {CommentItem} from './CommentItem'
const defaultStyle={
    backgroundColor:'red',
    width: 100,
    height: 100
}

export function CommentsSection(){
    const dispatch = useDispatch()
    const latestCommentId =  useSelector(getLatestId)
    const currentText = useSelector(getCurrentText)
    const currentUser = useSelector(getCurrentUser)
    const avatarPng = require(`./images/avatars/image-${currentUser.username}.png`)
    const comments = useSelector(getComments)
    const topComments = comments.map((el,idx) => {
        return <CommentItem key={idx} data={el}></CommentItem>
    })
    return (
        <div id="comments-section">
            <div className="wrapper">
                <ul className="thread">{topComments}</ul>
                <div className="create-comment container">
                    <div className='user-avatar align'>
                        <img alt='avatar' src={avatarPng}></img>
                    </div>
                    <div className='user-input align'>
                        <textarea className='text' value={currentText} onChange={(e) => dispatch(textareaChanged(e.target.value))}></textarea>
                    </div>
                    <div className='submit align' onClick={(e) => dispatch(add({
                        id: latestCommentId,
                        content: currentText,
                        user: {
                            username: currentUser.username
                        }
                    }))}>
                        <button>SEND</button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}