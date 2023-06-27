import ReactTimeAgo from 'react-time-ago'

export function CreatedAtLabel(props){
    return (
        <div className="created-at center"><ReactTimeAgo date={new Date(props.date)}/></div>
    )
}