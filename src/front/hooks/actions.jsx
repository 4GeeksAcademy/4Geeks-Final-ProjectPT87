// Retrieves all runners from backend and updates global state
export const fetchRunner = async (dispatch) => {
  const response = await fetch(process.env.BACKEND_URL + "/runners");
  const data = await response.json();

  dispatch({
    type: "set_runners",
    payload: data
  });
};

// Creates new Profile data to backend and adds it to global state
export const createRunner = async (dispatch, newRunner) => {
  const response = await fetch(process.env.BACKEND_URL + "/runners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newRunner)
  });

  const data = await response.json();

  dispatch({
    type: "add_runner",
    payload: data
  });
};

// Deletes profile from backed and removes it from global state
export const deleteRunner = async (dispatch, id) => {
  await fetch(process.env.BACKEND_URL + "/runners/" + id, {
    method: "DELETE"
  });

  dispatch({
    type: "delete_runner",
    payload: id
  });
};
