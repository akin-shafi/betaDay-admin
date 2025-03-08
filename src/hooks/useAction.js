const API_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

// ================== Users =========================== //
export const fetchUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users.");
    }

    const data = await response.json();
    console.log("Fetched data:", data); // Log the response for debugging

    // Ensure the users property is an array, default to empty array if missing
    return {
      statusCode: data.statusCode || 200,
      users: Array.isArray(data.users) ? data.users : [],
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching users.");
  }
};

export const createUser = async (data, token) => {
  const response = await fetch(`${API_URL}/auth/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// export const updateUser = async (id, data, token) => {
//   const response = await fetch(`${API_URL}/auth/users/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// };

export const updateUser = async (id, data, token) => {
  const response = await fetch(`${API_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }
  return response.json();
};

export const deleteUser = async (userId, token) => {
  const response = await fetch(`${API_URL}/auth/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete user");
  }
  return response.json();
};

export const fetchRoles = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/users/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const result = await response.json();
    const data = result.roles;
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const sendBulkEquipment = async (data, token, setStatus) => {
  try {
    const response = await fetch(`${API_URL}/equipment/bulk-upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data, // Send FormData
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return {
        statusCode: response.status,
        message: errorResponse.message || "Unknown error occurred",
      };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    const result = {
      messages: [],
      skippedRows: [],
      totalSaved: 0,
      totalSkipped: 0,
    };

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });

      if (chunk) {
        const parts = chunk.split("\n");

        for (let part of parts) {
          if (part.trim()) {
            try {
              const data = JSON.parse(part);

              // Collect skippedRows if present
              if (data.skippedRows && Array.isArray(data.skippedRows)) {
                result.skippedRows.push(...data.skippedRows);
              }

              // Collect messages for status updates
              if (data.message) {
                result.messages.push(data.message);
              }

              // Track totalSaved and totalSkipped
              if (data.totalSaved !== undefined) {
                result.totalSaved = data.totalSaved;
              }
              if (data.totalSkipped !== undefined) {
                result.totalSkipped = data.totalSkipped;
              }

              // Send updates to the frontend
              if (setStatus) {
                setStatus(data); // Notify the frontend of this chunk's status
              }
            } catch (error) {
              console.error("Error parsing chunk:", part, error);
            }
          }
        }
      }
    }

    console.log("All result", result);
    return {
      statusCode: 200,
      message: result.messages.join(", "),
      totalSaved: result.totalSaved,
      totalSkipped: result.totalSkipped,
      skippedRows: result.skippedRows, // Final aggregated skippedRows
    };
  } catch (error) {
    console.error("Error uploading bulk data", error);
    throw new Error(error.message || "Error during bulk upload");
  }
};
