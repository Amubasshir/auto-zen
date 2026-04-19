import { render, screen } from "@testing-library/react";
import { Ring } from "@/components/ui/ring";

describe("Ring", () => {
  it("renders an SVG with two circles", () => {
    const { container } = render(<Ring pct={50} />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
  });

  it("renders label text when provided", () => {
    render(<Ring pct={75} label="75" sublabel="complete" />);
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("complete")).toBeInTheDocument();
  });

  it("renders no label when omitted", () => {
    const { container } = render(<Ring pct={30} />);
    expect(container.querySelectorAll("span")).toHaveLength(0);
  });

  it("clamps stroke offset to show full circle at 0%", () => {
    const { container } = render(<Ring pct={0} size={100} strokeWidth={5} />);
    const progressCircle = container.querySelectorAll("circle")[1];
    const dashOffset = progressCircle?.getAttribute("stroke-dashoffset");
    const circumference = 2 * Math.PI * ((100 - 5 * 2) / 2);
    expect(Number(dashOffset)).toBeCloseTo(circumference, 0);
  });

  it("applies custom size via width/height on SVG", () => {
    const { container } = render(<Ring pct={50} size={80} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "80");
    expect(svg).toHaveAttribute("height", "80");
  });
});
