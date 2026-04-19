import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockSignIn = jest.fn();
const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next-auth/react", () => ({ signIn: mockSignIn }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));
jest.mock("next/link", () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

// Lazy import so mocks are applied first
async function renderLogin() {
  const { default: LoginPage } = await import(
    "@/app/(auth)/login/page"
  );
  return render(<LoginPage />);
}

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockResolvedValue({ error: null });
  });

  it("renders email and password fields", async () => {
    await renderLogin();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
  });

  it("renders the Sign in submit button", async () => {
    await renderLogin();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders Continue with GitHub button", async () => {
    await renderLogin();
    expect(screen.getByText(/continue with github/i)).toBeInTheDocument();
  });

  it("renders link to signup page", async () => {
    await renderLogin();
    const link = screen.getByText(/create an account/i).closest("a");
    expect(link).toHaveAttribute("href", "/signup");
  });

  it("calls signIn with credentials on form submit", async () => {
    await renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }).closest("form")!);
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });
  });

  it("shows error message when signIn returns error", async () => {
    mockSignIn.mockResolvedValue({ error: "CredentialsSignin" });
    await renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), {
      target: { value: "bad@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "wrongpass" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it("redirects to /dashboard on successful login", async () => {
    await renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }).closest("form")!);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
  });
});
