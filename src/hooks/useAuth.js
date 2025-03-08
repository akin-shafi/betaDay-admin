// import { useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

// hooks/useAuth.ts
export async function verifyEmail(token) {
  const response = await fetch(`${API_URL}/users/verify-email?token=${token}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to verify email");
  }

  return response.json();
}

export const loginUser = async (email, password) => {
  try {
    console.log("Base Url", API_BASE_URL);
    const response = await fetch(`${API_URL}/users/login`, {
      // Adjust the URL as necessary
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle the error and propagate it
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export async function sendTwoFactorCode(email, loginType) {
  try {
    const response = await fetch(`${API_URL}/users/send-two-factor-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, loginType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send two-factor code");
    }
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while sending the two-factor code"
    );
  }
}

// hooks/useAuth.ts
export const verifyTwoFactor = async (email, twoFactorCode) => {
  const response = await fetch(`${API_URL}/users/verify-two-factor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, twoFactorCode }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to login with code");
  }

  const data = await response.json();
  return data;
};

// hooks/Register

export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}/users/register`, {
    // Adjust the URL as necessary
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  const result = await response.json();
  return result;
};

// hooks/reset password

export const sendResetPasswordEmail = async (email) => {
  const response = await fetch(`${API_URL}/users/forget-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to send reset password email");
  }

  const result = await response.json();
  return result;
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${API_URL}/users/reset-password`, {
    // Adjust URL as necessary
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  const result = await response.json();
  return result;
};
