import { useSelector, useDispatch } from 'react-redux';
import './comments-section.css'
import {
    getComments,
    getCurrentText,
} from './commentsSectionSlice'
import {CommentItem} from './CommentItem'
import { CreateCommentSection } from './CreateCommentSection';
import { ModalConfirmation } from './ModalConfirmation';

export function CommentsSection(){
    const currentText = useSelector(getCurrentText)
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