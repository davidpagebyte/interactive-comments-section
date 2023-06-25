import { createSlice } from '@reduxjs/toolkit';
import initialData from './data.json'

let initialState = initialData;

export const commentFactory = function (attrs){
    const id = attrs.id
    const content = attrs.content
    const createdAt = "1 month ago";//new Date().toISOString()
    const score = (typeof attrs.score === 'undefined')? 0:attrs.score
    const username = attrs.user.username
    const replyingTo = (typeof attrs.replyingTo === 'undefined')? null : attrs.replyingTo
    const replies = (typeof attrs.replies === "undefined" )? [] : attrs.replies
    const replyText = (typeof attrs.replyText === "undefined")? "":attrs.replyText
    const showReplySection = (typeof attrs.showReplySection === "undefined")? false:attrs.showReplySection

    const avatarPng = require(`./images/avatars/image-${username}.png`)
    const avatarWebp = require( `./images/avatars/image-${username}.webp`)

    let newComment = {
        "id": id,
        "content": content,
        "createdAt": createdAt,
        "score": score,
        "user": {
            "image": {
                "png": avatarPng,
                "webp": avatarWebp
            },
            "username": username
        },
        "replies": replies,
        "replyingTo" : null,
        "replyText":replyText,
        "showReplySection": showReplySection,
        "isEditing": false,
        "composedContent": `${replyingTo === null?'':'@'+replyingTo+' '}${content}`
    }

    if( replyingTo !== null ){
        newComment.replyingTo = replyingTo
    }
    return newComment
}

function _initData(comments){
    comments = comments.map((el,i)=>{
        if( typeof el.replies !== "undefined" && el.replies.length > 0 ){
            el.replies = _initData(el.replies)
        }
        return commentFactory(el)
    })
    return comments
}
initialState.comments = sortCommentsByScore(_initData(initialState.comments))

export const commentsSectionSlice = createSlice({
    name: 'commentsSection',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Create a new first level comment
        add: {
            reducer: (state, action) => {
                state.textareaContent = ""
                state.latestComment += 1
                state.comments.push(action.payload)
                state.comments = sortCommentsByScore(state.comments)
            },
            prepare:(commentAttrs) => {
                return {
                    payload: commentFactory(commentAttrs)
                }
            }
        },
        reply: (state, action) => {
            const parentComment = findComment(state.comments, action.payload.parentComment)
            let commentReplied = findComment(state.comments, action.payload.commentId)
            commentReplied.showReplySection=false
            commentReplied.replyText = ""
            const newComment = commentFactory(action.payload)
            parentComment.replies.push(newComment)
            state.latestComment += 1

        },
        editModeToggle:  (state, action) => {
            let comment = findComment(state.comments, action.payload)
            comment.isEditing = !comment.isEditing
            if(!comment.isEditing){
                //Hiding edit area without submiting changes. Reseting textarea
                comment.composedContent = comment.content
                if( comment.replyingTo !== null ){
                    comment.composedContent = `@${comment.replyingTo} ${comment.composedContent}`
                }
            }
        },
        remove:  (state, action) => {
            removeComment(state.comments, action.payload)
            state.showModal = -1
        },
        rateUp: (state, action) => {
            applyScore(state.comments, action.payload, "+")
            state.comments = sortCommentsByScore(state.comments)
        },
        rateDown: (state,action) => {
            applyScore(state.comments, action.payload, "-")
            state.comments = sortCommentsByScore(state.comments)
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmmount: (state, action) => {
            state.value += action.payload;
        },
        textareaChanged: (state,action)=>{
            if( action.payload.isReply ){
                const repliedComment = findComment(state.comments, action.payload.repliedComment )
                repliedComment.replyText = action.payload.value
            } else{
                state.textareaContent = action.payload.value
            }
        },
        toggleReplySection: (state,action)=>{
            let comment = findComment(state.comments, action.payload)
            comment.showReplySection = !comment.showReplySection
            comment.replyText = "";
        },
        setModalStatus: (state,action)=>{
            state.showModal = action.payload
        },
        ongoingTextEdit: (state,action)=>{
            let comment = findComment(state.comments, action.payload.id)
            comment.composedContent = action.payload.text
        },
        finishEdit: (state,action)=>{
            let comment = findComment(state.comments, action.payload)
            if(comment.replyingTo === null){
                comment.content = comment.composedContent
            } else{
                if(comment.composedContent.search(`@${comment.replyingTo}`) > -1){
                    comment.composedContent = comment.composedContent.replace(`@${comment.replyingTo}`,'')
                } else{
                    const indexOfTag = comment.composedContent.search('@') 
                    if( indexOfTag === 0 ){
                        //Tag was partially deleted, find end of partial tag
                        let endIndex = comment.composedContent.search(' ');
                        if( endIndex > -1 ){
                            let substringToRemove = comment.composedContent.substring(0,endIndex)
                            console.log('String to remove is '+substringToRemove)
                            comment.composedContent = comment.composedContent.replace(substringToRemove,"")
                            
                        }
                    }
                }
                comment.content = comment.composedContent
                comment.composedContent = `@${comment.replyingTo} ${comment.composedContent}`
            }
            comment.isEditing = false
        },
    },
});

function applyScore(comments, commentId, operation){
    let commentToEdit = findComment(comments, commentId)
    if(operation === "+"){
        commentToEdit.score += 1
    } else{
        commentToEdit.score -= 1
    }
}

function findComment(comments, id, getParent){
    getParent = ( typeof getParent === "undefined" )? false:getParent;
    for( let i = 0; i < comments.length; i++ ){
        if(comments[i].id === id){
            return comments[i]
        } else{
            if( typeof comments[i].replies === "undefined" || comments[i].replies.length === 0 ){
                continue;
            } else{
                let found = findComment(comments[i].replies, id)
                if(found !== false){
                    if(getParent){
                        return comments[i]
                    } else{
                        return found
                    }
                }
            }
        }
    }
    return false
}

function removeComment(comments, id){
    for( let i = 0; i < comments.length; i++ ){
        if(comments[i].id === id){
            comments.splice(i,1)
            return true
        } else{
            if( typeof comments[i].replies === "undefined" || comments[i].replies.length === 0 ){
                continue;
            } else{
                for( let j = 0; j < comments[i].replies.length; j++ ){
                    if( comments[i].replies[j].id === id ){
                        comments[i].replies.splice(j,1)
                        return true
                    }
                }
            }
        }
    }
    return false
}

function sortCommentsByScore(comments){
    return comments.sort((a,b)=>b.score-a.score)
}

export const findCommentParent = (comments,id) =>{
    return findComment(comments, id, true)
}

export const { 
    add, 
    reply, 
    editModeToggle, 
    remove,
    rateUp,
    rateDown,
    incrementByAmmount,
    textareaChanged, 
    toggleReplySection, 
    setModalStatus, 
    ongoingTextEdit,
    finishEdit 
} = commentsSectionSlice.actions;



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getComments = (state) => {
    return state.commentsSection.comments;
}

export const getCurrentUser = (state) => state.commentsSection.currentUser

export const getCurrentText = (state) => state.commentsSection.textareaContent

export const getLatestId = (state) => state.commentsSection.latestComment

export const getModalStatus = (state) => state.commentsSection.showModal

export default commentsSectionSlice.reducer;