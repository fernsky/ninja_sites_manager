import axios from "axios";

export async function getODKToken(
  siteUrl: string,
  username: string,
  password: string,
) {
  try {
    const response = await axios.post(`${siteUrl}/v1/sessions`, {
      email: username,
      password: password,
    });
    return response.data.token;
  } catch (error) {
    console.error("Error fetching ODK token:", error);
    throw new Error("Failed to fetch ODK token");
  }
}
