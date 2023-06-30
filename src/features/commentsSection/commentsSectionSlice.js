import { createSlice } from '@reduxjs/toolkit';
import defaultData from './data.json'
import { globalSettings } from './globals';

const localDataKey = "comments-section-state";

let initialState;

function _loadData(){
    try{
        let localData = localStorage.getItem(localDataKey)
        return JSON.parse(localData)
    } catch(e){
        return null;
    }
}

function _saveState(state){
    localStorage.setItem(localDataKey, JSON.stringify(state))
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

export const commentFactory = function (attrs){
    const id = attrs.id
    const content = attrs.content
    const createdAt = (new Date()).toString()
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
        "composedContent": `${replyingTo === null?'':'@'+replyingTo+' '}${content}`
    }

    if( replyingTo !== null ){
        newComment.replyingTo = replyingTo
    }
    return newComment
}

initialState = _loadData()

if(initialState === null){
    initialState = defaultData;
    initialState.comments = _initData(initialState.comments)
    initialState.comments.sort((a,b)=>b.score-a.score)
}

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
                _insertCommentInPlace(state.comments,action.payload)
                _saveState(state)
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
            _saveState(state)
        },
        editModeToggle:  (state, action) => {
            let comment = findComment(state.comments, action.payload)
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
            _saveState(state)
        },
        rateUp: (state, action) => {
            const isReply = applyScore(state.comments, action.payload, "+", globalSettings.maxScore)
            if(!isReply){
                _rearrangeComments(state.comments, action.payload)
            }
            _saveState(state)
        },
        rateDown: (state,action) => {
            const isReply = applyScore(state.comments, action.payload, "-", globalSettings.minScore)
            if(!isReply){
                _rearrangeComments(state.comments, action.payload)
            }
            _saveState(state)
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
        },
        changedUser: (state,action)=>{
            state.currentUser = globalSettings.availableUsers[action.payload]
        },
    },
});

function applyScore(comments, commentId, operation, boundary){
    let commentToEdit = findComment(comments, commentId)
    if(operation === "+"){
        if( (commentToEdit.score + 1) <= boundary){
            commentToEdit.score += 1
        }
    } else{
        if( (commentToEdit.score - 1) >= boundary){
            commentToEdit.score -= 1
        }
    }
    //Inform if scored comment is a reply
    return commentToEdit.replyingTo !== null;
}

function findComment(comments, id, getParent, getIndex){
    getParent = ( typeof getParent === "undefined" )? false:getParent;
    getIndex = ( typeof getIndex === "undefined" )? false:getIndex;
    for( let i = 0; i < comments.length; i++ ){
        if(comments[i].id === id){
            return getIndex? i : comments[i]
        } else{
            if( typeof comments[i].replies === "undefined" || comments[i].replies.length === 0 ){
                continue;
            } else{
                let found = findComment(comments[i].replies, id, getParent, getIndex)
                if(found !== false){
                    if(getParent){
                        return getIndex? i : comments[i]
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

function _rearrangeComments(comments, commentId){
    const scoredCommentIndex = findComment(comments, commentId, false, true)
    const commentToRelocate = comments.slice(scoredCommentIndex, scoredCommentIndex+1)[0]
    comments.splice(scoredCommentIndex,1)
    _insertCommentInPlace(comments,commentToRelocate)
}

function _insertCommentInPlace(comments, newComment){
    let insertPosition = -1;
    for(let x = 0; x < comments.length; x++){
        if( newComment.score > comments[x].score ){
            insertPosition = x;
            break;
        }
    }
    if( insertPosition === -1 ){
        comments.push(newComment)
    } else{
        comments.splice(insertPosition,0,newComment)
    }
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
    textareaChanged, 
    toggleReplySection, 
    setModalStatus, 
    ongoingTextEdit,
    finishEdit,
    changedUser 
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