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

import { CreateCommentSection } from './CreateCommentSection';

import { ModalConfirmation } from './ModalConfirmation';

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
                <CreateCommentSection show={true} isReply={false} btnText="SEND" currentText={currentText}></CreateCommentSection>
            </div>
            <ModalConfirmation></ModalConfirmation>
        </div>
    )
}