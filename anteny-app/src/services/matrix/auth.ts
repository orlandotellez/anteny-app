import { ENV } from "@/src/shared/constants/env";
import { ILoginPayload, IRegisterPayload } from "@/src/shared/types/auth";
import { MatrixSession } from "@/src/shared/types/matrixSession";

export const registerUser = async ({ username, password }: IRegisterPayload): Promise<MatrixSession> => {
  try {
    const res = await fetch(`${ENV.MATRIX_URL}/_matrix/client/v3/register`, {
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error al registrar usuario");
    }

    const session: MatrixSession = await res.json();

    return session;
  } catch (err) {
    console.error("registerUser error:", err);
    throw err;
  }
};

export const loginUser = async ({ username, password }: ILoginPayload): Promise<MatrixSession> => {
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error al iniciar sesión");
    }

    const session: MatrixSession = await res.json();

    return session;
  } catch (err) {
    console.error("loginUser error:", err);
    throw err;
  }
};
