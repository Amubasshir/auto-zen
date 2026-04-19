import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockSignIn = jest.fn();
const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockFetch = jest.fn();

jest.mock("next-auth/react", () => ({ signIn: mockSignIn }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));
jest.mock("next/link", () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

global.fetch = mockFetch;

async function renderSignup() {
  const { default: SignupPage } = await import("@/app/(auth)/signup/page");
  return render(<SignupPage />);
}

describe("Signup page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    mockSignIn.mockResolvedValue({ error: null });
  });

  it("renders Name, Email, Password and Confirm fields", async () => {
    await renderSignup();
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min\. 8 characters/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/repeat password/i)).toBeInTheDocument();
  });

  it("renders Create account button", async () => {
    await renderSignup();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    await renderSignup();
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: "Ada" } });
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: "ada@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/min\. 8 characters/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: "different123" } });
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("shows error when password is less than 8 characters", async () => {
    await renderSignup();
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: "Ada" } });
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: "ada@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/min\. 8 characters/i), { target: { value: "short" } });
    fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: "short" } });
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("calls /api/auth/signup then signIn on valid submit", async () => {
    await renderSignup();
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: "Ada" } });
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: "ada@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/min\. 8 characters/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: "password123" } });
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/signup", expect.objectContaining({ method: "POST" }));
      expect(mockSignIn).toHaveBeenCalledWith("credentials", expect.objectContaining({ email: "ada@test.com" }));
    });
  });

  it("shows API error message when signup fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "An account with this email already exists." }),
    });
    await renderSignup();
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: "Ada" } });
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: "ada@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/min\. 8 characters/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: "password123" } });
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument();
    });
  });

  it("renders link to login page", async () => {
    await renderSignup();
    const link = screen.getByText(/sign in/i).closest("a");
    expect(link).toHaveAttribute("href", "/login");
  });
});
