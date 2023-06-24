import { configureStore } from '@reduxjs/toolkit';
import commentsSectionReducer from '../features/commentsSection/commentsSectionSlice'

export const store = configureStore({
	reducer: {
		commentsSection: commentsSectionReducer
	},
});
