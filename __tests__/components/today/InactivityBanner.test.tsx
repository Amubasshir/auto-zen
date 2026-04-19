import { render, screen } from "@testing-library/react";
import { InactivityBanner } from "@/components/today/InactivityBanner";

describe("InactivityBanner", () => {
  it("renders nothing when daysSinceActive < 3", () => {
    const { container } = render(<InactivityBanner daysSinceActive={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when daysSinceActive is 2", () => {
    const { container } = render(<InactivityBanner daysSinceActive={2} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows resume prompt at exactly 3 days", () => {
    render(<InactivityBanner daysSinceActive={3} />);
    expect(screen.getByText(/pick up where you left off/i)).toBeInTheDocument();
    expect(screen.getByText(/3 days/i)).toBeInTheDocument();
  });

  it("shows falling behind warning at 5 days", () => {
    render(<InactivityBanner daysSinceActive={5} />);
    expect(screen.getByText(/falling a little behind/i)).toBeInTheDocument();
    expect(screen.getByText(/5 days/i)).toBeInTheDocument();
  });

  it("shows restart suggestion at 7+ days", () => {
    render(<InactivityBanner daysSinceActive={7} />);
    expect(screen.getByText(/been a while/i)).toBeInTheDocument();
  });

  it("shows restart suggestion at 10 days", () => {
    render(<InactivityBanner daysSinceActive={10} />);
    expect(screen.getByText(/been a while/i)).toBeInTheDocument();
  });
});
