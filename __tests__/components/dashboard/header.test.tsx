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

const DEFAULT_PROPS = { streakCount: 12, overallProgress: 28 };

describe("Header", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
  });

  it("renders AutoZen breadcrumb", () => {
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.getByText("AutoZen")).toBeInTheDocument();
  });

  it("renders global progress percentage from prop", () => {
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.getByText("28%")).toBeInTheDocument();
  });

  it("renders a different progress percentage when prop changes", () => {
    render(<Header streakCount={0} overallProgress={55} />);
    expect(screen.getByText("55%")).toBeInTheDocument();
  });

  it("renders streak chip with streakCount prop", () => {
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.getByText("12d")).toBeInTheDocument();
  });

  it("renders streak count of 0", () => {
    render(<Header streakCount={0} overallProgress={0} />);
    expect(screen.getByText("0d")).toBeInTheDocument();
  });

  it("renders Resume button", () => {
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("renders user initial avatar — falls back to 'A' when unauthenticated", () => {
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("does not show sign-out button when unauthenticated", () => {
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.queryByLabelText(/sign out/i)).not.toBeInTheDocument();
  });

  it("shows sign-out button and real user initial when authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Zara", email: "zara@example.com", id: "u1" } },
      status: "authenticated",
    });
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.getByLabelText(/sign out/i)).toBeInTheDocument();
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  it("calls signOut with callbackUrl when sign-out is clicked", () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Zara", email: "zara@example.com", id: "u1" } },
      status: "authenticated",
    });
    render(<Header {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByLabelText(/sign out/i));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("renders mobile hamburger button when onMobileMenuToggle is provided", () => {
    const handler = jest.fn();
    render(<Header {...DEFAULT_PROPS} onMobileMenuToggle={handler} />);
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("calls onMobileMenuToggle when hamburger is clicked", () => {
    const handler = jest.fn();
    render(<Header {...DEFAULT_PROPS} onMobileMenuToggle={handler} />);
    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not render mobile hamburger button when onMobileMenuToggle is absent", () => {
    render(<Header {...DEFAULT_PROPS} />);
    expect(screen.queryByLabelText("Open menu")).not.toBeInTheDocument();
  });
});
