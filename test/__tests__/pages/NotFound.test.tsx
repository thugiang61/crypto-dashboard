import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NotFound from "@/pages/NotFound";

function renderNotFound() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
}

describe("NotFound", () => {
  it("show content correctly", () => {
    renderNotFound();

    expect(screen.getByText(/gecko/i)).toBeInTheDocument();
    expect(screen.getByText("Page not found.")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /take me home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
