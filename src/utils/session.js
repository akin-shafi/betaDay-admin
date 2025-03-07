// utils/session.js
export const getSession = () => {
  const session = localStorage.getItem("session");
  return session ? JSON.parse(session) : null;
};

export const setSession = (session) => {
  localStorage.setItem("session", JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem("session");
};
