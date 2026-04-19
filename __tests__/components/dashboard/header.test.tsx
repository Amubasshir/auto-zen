import { render, screen, fireEvent } from "@testing-library/react";

const mockUseSession = jest.fn();
const mockSignOut = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));
jest.mock("next/link", () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

import { Header } from "@/components/dashboard/header";

describe("Header", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
  });

  it("renders AutoZen breadcrumb", () => {
    render(<Header />);
    expect(screen.getByText("AutoZen")).toBeInTheDocument();
  });

  it("renders global progress percentage from mockUser (28%)", () => {
    render(<Header />);
    expect(screen.getByText("28%")).toBeInTheDocument();
  });

  it("renders streak chip (12d from mockUser)", () => {
    render(<Header />);
    expect(screen.getByText("12d")).toBeInTheDocument();
  });

  it("renders Resume button", () => {
    render(<Header />);
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("renders user initial avatar — falls back to mockUser 'A'", () => {
    render(<Header />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("does not show sign-out button when unauthenticated", () => {
    render(<Header />);
    expect(screen.queryByLabelText(/sign out/i)).not.toBeInTheDocument();
  });

  it("shows sign-out button and real user initial when authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Zara", email: "zara@example.com", id: "u1" } },
      status: "authenticated",
    });
    render(<Header />);
    expect(screen.getByLabelText(/sign out/i)).toBeInTheDocument();
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  it("calls signOut with callbackUrl when sign-out is clicked", () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Zara", email: "zara@example.com", id: "u1" } },
      status: "authenticated",
    });
    render(<Header />);
    fireEvent.click(screen.getByLabelText(/sign out/i));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
