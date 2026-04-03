import { ENV } from "../../shared/constants/env";
import { MatrixSession } from "../../shared/types/matrix";

export const registerUser = async (username: string, password: string): Promise<MatrixSession> => {
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

    const session = await resMatrix.json();

    return session;
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

    const session = await res.json();

    if (!res.ok) {
      throw new Error(session.error || "Error al iniciar sesión");
    }

    return session;
  } catch (err) {
    console.error("loginUser error:", err);
    throw err;
  }
};
