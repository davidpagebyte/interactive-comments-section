import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './comments-section.css'
import {commentFactory, getCurrentUser, rateUp, rateDown} from './commentsSectionSlice'
import deleteIcon from './images/icon-delete.svg'
import editIcon from './images/icon-edit.svg'
import replyIcon from './images/icon-reply.svg'
import plusIcon from './images/icon-plus.svg'
import minusIcon from './images/icon-minus.svg'

export function CommentItem(props){
    const dispatch = useDispatch()
    const commentData = commentFactory(props.data)
    const currentUser = useSelector(getCurrentUser)
    const replies = commentData.replies.map((el,idx)=>{
        return <CommentItem key={idx} data={el}></CommentItem>
    })
    let replyingTo = null
    if(commentData.replyingTo !== null){
        replyingTo = <span className="replying-to">@{commentData.replyingTo}</span>
    }
    let actionButtons;
    if(currentUser.username !== commentData.user.username){
        actionButtons = <button className="reply">Reply</button>
    } else{
        actionButtons = [
            <button className="delete">Delete</button>,
            <button className="edit">Edit</button>
        ]
    }
    return (
        <li className="comment">
            <div className="container">
                <div className="score align">
                    <div className="controller">
                        <button className="increase" onClick={(e)=>dispatch(rateUp(commentData.id))}></button>
                        <div className="ammount">{commentData.score}</div>
                        <button className="decrease" onClick={(e)=>dispatch(rateDown(commentData.id))}></button>
                    </div>
                </div>
                <div className="main-section align">
                    <div className="header">
                        <div className="author center">
                            <div className="avatar-container center">
                                <img alt="avatar" src={commentData.user.image.png}></img>
                            </div>
                            <div className="username center">{commentData.user.username}</div>
                        </div>
                        <div className="created-at center">{commentData.createdAt}</div>
                    </div>
                    <div className="actions">
                        {actionButtons}
                    </div>
                    <div className="message">
                        <p className="text">{replyingTo} {commentData.content}</p>
                    </div>
                </div>
            </div>
            <div className="reply-section">
                
            </div>
            <ul className="replies">
                {replies}
            </ul>
        </li>
    )
}