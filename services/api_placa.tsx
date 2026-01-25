export const api_consultarPlaca = async (placa: string) => {
  try {
    const response = await fetch("https://webservices.ec/api/placas/" + placa, {
      method: "GET",
      headers: {
        Authorization: "Bearer aqui",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }

  // try {
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       Authorization:
  //         "Bearer aqui",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ placa: placa }),
  //   };

  //   const response = await fetch("https://api.json.pe/api/placa", options);

  //   if (!response.ok) {
  //     return null;
  //   }

  //   const data = await response.json();

  //   return data;
  // } catch (error) {
  //   console.error("Error al consultar la placa:", error);
  //   return null;
  // }
};

export const api_consultarCedula = async (tipo: string, cedula: string) => {
  try {
    const response = await fetch(
      "https://webservices.ec/api/" + tipo + "/" + cedula,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer aqui",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
