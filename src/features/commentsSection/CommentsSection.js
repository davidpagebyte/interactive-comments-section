import { useSelector } from 'react-redux';
import './comments-section.css'
import {
    getComments,
    getCurrentText,
    findCommentParent,
    getCurrentUser
} from './commentsSectionSlice'
import {CommentItem} from './CommentItem'
import { CreateCommentSection } from './CreateCommentSection';
import { ModalConfirmation } from './ModalConfirmation';
import { UserSelector } from './UserSelector';

export function CommentsSection(){
    const currentText = useSelector(getCurrentText)
    const comments = useSelector(getComments)
    const currentUser = useSelector(getCurrentUser)
    const topComments = comments.map((el,idx) => {
        let parentComment = el.id
        if(el.replyingTo !== null){
            parentComment = findCommentParent(comments, el.id).id
        }
        return <CommentItem key={idx} data={el} parentComment={parentComment} currentUserIsOwner={currentUser.username === el.user.username} currentUsername={currentUser.username}></CommentItem>
    })
    return (
        <div id="comments-section">
            <UserSelector></UserSelector>
            <div className="wrapper">
                <ul className="thread">{topComments}</ul>
                <CreateCommentSection show={true} isReply={false} btnText="SEND" currentText={currentText}></CreateCommentSection>
            </div>
            <ModalConfirmation></ModalConfirmation>
        </div>
    )
}