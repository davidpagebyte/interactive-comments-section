import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import commentsSectionReducer from '../features/commentsSection/commentsSectionSlice'

export const store = configureStore({
	reducer: {
		commentsSection: commentsSectionReducer
	},
});
