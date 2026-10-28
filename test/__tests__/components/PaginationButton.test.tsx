import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationButton from "@/components/PaginationButton";
import type { Pagination } from "@/models/pagination.model";

const defaultPagination: Pagination = { currentPage: 3, numOfRows: 100 };

function renderBtn(
  value: Parameters<typeof PaginationButton>[0]["value"],
  isDisabled = false,
  isActive = false,
  setPagination = vi.fn()
) {
  return render(
    <PaginationButton
      value={value}
      isDisabled={isDisabled}
      isActive={isActive}
      setPagination={setPagination}
    />
  );
}

describe("PaginationButton", () => {
  it("show value correctly", () => {
    renderBtn(5);
    expect(screen.getByRole("button")).toHaveTextContent("5");
  });

  it("button is disabled when isDisabled=true", () => {
    const setPaginationMock = vi.fn();

    renderBtn("◄", true, false, setPaginationMock);
    expect(screen.getByRole("button")).toBeDisabled();

    fireEvent.click(screen.getByRole("button"));

    expect(setPaginationMock).not.toHaveBeenCalled();
  });

  it("button is enabled when isDisabled=false", () => {
    renderBtn("►", false);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("click ► button and currentPage increases by 1", () => {
    const setPaginationMock = vi.fn();
    renderBtn("►", false, false, setPaginationMock);

    fireEvent.click(screen.getByRole("button"));

    const updateFn = setPaginationMock.mock.calls[0][0];
    const result = updateFn(defaultPagination);
    expect(result.currentPage).toBe(4);
  });

  it("click ◄ button and currentPage decreases by 1", () => {
    const setPaginationMock = vi.fn();
    renderBtn("◄", false, false, setPaginationMock);

    fireEvent.click(screen.getByRole("button"));

    const updateFn = setPaginationMock.mock.calls[0][0];
    const result = updateFn(defaultPagination);
    expect(result.currentPage).toBe(2);
  });

  it("click ◄ button when currentPage is 1 => currentPage is still 1", () => {
    const setPaginationMock = vi.fn();
    renderBtn("◄", false, false, setPaginationMock);

    fireEvent.click(screen.getByRole("button"));

    const updateFn = setPaginationMock.mock.calls[0][0];
    const result = updateFn({ currentPage: 1, numOfRows: 100 });
    expect(result.currentPage).toBe(1);
  });







});
