export const appReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...prevState,
        isLoading: action.newLoadingState,
      };
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'SET_TRAINS':
      return {
        ...prevState,
        isLoading: false,
        TRAIN_LINES: action.trains,
      };
    case 'SET_BUSES':
      return {
        ...prevState,
        isLoading: false,
        BUS_ROUTES: action.busRoutes,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
    case 'SET_UPDATE':
      return {
        ...prevState,
        toBeUpdated: action.toBeUpdated,
      };
    default:
      return prevState;
  }
};
