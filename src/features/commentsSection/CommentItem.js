import { useState } from 'react';
import { useDispatch } from 'react-redux';
import './comments-section.css'
import { rateUp, rateDown, setModalStatus, editModeToggle} from './commentsSectionSlice'
import { CreateCommentSection } from './CreateCommentSection';
import { EditArea } from './EditArea';
import { CreatedAtLabel } from './CreatedAtLabel';

export function CommentItem(props){
    const commentData = props.data
    const [isEditing, setIsEditing] = useState(false)
    const [showReplySection, setShowReplySection] = useState(false)
    const [replyText, setReplyText] = useState("")

    const dispatch = useDispatch()    
    const scoreClass = (commentData.score < 0)? "wide-ammount" : (commentData.score > 19)? "medium-ammount" : ""
    const replies = commentData.replies.map((el,idx)=>{
        return <CommentItem key={idx} data={el} parentComment={commentData.id} currentUserIsOwner={props.currentUsername === el.user.username}></CommentItem>
    })
    const actionButtons = _getActionButtons(
        props.currentUserIsOwner, 
        commentData.id,
        {
            setIsEditing: setIsEditing,
            setShowReplySection: setShowReplySection,
            setReplyText: setReplyText
        },
        {
            isEditing: isEditing,
            showReplySection: showReplySection
        }    
    );
    let replyingTo = null
    if(commentData.replyingTo !== null){
        replyingTo = <span className="replying-to">@{commentData.replyingTo}</span>
    }
    return (
        <li className="comment">
            <div className="container">
                <div className={`score align ${scoreClass}`}>
                    <div className="controller">
                        <button className="increase" onClick={(e)=>dispatch(rateUp(commentData.id))}></button>
                        <div className="ammount">{commentData.score}</div>
                        <button className="decrease" onClick={(e)=>dispatch(rateDown(commentData.id))}></button>
                    </div>
                </div>
                <div className="main-section align">
                    <div className="header">
                        <div className={`author center ${props.currentUserIsOwner? 'badge':''}`}>
                            <div className="avatar-container center">
                                <img alt="avatar" src={commentData.user.image.png}></img>
                            </div>
                            <div className="username center">{commentData.user.username}</div>
                        </div>
                        <CreatedAtLabel date={commentData.createdAt}></CreatedAtLabel>
                    </div>
                    <div className="actions">
                        {actionButtons}
                    </div>
                    <div className="message">
                        <p className={`text${isEditing? ' hide':''}`}>{replyingTo} {commentData.content}</p>
                        <EditArea id={commentData.id} replyingTo={commentData.replyingTo} content={commentData.composedContent} isEditing={isEditing} setIsEditing={setIsEditing}></EditArea>
                    </div>
                </div>
            </div>
            <CreateCommentSection setReplyText={setReplyText} setShowReplySection={setShowReplySection} show={showReplySection} replyingTo={commentData.user.username} id={commentData.id} parentComment={props.parentComment} isReply={true} btnText="REPLY" currentText={replyText}></CreateCommentSection>
            <ul className="replies">
                {replies}
            </ul>
        </li>
    )
}

function _getActionButtons(currentUserIsOwner, id, setters, getters){
    const dispatch = useDispatch() 
    if(currentUserIsOwner){
        return [
            <button key={0} className="delete active-opacity" onClick={(e)=>dispatch(setModalStatus(id))}>Delete</button>,
            <button key={1} className="edit active-opacity" onClick={(e)=>{setters.setIsEditing(!getters.isEditing);dispatch(editModeToggle(id))}}>Edit</button>
        ]
    } else{
        return <button className="reply active-opacity" onClick={(e)=>{
            setters.setShowReplySection(!getters.showReplySection);
            if(!getters.showReplySection){
                setters.setReplyText("")
            }
        }}>
        
        Reply</button>
    }
}