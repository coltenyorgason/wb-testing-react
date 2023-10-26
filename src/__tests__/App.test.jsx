import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "../App.jsx";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const server = setupServer(
  rest.get("/api/movies", (req, res, ctx) => {
    return res(ctx.json([{ movieId: 1, title: "Test Movie" }]));
  }),
  rest.get("/api/ratings", (req, res, ctx) => {
    return res(
      ctx.json([
        { ratingId: 1, score: 2, movieId: 1, movie: { title: "batman" } },
      ])
    );
  }),
  rest.get("/api/movies/:movieId", (req, res, ctx) => {
    return res(
      ctx.json([
        { movieId: 1, title: "test", overview: "batman", posterPath: "img" },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders homepage at /", async () => {
  render(<App />);
  expect(
    screen.getByRole("heading", {
      name: /movie ratings app/i,
    })
  ).toBeInTheDocument();
});

describe("page navigation", () => {
  test("can navigate to all movies page", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("link", {
        name: /All Movies/i,
      })
    );
    expect(
      screen.getByRole("heading", {
        name: /All Movies/i,
      })
    ).toBeInTheDocument();
  });

  test("can navigate to the login page", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("link", {
        name: /log in/i,
      })
    );
    expect(
      screen.getByRole("heading", {
        name: /log in/i,
      })
    ).toBeInTheDocument();
  });

  test("can navigate to the user ratings page", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("link", {
        name: /Your Ratings/i,
      })
    );
    expect(
      screen.getByRole("heading", {
        name: /Your Ratings/i,
      })
    ).toBeInTheDocument();
  });

  test("can navigate to a movie detail page", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("link", {
        name: /All Movies/i,
      })
    );
    await user.click(
      screen.getByRole("link", {
        name: /test/i,
      })
    );
    expect(
      screen.getByRole("heading", {
        name: /test/i,
      })
    ).toBeInTheDocument();
  });
});

test.todo("logging in redirects to user ratings page", async () => {});

test.todo("creating a rating redirects to user ratings page", async () => {});
