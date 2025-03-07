const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

// ================== Users =========================== //
export const fetchUsers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    console.log();
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const createUser = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateUser = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteUser = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete user");
};

export const fetchRoles = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/roles`, {
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

// ================== Institutions=========================== //
export const fetchInstitution = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/institutions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const result = await response.json();
    const data = result.institutions;
    // console.log("fetch All Institution data", data);
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchInstitutionNames = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/institutions/names`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    // const data = result.institutions;
    // console.log("fetchInstitution Name", data);
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchInstitutionById = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch institution data.");
    }

    const data = await response.json();

    // Return the institution object directly
    return data.institution;
  } catch (error) {
    throw new Error(error.message || "Error fetching institution data.");
  }
};

export const fetchInstitutionsByIds = async (ids, token) => {
  try {
    // Validate that ids is a non-empty array
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Invalid input: 'ids' must be a non-empty array.");
    }

    const response = await fetch(`${API_BASE_URL}/institutions/findByIds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }), // Send ids as the request body
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch institutions.");
    }

    // Parse and validate the response
    const result = await response.json();
    const institutions = result?.institutions;

    // console.log("Fetched institutions:", institutions);

    // Ensure institutions is always an array
    return Array.isArray(institutions) ? institutions : [];
  } catch (error) {
    console.error("Error fetching institutions:", error);
    throw new Error(error.message || "Error fetching institutions.");
  }
};

export const createInstitution = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/institutions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateInstitution = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteInstitution = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete institution");
};

// ================== Equipments =========================== //

export const fetchEquipment = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipment`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const result = await response.json();
    const data = result.equipments;
    // console.log("Equipment", data);
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchEquipmentsByInstituteId = async (institutionId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/equipment/institution/${institutionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const result = await response.json();
    const data = result.equipments;
    console.log();
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const sendBulkEquipment = async (data, token, setStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipment/bulk-upload`, {
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

// ==================== Assets ====================//

// DELETE an asset by ID
export const deleteAssetById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete asset");
};

// POST a new asset
export const createAsset = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// PUT update an asset by ID
export const updateAsset = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// GET all assets
export const fetchAssets = async (token) => {
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const fetchAssetsByinstitutionId = async (institutionId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/assets/by-institution/${institutionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    // const data = result.institutions;
    // console.log("fetchInstitution data by Id", data);
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

// ================= Contact Person ======================//

// DELETE a contact by ID
export const deleteContactById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/contact-person/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete contact");
};

// POST a new contact
export const createContact = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/contact-person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create contact");
  return response.json();
};

// PUT update a contact by ID
export const updateContact = async (id, data, token) => {
  if (!id || !data || !token) {
    console.error("Invalid arguments:", { id, data, token });
    throw new Error("Missing required arguments for updateContact");
  }

  const response = await fetch(`${API_BASE_URL}/contact-person/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error("Failed to update contact. Response:", await response.text());
    throw new Error("Failed to update contact");
  }

  return response.json();
};

// GET all contacts
export const fetchContacts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/contact-person`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch contacts");
  return response.json();
};

export const fetchContactsByInstitutionId = async (institutionId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contact-person/institution/${institutionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch contacts.");
    }

    const data = await response.json();
    // console.log("fetchContactsByInstitutionId data", data);

    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching contacts.");
  }
};
