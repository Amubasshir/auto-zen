import { render, screen, fireEvent } from "@testing-library/react";
import { Drawer } from "@/components/overlays/Drawer";

describe("Drawer", () => {
  const onClose = jest.fn();
  beforeEach(() => onClose.mockClear());

  it("does not show panel content when closed", () => {
    render(
      <Drawer open={false} onClose={onClose}>
        <p>Drawer content</p>
      </Drawer>,
    );
    // Panel is in DOM but translated off-screen; content is still mounted
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveStyle({ transform: "translateX(105%)" });
  });

  it("shows panel content when open", () => {
    render(
      <Drawer open={true} onClose={onClose}>
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveStyle({ transform: "none" });
  });

  it("renders title when provided", () => {
    render(
      <Drawer open={true} onClose={onClose} title="My Title">
        <p>body</p>
      </Drawer>,
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders kicker when provided", () => {
    render(
      <Drawer open={true} onClose={onClose} kicker={<span>Month 2</span>}>
        <p>body</p>
      </Drawer>,
    );
    expect(screen.getByText("Month 2")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Drawer open={true} onClose={onClose} footer={<button>Save</button>}>
        <p>body</p>
      </Drawer>,
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <Drawer open={true} onClose={onClose}>
        <p>body</p>
      </Drawer>,
    );
    fireEvent.click(screen.getByLabelText(/close drawer/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(
      <Drawer open={true} onClose={onClose}>
        <p>body</p>
      </Drawer>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on Escape when closed", () => {
    render(
      <Drawer open={false} onClose={onClose}>
        <p>body</p>
      </Drawer>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when scrim is clicked", () => {
    render(
      <Drawer open={true} onClose={onClose}>
        <p>body</p>
      </Drawer>,
    );
    // The scrim is the first fixed div (aria-hidden)
    const scrim = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
