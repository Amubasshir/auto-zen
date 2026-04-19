import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/dashboard/sidebar";

// Mock Next.js router hooks
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe("Sidebar", () => {
  const onToggle = jest.fn();

  beforeEach(() => onToggle.mockClear());

  it("renders the AutoZen brandmark SVG", () => {
    const { container } = render(
      <Sidebar expanded={false} onToggle={onToggle} />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("shows Dashboard, Today and Portfolio nav links", () => {
    render(<Sidebar expanded={true} onToggle={onToggle} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("calls onToggle when toggle button is clicked", () => {
    render(<Sidebar expanded={false} onToggle={onToggle} />);
    const toggleBtn = screen.getByLabelText(/expand sidebar/i);
    fireEvent.click(toggleBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows 'AutoZen' brandword when expanded", () => {
    render(<Sidebar expanded={true} onToggle={onToggle} />);
    expect(screen.getByText("AutoZen")).toBeInTheDocument();
  });

  it("shows path filter block when expanded", () => {
    render(<Sidebar expanded={true} onToggle={onToggle} />);
    expect(screen.getByText("Learning Path")).toBeInTheDocument();
    expect(screen.getByText("No-Code")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("shows activity grid when expanded", () => {
    render(<Sidebar expanded={true} onToggle={onToggle} />);
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("links Dashboard nav item to /dashboard", () => {
    render(<Sidebar expanded={true} onToggle={onToggle} />);
    const dashLink = screen.getByText("Dashboard").closest("a");
    expect(dashLink).toHaveAttribute("href", "/dashboard");
  });
});
