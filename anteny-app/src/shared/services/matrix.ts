import { ENV } from "../constants/env";

export const registerUser = async (username: string, password: string) => {
  try {
    const resMatrix = await fetch(`${ENV.MATRIX_URL}/_matrix/client/r0/register`, {
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
