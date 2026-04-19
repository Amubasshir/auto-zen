import { render, screen, fireEvent } from "@testing-library/react";
import { NotesPanel } from "@/components/overlays/NotesPanel";

describe("NotesPanel", () => {
  it("renders the Notes heading", () => {
    render(<NotesPanel weekId="week-1" />);
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("renders an empty textarea by default", () => {
    render(<NotesPanel weekId="week-1" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("");
  });

  it("renders with initial content when provided", () => {
    render(<NotesPanel weekId="week-1" initialContent="My notes here" />);
    expect(screen.getByRole("textbox")).toHaveValue("My notes here");
  });

  it("updates value as user types", () => {
    render(<NotesPanel weekId="week-1" />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "New note content" } });
    expect(textarea).toHaveValue("New note content");
  });

  it("shows 'Saving…' status after typing", () => {
    render(<NotesPanel weekId="week-1" />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "typed" },
    });
    expect(screen.getByText("Saving…")).toBeInTheDocument();
  });

  it("shows 'Auto-save on' when content is empty and unchanged", () => {
    render(<NotesPanel weekId="week-1" />);
    expect(screen.getByText("Auto-save on")).toBeInTheDocument();
  });

  it("has correct aria-label referencing weekId", () => {
    render(<NotesPanel weekId="week-2" />);
    expect(screen.getByLabelText(/notes for week week-2/i)).toBeInTheDocument();
  });
});
