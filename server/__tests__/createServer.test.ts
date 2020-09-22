import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import createServer from "../createServer";

// Helpers
function mockMiddleware(_req: any, _res: any, next: any) {
  next();
}

// Mock necessary modules
jest.mock("webpack");
jest.mock("webpack-dev-middleware", () => jest.fn(() => mockMiddleware));
jest.mock("webpack-hot-middleware", () => jest.fn(() => mockMiddleware));
jest.mock("../../webpack.config.dev", () => jest.fn());
jest.mock("../routes", () => ({ clientRouter: jest.fn() }));

// Remove logs that could clutter the Jest output
jest.spyOn(console, "log").mockImplementation();

describe("Create Server", () => {
  afterEach(async () => {
    jest.clearAllMocks();
    process.env.NODE_ENV = "test"; // Jest's value for NODE_ENV
  });

  it("Uses webpack when inside 'development'", async () => {
    process.env.NODE_ENV = "development";
    await createServer();

    expect(webpack).toHaveBeenCalled();
    expect(webpackDevMiddleware).toHaveBeenCalled();
    expect(webpackHotMiddleware).toHaveBeenCalled();
  });

  it("Does not use webpack when outside 'development'", async () => {
    await createServer();

    expect(webpack).not.toHaveBeenCalled();
    expect(webpackDevMiddleware).not.toHaveBeenCalled();
    expect(webpackHotMiddleware).not.toHaveBeenCalled();
  });
});
