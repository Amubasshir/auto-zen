import { render, screen, fireEvent, act } from "@testing-library/react";

const mockSaveNote = jest.fn();
jest.mock("@/actions/notes", () => ({
  saveNote: (...args: unknown[]) => mockSaveNote(...args),
}));

// Control the debounce: expose the debounced value immediately for testing
jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: <T,>(value: T) => value,
}));

import { NotesPanel } from "@/components/overlays/NotesPanel";

describe("NotesPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSaveNote.mockResolvedValue({ success: true, updatedAt: new Date().toISOString() });
  });

  it("renders the Notes heading", () => {
    render(<NotesPanel weekId="week-1" />);
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("renders an empty textarea by default", () => {
    render(<NotesPanel weekId="week-1" />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("renders with initialContent when provided", () => {
    render(<NotesPanel weekId="week-1" initialContent="Existing notes" />);
    expect(screen.getByRole("textbox")).toHaveValue("Existing notes");
  });

  it("updates value as user types", () => {
    render(<NotesPanel weekId="week-1" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "New note" } });
    expect(screen.getByRole("textbox")).toHaveValue("New note");
  });

  it("shows 'Auto-save on' initially with no content changes", () => {
    render(<NotesPanel weekId="week-1" />);
    expect(screen.getByText("Auto-save on")).toBeInTheDocument();
  });

  it("calls saveNote after content changes (debounce mocked to immediate)", async () => {
    render(<NotesPanel weekId="week-1" />);
    await act(async () => {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "typed content" } });
    });
    expect(mockSaveNote).toHaveBeenCalledWith("week-1", "typed content");
  });

  it("shows saved timestamp after successful save", async () => {
    render(<NotesPanel weekId="week-1" />);
    await act(async () => {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "save me" } });
    });
    // After save completes, "Saved HH:MM" appears
    expect(screen.getByText(/saved \d{1,2}:\d{2}/i)).toBeInTheDocument();
  });

  it("shows error indicator when saveNote fails", async () => {
    mockSaveNote.mockResolvedValue({ success: false, error: "Save failed" });
    render(<NotesPanel weekId="week-1" />);
    await act(async () => {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "oops" } });
    });
    expect(screen.getByText("Save failed")).toBeInTheDocument();
  });

  it("has correct aria-label referencing weekId", () => {
    render(<NotesPanel weekId="week-2" />);
    expect(screen.getByLabelText(/notes for week week-2/i)).toBeInTheDocument();
  });

  it("does not call saveNote on initial mount (no changes)", () => {
    render(<NotesPanel weekId="week-1" initialContent="existing" />);
    expect(mockSaveNote).not.toHaveBeenCalled();
  });
});
