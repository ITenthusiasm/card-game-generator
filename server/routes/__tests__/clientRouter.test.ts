import axios, { AxiosInstance } from "axios";
import createServer from "../../createServer";
import { extractAxiosData, handleAxiosError } from "../../../test-utils/helpers/axiosInterceptors";

process.env.PORT = (8000 + Number(process.env.JEST_WORKER_ID)) as any;

// Remove logs that could clutter the Jest output
jest.spyOn(console, "log").mockImplementation();

describe("Client Router", () => {
  let server: any;
  let axiosInstance: AxiosInstance;

  beforeAll(async () => {
    // Start the server
    server = await createServer();
    server.listen(process.env.PORT);
    const { port } = server.address() as any;
    const baseURL = `http://localhost:${port}`;

    // Configure axios
    axiosInstance = axios.create({ baseURL });
    axiosInstance.interceptors.response.use(extractAxiosData, handleAxiosError);
  });

  afterAll(async () => server.close());

  test("Requests to the server for webpages return the Vue application", async () => {
    // Note that the script referencing the Vue app is injected by webpack
    const html = await axiosInstance.get("/");

    // Expect to find the served html with app placeholder div
    expect(html).toMatch(/<div id="app"><\/div>/);
  });

  test("Requests for the favicon return an image instead of an html file", async () => {
    const favicon = await axiosInstance.get("/favicon.ico");

    expect(favicon).not.toBeNull();
    expect(favicon).not.toMatch(/html/);
  });
});
