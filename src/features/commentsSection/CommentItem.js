import { useSelector, useDispatch } from 'react-redux';
import './comments-section.css'
import {getCurrentUser, rateUp, rateDown, findCommentParent, getComments, toggleReplySection, setModalStatus, editModeToggle} from './commentsSectionSlice'
import { CreateCommentSection } from './CreateCommentSection';
import { EditArea } from './EditArea';
import { CreatedAtLabel } from './CreatedAtLabel';

export function CommentItem(props){
    const dispatch = useDispatch()
    const commentData = props.data
    const currentUser = useSelector(getCurrentUser)
    const replies = commentData.replies.map((el,idx)=>{
        return <CommentItem key={idx} data={el}></CommentItem>
    })
    const comments = useSelector(getComments)
    let replyingTo = null
    let parentComment = commentData.id 
    if(commentData.replyingTo !== null){
        replyingTo = <span className="replying-to">@{commentData.replyingTo}</span>
        parentComment = findCommentParent(comments, commentData.id).id
    }
    let actionButtons;
    if(currentUser.username !== commentData.user.username){
        actionButtons = <button className="reply active-opacity" onClick={(e)=>dispatch(toggleReplySection(commentData.id))}>Reply</button>
    } else{
        actionButtons = [
            <button key={0} className="delete active-opacity" onClick={(e)=>dispatch(setModalStatus(commentData.id))}>Delete</button>,
            <button key={1} className="edit active-opacity" onClick={(e)=>dispatch(editModeToggle(commentData.id))}>Edit</button>
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
                        <CreatedAtLabel date={commentData.createdAt}></CreatedAtLabel>
                    </div>
                    <div className="actions">
                        {actionButtons}
                    </div>
                    <div className="message">
                        <p className={`text${commentData.isEditing? ' hide':''}`}>{replyingTo} {commentData.content}</p>
                        <EditArea id={commentData.id} replyingTo={commentData.replyingTo} content={commentData.composedContent} isEditing={commentData.isEditing}></EditArea>
                    </div>
                </div>
            </div>
            <CreateCommentSection show={commentData.showReplySection} replyingTo={commentData.user.username} id={commentData.id} parentComment={parentComment} isReply={true} btnText="REPLY" currentText={commentData.replyText}></CreateCommentSection>
            <ul className="replies">
                {replies}
            </ul>
        </li>
    )
}