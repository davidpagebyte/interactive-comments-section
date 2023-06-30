import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, changedUser } from './commentsSectionSlice'
import { globalSettings } from './globals';

export function UserSelector(props){
    const dispatch = useDispatch()
    const currentUser = useSelector(getCurrentUser)
    const userButtons = globalSettings.availableUsers.map((el, idx)=>{
        let style = {
            backgroundImage: `url(${el.image.png})`
        }
        return (
            <button onClick={(e)=>dispatch(changedUser(idx))} key={idx} alt="user" style={style}  className={`center user-btn ${currentUser.username === el.username? 'current':''}`}></button>
        )
    })
    return (
        <section id="user-selector">
            {userButtons}
        </section>
    )
}