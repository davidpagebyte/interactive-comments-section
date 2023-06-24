import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { CommentsSection } from './features/commentsSection/CommentsSection';
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<CommentsSection/>
			</header>
		</div>
	);
}

export default App;
