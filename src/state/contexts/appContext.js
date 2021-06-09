import React from 'react';
import {appReducer} from '../reducers/appReducer';

const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    isLoading: true,
    TRAIN_LINES: [
      {
        trainNumber: 801,
        routeColor: 'red',
        position: {
          latitude: parseFloat(41.87815),
          longitude: parseFloat(-87.6276),
        },
        data: {
          heading: '358',
        },
      },
    ],
    BUS_ROUTES: [
      {routeNumber: '124', routeColor: '#ff9999', routeName: 'Navy Pier'},
      {routeNumber: '126', routeColor: '#6699ff', routeName: 'Jackson'},
    ],
    toBeUpdated: false,
  });

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}
function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}

export {AppProvider, useAppState, useAppDispatch};
