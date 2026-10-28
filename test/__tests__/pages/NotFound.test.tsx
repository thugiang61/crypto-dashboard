// test/__tests__/pages/NotFound.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router"; // NotFound dùng <Link> → cần Router
import NotFound from "@/pages/NotFound";

// Helper: NotFound dùng Link → phải bọc trong Router
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

  // it("có link 'Take me home' trỏ về '/'", () => {
  //   renderNotFound();
  //   const link = screen.getByRole("link", { name: /take me home/i });
  //   expect(link).toBeInTheDocument();
  //   expect(link).toHaveAttribute("href", "/");
  // });

  // it("hiện mô tả về gecko không tìm được trang", () => {
  //   renderNotFound();
  //   expect(screen.getByText(/gecko/i)).toBeInTheDocument();
  // });

  // // Test cases để bạn tự viết:
  // it("TODO: hiện ảnh not_found", () => {});
  // it("TODO: link 'Take me home' có style đúng (bg-green)", () => {});
});