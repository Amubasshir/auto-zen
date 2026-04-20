import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("next/link", () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

import DashboardError from "@/app/dashboard/error";
import RootError from "@/app/error";

const mockReset = jest.fn();
const baseError = new Error("Test error") as Error & { digest?: string };

describe("DashboardError", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders error heading", () => {
    render(<DashboardError error={baseError} reset={mockReset} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders descriptive message", () => {
    render(<DashboardError error={baseError} reset={mockReset} />);
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  it("calls reset when Try again is clicked", () => {
    render(<DashboardError error={baseError} reset={mockReset} />);
    fireEvent.click(screen.getByText("Try again"));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("shows digest ref when present", () => {
    const errWithDigest = Object.assign(new Error("oops"), { digest: "abc123" });
    render(<DashboardError error={errWithDigest} reset={mockReset} />);
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });

  it("does not show digest when absent", () => {
    render(<DashboardError error={baseError} reset={mockReset} />);
    expect(screen.queryByText(/ref:/)).not.toBeInTheDocument();
  });
});

describe("RootError", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders error heading", () => {
    render(<RootError error={baseError} reset={mockReset} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls reset when Try again is clicked", () => {
    render(<RootError error={baseError} reset={mockReset} />);
    fireEvent.click(screen.getByText("Try again"));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("renders link back to dashboard", () => {
    render(<RootError error={baseError} reset={mockReset} />);
    const link = screen.getByText("Go to Dashboard").closest("a");
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
