// Session durations
const SESSION_DURATIONS = {
  DEFAULT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  EXTENDED: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Get session from storage
export const getSession = () => {
  try {
    const sessionData = localStorage.getItem("session");
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);

    // Check if session has expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      console.log("Session expired");
      clearSession();
      return null;
    }

    // Update last activity timestamp
    updateLastActivity();

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    clearSession();
    return null;
  }
};

// Set session in storage with expiration
export const setSession = (session, rememberMe = false) => {
  try {
    // Calculate expiration time based on remember me preference
    const expirationDuration = rememberMe
      ? SESSION_DURATIONS.EXTENDED
      : SESSION_DURATIONS.DEFAULT;

    const expiresAt = new Date(Date.now() + expirationDuration).toISOString();

    // Add expiration and last activity to session
    const sessionWithExpiry = {
      ...session,
      expiresAt,
      lastActivity: new Date().toISOString(),
      rememberMe,
    };

    localStorage.setItem("session", JSON.stringify(sessionWithExpiry));
    return sessionWithExpiry;
  } catch (error) {
    console.error("Error setting session:", error);
    return session;
  }
};

// Update last activity timestamp
export const updateLastActivity = () => {
  try {
    const sessionData = localStorage.getItem("session");
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    session.lastActivity = new Date().toISOString();

    localStorage.setItem("session", JSON.stringify(session));
  } catch (error) {
    console.error("Error updating last activity:", error);
  }
};

// Check if session is inactive for too long
export const checkInactivity = (maxInactiveTime = 30 * 60 * 1000) => {
  // 30 minutes default
  try {
    const sessionData = localStorage.getItem("session");
    if (!sessionData) return true;

    const session = JSON.parse(sessionData);

    // Skip inactivity check for remembered sessions
    if (session.rememberMe) return false;

    if (!session.lastActivity) return true;

    const lastActivity = new Date(session.lastActivity).getTime();
    const currentTime = new Date().getTime();

    return currentTime - lastActivity > maxInactiveTime;
  } catch (error) {
    console.error("Error checking inactivity:", error);
    return true;
  }
};

// Clear session from storage
export const clearSession = () => {
  localStorage.removeItem("session");
};
