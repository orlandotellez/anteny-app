import { ENV } from "../constants/env";

export const registerUser = async (username: string, password: string) => {
  try {
    const resMatrix = await fetch(`${ENV.MATRIX_URL}/_matrix/client/v3/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        auth: {
          type: "m.login.dummy",
        },
      }),
    });

    const dataMatrix = await resMatrix.json();

    console.log("Cliente registrado en matrix: ", dataMatrix);
  } catch (err) {
    console.error("registerUser error:", err);
    throw err;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const res = await fetch(`${ENV.MATRIX_URL}/_matrix/client/v3/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "m.login.password",
        identifier: {
          type: "m.id.user",
          user: username,
        },
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    console.log("Login exitoso:", data);

    return data;
  } catch (err) {
    console.error("loginUser error:", err);
    throw err;
  }
};
