import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SortField from "@/components/SortField";
import type { Filters } from "@/models/filters.model";
import type { Pagination } from "@/models/pagination.model";

const defaultFilters: Filters = { sortOption: "#_desc", category: "" };
const defaultPagination: Pagination = { currentPage: 3, numOfRows: 100 };

function renderSortField(
  field = "#",
  name = "#",
  sortOption = "#_desc",
  setFilters = vi.fn(),
  setPagination = vi.fn()
) {
  return render(
    <SortField
      field={field}
      name={name}
      sortOption={sortOption}
      setFilters={setFilters}
      setPagination={setPagination}
    />
  );
}

describe("SortField", () => {
  it("show name correctly", () => {
    renderSortField("#", "#");
    expect(screen.getByText("#")).toBeInTheDocument();
  });

  it("click on component => setFilters is called with new sortOption value", () => {
    const setFiltersMock = vi.fn();
    renderSortField("#", "#", "#_desc", setFiltersMock);

    fireEvent.click(screen.getByRole("button"));

    expect(setFiltersMock).toHaveBeenCalledTimes(1);
  });

  it("click on component => setPagination is called to reset to page 1", () => {
    const setPaginationMock = vi.fn();
    renderSortField("#", "#", "#_desc", vi.fn(), setPaginationMock);

    fireEvent.click(screen.getByRole("button"));

    expect(setPaginationMock).toHaveBeenCalledTimes(1);
    const updateFn = setPaginationMock.mock.calls[0][0];
    const result = updateFn(defaultPagination);
    expect(result.currentPage).toBe(1);
  });

  it("click on component when it's sorted at the momemtn => toggle from asc to desc", () => {
    const setFiltersMock = vi.fn();
    renderSortField("#", "#", "#_asc", setFiltersMock);

    fireEvent.click(screen.getByRole("button"));

    const updateFn = setFiltersMock.mock.calls[0][0];
    const result = updateFn({ sortOption: "#_asc", category: "" });
    expect(result.sortOption).toBe("#_desc");
  });

  it("click on component when other field is sorted at the moment => new field is sorted with asc order by default", () => {
    const setFiltersMock = vi.fn();
    renderSortField("volume", "total volume", "#_desc", setFiltersMock);

    fireEvent.click(screen.getByRole("button"));

    const updateFn = setFiltersMock.mock.calls[0][0];
    const result = updateFn(defaultFilters);
    expect(result.sortOption).toBe("volume_asc");
  });
});
