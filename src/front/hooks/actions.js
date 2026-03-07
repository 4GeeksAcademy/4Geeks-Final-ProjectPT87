// Retrieves all list_runners from backend and updates global state
export const fetchRunner = async (dispatch) => {
  const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/list_runners");
  const data = await response.json();

  dispatch({
    type: "set_runners",
    payload: data
  });
};

// Creates new Profile data to backend and adds it to global state
export const createRunner = async (dispatch, newRunner) => {
  const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/list_runners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(newRunner)
  });

  const data = await response.json();

  dispatch({
    type: "add_runner",
    payload: data
  });
};

// Updates an existing runner
export const editRunner = async (dispatch, payload ) => { 
  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/list_runners/" + payload.id,
    {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address
       })
    }
  );

  const data = await response.json();

  dispatch({
    type: "update_runner",
    payload: data
  });
};

// Deletes profile from backed and removes it from global state
export const deleteRunner = async (dispatch, id) => {
  await fetch(import.meta.env.VITE_BACKEND_URL + "/list_runners/" + id, {
    method: "DELETE"
  });

  dispatch({
    type: "delete_runner",
    payload: id
  });
};


