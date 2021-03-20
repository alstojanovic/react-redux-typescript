import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

import App from './App';
import { setupStore } from './store/configureStore';
import { Theme } from './themes/Theme';
import { AppContext } from './context/appContext';

const store = setupStore();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <AppContext.Provider value={{ lang: 'en', theme: 'light' }}>
                <ThemeProvider theme={Theme}>
                    <App />
                </ThemeProvider>
            </AppContext.Provider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
