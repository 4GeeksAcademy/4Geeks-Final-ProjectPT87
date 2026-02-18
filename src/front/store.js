// Defines the initial global state of the application
export const initialStore = () => {
  return {
    message: null,
    runners: [],
    singleRunner: null,
    loading: false, // for loading screens later
    token: []
}

// Reducer function that updates global state based on dispatched actions
export default function storeReducer(store, action = {}) {
  switch(action.type){

    // Replaces the entire runners array with fetched data
    case "set_runners":
      return {
        ...store,
        runners: action.payload
      };

    // storing single runners
    // case "set_single_runner":
    //   return {
    //     ...store,
    //     singlerunner: action.payload
    //   };

      // adding runners to the existing runner array
    case "add_runner":
      return {
        ...store,
        runners: [...store.runners, action.payload]
      };

      // editing runners info inside array
      case "update_runner":
  return {
    ...store,
    runners: store.runners.map(runner =>
      runner.id === action.payload.id
        ? action.payload
        : runner
    )
  };

      // deleting runner by removing id
    case "delete_runner":
      return {
        ...store,
        runners: store.runners.filter(
          runner => runner.id !== action.payload
        )
      };

    default:
      return store;
  }
}

