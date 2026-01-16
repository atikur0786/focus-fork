import { Opik } from "opik";

export const opik = new Opik({
    apiKey: process.env.OPIK_API_KEY,
    apiUrl: "https://www.comet.com/opik/api",
    projectName: process.env.OPIK_PROJECT,
    workspaceName: process.env.OPIK_WORKSPACE,
});
