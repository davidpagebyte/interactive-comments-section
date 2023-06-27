import { useSelector, useDispatch } from 'react-redux';
import './comments-section.css'
import { remove, getModalStatus, setModalStatus } from './commentsSectionSlice'

export function ModalConfirmation(props){
    const dispatch = useDispatch()
    const modalStatus = useSelector(getModalStatus)
    let className =  `modal ${(modalStatus < 0)? 'hide':''}`

    return (
        <div id="myModal" className={className}>
            <div className="modal-content">
                <h3 className="header">Delete comment</h3>
                <p className="message">Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>
                <div className="delete-confirm" >
                    <button className="cancel align primary-button active-opacity" onClick={(e=>dispatch(setModalStatus(-1)))}>NO, CANCEL</button>
                    <button className="close align primary-button active-opacity" onClick={(e=>dispatch(remove(modalStatus)))}>YES, DELETE</button>
                </div>
            </div>
        </div>
    )
}