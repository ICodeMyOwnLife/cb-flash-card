import React, { FC, memo } from 'react';
import FlashCardPage from './pages/FlashCardPage';

export const AppComponent: FC = () => <FlashCardPage />;

const App = memo(AppComponent);
App.displayName = 'App';
export default App;
