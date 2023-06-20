import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import initialData from './data.json'

const initialState = initialData;

export const commentsSectionSlice = createSlice({
    name: 'commentsSection',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Create a new first level comment
        add: {
            reducer: (state, action) => {
                state.textareaContent = ""
                state.comments.push(action.payload)
                state.latestComment += 1
            },
            prepare:(commentAttrs) => {
                return {
                    payload: commentFactory(commentAttrs)
                }
            }
        },
        reply: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1;
        },
        edit:  (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1;
        },
        remove:  (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1;
        },
        rateUp: (state, action) => {
            applyScore(state.comments, action.payload, "+")
        },
        rateDown: (state,action) => {
            applyScore(state.comments, action.payload, "-")
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmmount: (state, action) => {
            state.value += action.payload;
        },
        textareaChanged: (state,action)=>{
            state.textareaContent = action.payload
        }
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

function findComment(comments, id){
    for( let i = 0; i <= comments.length; i++ ){
        if(comments[i].id === id){
            return comments[i]
        } else{
            if( typeof comments[i].replies === "undefined" || comments[i].replies.length === 0 ){
                continue;
            } else{
                let found = findComment(comments[i].replies, id)
                if(found !== false){
                    return found
                }
            }
        }
    }
    return false
}

export const { add, reply, edit, remove,rateUp,rateDown,incrementByAmmount,textareaChanged } = commentsSectionSlice.actions;

export const commentFactory = function (attrs){
    const id = attrs.id
    const content = attrs.content
    const createdAt = "1 month ago";//new Date().toISOString()
    const score = (typeof attrs.score === 'undefined')? 0:attrs.score
    const username = attrs.user.username
    const replyingTo = (typeof attrs.replyingTo === 'undefined')? null : attrs.replyingTo
    const replies = (typeof attrs.replies === "undefined" )? [] : attrs.replies

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
        "replyingTo" : null
    }

    if( replyingTo !== null ){
        newComment.replyingTo = replyingTo
    }

    return newComment

}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getComments = (state) => {
    return state.commentsSection.comments;
}

export const getCurrentUser = (state) => state.commentsSection.currentUser

export const getCurrentText = (state) => state.commentsSection.textareaContent

export const getLatestId = (state) => state.commentsSection.latestComment

export default commentsSectionSlice.reducer;