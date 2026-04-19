import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockDeleteResource = jest.fn();
jest.mock("@/actions/resources", () => ({
  deleteResource: (...args: unknown[]) => mockDeleteResource(...args),
}));

import { ResourceRow } from "@/components/month/ResourceRow";
import type { ClientResource } from "@/lib/validators/resource";

const baseResource: ClientResource = {
  id: "res-1",
  weekId: "week-1",
  title: "Make.com Tutorial",
  url: "https://youtube.com/watch?v=abc",
  type: "youtube",
  difficulty: "beginner",
  duration: "30 min",
  tasks: ["Watch video"],
  createdAt: "2026-04-01T00:00:00.000Z",
};

describe("ResourceRow", () => {
  const onEdit = jest.fn();
  const onDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteResource.mockResolvedValue({ success: true });
    // Suppress window.confirm
    jest.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the resource title", () => {
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    expect(screen.getByText("Make.com Tutorial")).toBeInTheDocument();
  });

  it("shows 'Custom' badge", () => {
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("shows type tag", () => {
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    expect(screen.getByText("YouTube")).toBeInTheDocument();
  });

  it("shows duration when provided", () => {
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    expect(screen.getByText("30 min")).toBeInTheDocument();
  });

  it("renders open URL link", () => {
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    const link = screen.getByLabelText(/open resource/i);
    expect(link).toHaveAttribute("href", baseResource.url);
  });

  it("calls onEdit with resource when edit button clicked", () => {
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    fireEvent.click(screen.getByLabelText(/edit resource/i));
    expect(onEdit).toHaveBeenCalledWith(baseResource);
  });

  it("calls deleteResource and onDeleted after confirming delete", async () => {
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    fireEvent.click(screen.getByLabelText(/delete resource/i));
    expect(window.confirm).toHaveBeenCalledWith(`Delete "${baseResource.title}"?`);
    await waitFor(() => {
      expect(mockDeleteResource).toHaveBeenCalledWith("res-1");
      expect(onDeleted).toHaveBeenCalledWith("res-1");
    });
  });

  it("does not call deleteResource when confirm is cancelled", () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);
    render(<ResourceRow resource={baseResource} onEdit={onEdit} onDeleted={onDeleted} />);
    fireEvent.click(screen.getByLabelText(/delete resource/i));
    expect(mockDeleteResource).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it("does not show duration when empty", () => {
    render(
      <ResourceRow
        resource={{ ...baseResource, duration: "" }}
        onEdit={onEdit}
        onDeleted={onDeleted}
      />,
    );
    expect(screen.queryByText("30 min")).not.toBeInTheDocument();
  });
});
