import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/app/App";

describe("App", () => {
  it("renders starter title", () => {
    render(<App />);
    expect(screen.getByText("災害資訊整理工作台")).toBeInTheDocument();
  });

  it("keeps the home page focused on phase 0 tabs", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "原始資訊" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "整理工作台" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "通報" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "地點" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "志工任務" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "人員指派" }),
    ).not.toBeInTheDocument();
  });

  it("shows review states in the phase 0 workbench", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(
      screen.getByText(
        "第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("待人工確認").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未查核").length).toBeGreaterThan(0);
  });

  it("shows raw information classification fields", () => {
    render(<App />);

    expect(screen.getAllByText("須協助者").length).toBeGreaterThan(0);
    expect(screen.getAllByText("通報者").length).toBeGreaterThan(0);
    expect(screen.getAllByText("需要資源").length).toBeGreaterThan(0);
    expect(screen.getAllByText("通報時間").length).toBeGreaterThan(0);
    expect(screen.getAllByText("須協助地點").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("原始資訊分類")).toBeInTheDocument();
  });

  it("keeps draft CRUD as learner work instead of starter output", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    // 預初始化 6 筆整理草稿供學員參考與編輯
    expect(screen.getByText("已建立草稿")).toBeInTheDocument();
    expect(screen.getByText("編輯整理草稿")).toBeInTheDocument();
    // 確認有人工審視備註欄位
    expect(screen.getAllByText("人工審視").length).toBeGreaterThan(0);
  });
});
