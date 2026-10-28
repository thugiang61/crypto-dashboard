// test/__tests__/components/PaginationBar.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationBar from "@/components/PaginationBar";
import type { Pagination } from "@/models/pagination.model";

const pagination: Pagination = { currentPage: 2, numOfRows: 100 };

function renderPaginationBar(
  pag = pagination,
  dataLength = 100,
  setPagination = vi.fn()
) {
  return render(
    <PaginationBar
      pagination={pag}
      dataLength={dataLength}
      setPagination={setPagination}
    />
  );
}

describe("PaginationBar", () => {
  it("show content of 'Showing X to Y' correctly", () => {
    // page 2, numOfRows 100, dataLength 100 => from=101, to=200
    renderPaginationBar();
    expect(screen.getByText(/Showing 101 to 200/)).toBeInTheDocument();
  });

  it("Showing 0 to 0 when dataLength = 0", () => {
    renderPaginationBar(pagination, 0);
    expect(screen.getByText(/Showing 0 to 0/)).toBeInTheDocument();
  });

  it("◄ button is disabled at page 1", () => {
    renderPaginationBar({ currentPage: 1, numOfRows: 100 });
    const prevBtn = screen.getAllByRole("button")[0]; // nút đầu tiên là ◄
    expect(prevBtn).toBeDisabled();
  });

  it("► button is disabled when dataLength = 0", () => {
    renderPaginationBar(pagination, 0);
    const nextBtn = screen.getAllByRole("button")[1];
    expect(nextBtn).toBeDisabled();
  });

  it("select Rows with option 50, 100, 250", () => {
    renderPaginationBar();
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "100" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "250" })).toBeInTheDocument();
  });

  it("update select Rows and setPagination is called with currentPage=1 and new numOfRows", () => {
    const setPaginationMock = vi.fn();
    renderPaginationBar(pagination, 100, setPaginationMock);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } });

    expect(setPaginationMock).toHaveBeenCalledWith({ currentPage: 1, numOfRows: 50 });
  });

  // TODO: it("nút ◄ enabled khi currentPage > 1", () => {});
  // TODO: it("nút ► enabled khi dataLength > 0", () => {});
});