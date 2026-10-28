import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Sparkline from "@/components/Sparkline";

describe("Sparkline", () => {
  it("render SVG with valid data", () => {
    const { container } = render(<Sparkline data={[100, 110, 105, 120]} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("polyline")).toBeInTheDocument();
  });

  it("return null when data is empty", () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("stroke is green (#22c55e) when new price > old price (uptrend)", () => {
    const { container } = render(<Sparkline data={[100, 110, 120]} />);
    const polyline = container.querySelector("polyline");
    expect(polyline).toHaveAttribute("stroke", "#22c55e");
  });

  it("stroke is red (#ef4444) when new price < old price (downtrend)", () => {
    const { container } = render(<Sparkline data={[120, 110, 100]} />);
    const polyline = container.querySelector("polyline");
    expect(polyline).toHaveAttribute("stroke", "#ef4444");
  });

  it("stroke is green (#22c55e) when new price = old price (flat)", () => {
    const { container } = render(<Sparkline data={[100, 100, 100]} />);
    expect(container.querySelector("polyline")).toHaveAttribute("stroke", "#22c55e");
  });

  it("SVG has correct default width and height (150x40)", () => {
    const { container } = render(<Sparkline data={[100, 110]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "150");
    expect(svg).toHaveAttribute("height", "40");
  });

  it("SVG has custom width and height", () => {
    const { container } = render(<Sparkline data={[100, 110]} width={200} height={60} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "60");
  });

});
