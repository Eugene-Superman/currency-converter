import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_PREFIX } from "../../apiConfig";
import { server } from "../../test/server";
import Converter from "./Converter";

const fromInput = () => screen.getByRole("textbox", { name: "From amount:" });
const toInput = () => screen.getByRole("textbox", { name: "To amount:" });
const toSelect = () => screen.getByRole("combobox", { name: "To currency:" });

const convertUrl = `${API_PREFIX}/convert`;
const failWith = (status: number) => () => new HttpResponse(null, { status });

function renderConverter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Converter />
    </QueryClientProvider>,
  );

  return userEvent.setup();
}

// 1 PLN = 0.25 USD
async function renderLoaded() {
  const user = renderConverter();
  await screen.findByDisplayValue("0.25");
  return user;
}

describe("Converter", () => {
  it("loads the currencies and converts the default amount", async () => {
    renderConverter();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("0.25")).toBe(toInput());
    expect(screen.getByRole("status")).toHaveTextContent("1 PLN = 0.25 USD");
  });

  it("converts what the user types with a single request", async () => {
    const user = await renderLoaded();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await user.clear(fromInput());
    await user.type(fromInput(), "250");

    expect(await screen.findByDisplayValue("62.50")).toBe(toInput());
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it("ignores characters that can't be part of a number", async () => {
    const user = await renderLoaded();

    await user.type(fromInput(), "a-");

    expect(fromInput()).toHaveValue("1");
  });

  it("converts back when the user types in the 'To' field", async () => {
    const user = await renderLoaded();

    await user.clear(toInput());
    await user.type(toInput(), "5");

    expect(await screen.findByDisplayValue("20.00")).toBe(fromInput());
  });

  it("converts again when a currency changes", async () => {
    const user = await renderLoaded();

    await user.selectOptions(toSelect(), "JPY");

    expect(await screen.findByDisplayValue("38")).toBe(toInput());
  });

  it("doesn't call the API for the same currency", async () => {
    const user = await renderLoaded();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await user.selectOptions(toSelect(), "PLN");

    expect(toInput()).toHaveValue("1.00");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows 'Converting...' while waiting for the API", async () => {
    server.use(http.get(convertUrl, () => delay("infinite")));
    renderConverter();

    expect(await screen.findByPlaceholderText("Converting...")).toBe(toInput());
    expect(screen.getByRole("status")).toHaveTextContent("Converting...");
  });

  it("lets the user retry after a server error", async () => {
    server.use(http.get(convertUrl, failWith(500), { once: true }));
    const user = renderConverter();

    await user.click(await screen.findByRole("button", { name: "Try again" }));

    expect(await screen.findByDisplayValue("0.25")).toBe(toInput());
  });

  it("doesn't offer a retry when the API rejects the request", async () => {
    server.use(http.get(convertUrl, failWith(401)));
    renderConverter();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Currency rates are unavailable",
    );
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("lets the user retry when the currencies can't be loaded", async () => {
    server.use(
      http.get(`${API_PREFIX}/currencies`, () => HttpResponse.error(), {
        once: true,
      }),
    );
    const user = renderConverter();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't reach the currency service",
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByDisplayValue("0.25")).toBe(toInput());
  });
});
