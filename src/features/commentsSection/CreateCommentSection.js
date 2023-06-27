import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    add,
    reply,
    textareaChanged,
    getCurrentUser,
    getLatestId,
} from './commentsSectionSlice'

export function CreateCommentSection(props){
    const textareaRef = useRef(null)
    useEffect(()=>{
        if(props.show){
            textareaRef.current.focus() 
        }
    }, [props.show])
    const dispatch = useDispatch()
    const btnText = (typeof props.btnText === "undefined")? "SEND" : props.btnText;
    const currentUser = useSelector(getCurrentUser)
    const avatarPng = require(`./images/avatars/image-${currentUser.username}.png`)
    const latestCommentId =  useSelector(getLatestId)
    const currentText = props.currentText
    const parentComment = (typeof props.parentComment === "undefined")? null : props.parentComment 
    const createAction = props.isReply? reply:add;
    let className = `create-comment container ${(props.isReply)? 'reply' : ''}`
    className += (props.show)? "":" hide"
    return (
        <div className={className}>
            <div className='user-avatar align'>
                <img alt='avatar' src={avatarPng}></img>
            </div>
            <div className='user-input align'>
                <textarea placeholder="Add a comment..." ref={textareaRef} className='text raw-comment-text' value={currentText} onChange={(e) => dispatch(textareaChanged({value: e.target.value, isReply: props.isReply,repliedComment: props.id}))}></textarea>
            </div>
            <div className='submit align' onClick={(e) => dispatch(createAction({
                id: latestCommentId+1,
                content: currentText,
                user: {
                    username: currentUser.username
                },
                parentComment: parentComment,
                commentId: props.id,
                replyingTo: props.replyingTo
            }))}>
                <button className="primary-button submit-btn active-opacity">{btnText}</button>
            </div>
            
        </div>
    )
}