import { render, screen } from "@testing-library/react";
import DashboardLoading from "@/app/dashboard/loading";
import TodayLoading from "@/app/dashboard/today/loading";
import MonthLoading from "@/app/dashboard/month/[id]/loading";
import PortfolioLoading from "@/app/dashboard/portfolio/loading";

describe("Loading skeletons", () => {
  describe("DashboardLoading", () => {
    it("renders without crashing", () => {
      const { container } = render(<DashboardLoading />);
      expect(container.firstChild).toBeTruthy();
    });

    it("has animate-pulse class", () => {
      const { container } = render(<DashboardLoading />);
      expect(container.firstChild).toHaveClass("animate-pulse");
    });
  });

  describe("TodayLoading", () => {
    it("renders without crashing", () => {
      const { container } = render(<TodayLoading />);
      expect(container.firstChild).toBeTruthy();
    });

    it("has animate-pulse class", () => {
      const { container } = render(<TodayLoading />);
      expect(container.firstChild).toHaveClass("animate-pulse");
    });
  });

  describe("MonthLoading", () => {
    it("renders without crashing", () => {
      const { container } = render(<MonthLoading />);
      expect(container.firstChild).toBeTruthy();
    });

    it("has animate-pulse class", () => {
      const { container } = render(<MonthLoading />);
      expect(container.firstChild).toHaveClass("animate-pulse");
    });
  });

  describe("PortfolioLoading", () => {
    it("renders without crashing", () => {
      const { container } = render(<PortfolioLoading />);
      expect(container.firstChild).toBeTruthy();
    });

    it("has animate-pulse class", () => {
      const { container } = render(<PortfolioLoading />);
      expect(container.firstChild).toHaveClass("animate-pulse");
    });
  });
});
