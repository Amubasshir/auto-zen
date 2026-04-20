import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("renders 404 text", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders page not found heading", () => {
    render(<NotFound />);
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders a link back to dashboard", () => {
    render(<NotFound />);
    const link = screen.getByText("Back to Dashboard").closest("a");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("renders descriptive message", () => {
    render(<NotFound />);
    expect(screen.getByText(/This page doesn/i)).toBeInTheDocument();
  });
});
