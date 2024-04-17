import { create } from "zustand";
import { Issue, IssueType, Issues, RowIssue } from "../types/issue";
import { swap } from "../utils/helperFunc";

type Store = {
  issues: Issues;
  loading: boolean;
  fetchError: string;
  validateError: string;
  inputText: string;
  breadCrumbs: string[];
  fetchIssues: () => Promise<void>;
  setInputText: (text: string) => void;
  validateInputText: () => void;
  makeBreadCrumbs: () => void;
  moveIssue: (
    issueId: number,
    fromColumn: IssueType,
    toColumn: IssueType
  ) => void;
  changeOrder: (
    issueId: number,
    fromColumn: IssueType,
    toColumn: IssueType,
    toIndex: number
  ) => void;
};

const useStore = create<Store>((set, get) => ({
  issues: {
    todo: [],
    inProgress: [],
    done: [],
  },
  loading: false,
  fetchError: "",
  validateError: "",
  inputText: "https://github.com/facebook/react",
  breadCrumbs: [],
  fetchIssues: async () => {
    const breadCrumbs = get().breadCrumbs;
    if (!breadCrumbs[0] || !breadCrumbs[1]) {
      return;
    }
    const inputText = get().inputText;
    const sessionValue = sessionStorage.getItem(inputText);

    if (sessionValue !== null) {
      const parsedValue = JSON.parse(sessionValue);
      set({ issues: parsedValue });
    } else {
      try {
        set({ loading: true });
        const response = await fetch(
          `https://api.github.com/repos/${breadCrumbs[0]}/${breadCrumbs[1]}/issues?state=all`
        );
        if (!response.ok) throw response;
        const data = await response.json();

        const result: Issues = {
          todo: [],
          inProgress: [],
          done: [],
        };

        data.forEach((issue: RowIssue) => {
          const column =
            issue.state === "open" && issue.comments === 0
              ? "todo"
              : issue.state === "open"
              ? "inProgress"
              : issue.state === "closed"
              ? "done"
              : "";

          if (
            column === "todo" ||
            column === "inProgress" ||
            column === "done"
          ) {
            result[column].push({
              id: issue.id,
              title: issue.title,
              number: issue.number,
              date: issue.created_at,
              userLogin: issue.user.login,
              commentsNum: issue.comments,
            });
          }
        });
        sessionStorage.setItem(inputText, JSON.stringify(result));
        set({ issues: result });
        set({ fetchError: "" });
      } catch (e: any) {
        if (e.statusText) {
          set({ fetchError: e.statusText });
        } else if (e.status === 404) {
          set({ fetchError: "404 Not Found, check the link is correct" });
        } else {
          set({ fetchError: "something went wrong" });
        }
      } finally {
        set({ loading: false });
      }
    }
  },
  setInputText: (text) => set({ inputText: text }),
  validateInputText: () => {
    const text = get().inputText;
    const urlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (urlRegex.test(text)) {
      set({ validateError: "" });
    } else {
      set({
        validateError: `${text} this URL has error use format https://github.com/{owner}/{repo}`,
      });
    }
  },
  makeBreadCrumbs: () => {
    const text = get().inputText;
    const splitText = text.split("/");
    set({ breadCrumbs: [splitText[3], splitText[4]] });
  },
  moveIssue: (issueId, fromColumn, toColumn) => {
    if (fromColumn === toColumn) return;

    const issues = get().issues;
    const fromIssues: Issue[] = issues[fromColumn];
    const toIssues: Issue[] = issues[toColumn];

    const draggedIssue = fromIssues.find((issue) => issue.id === issueId);
    if (!draggedIssue) return;

    const newFromIssues = fromIssues.filter((issue) => issue.id !== issueId);
    const newToIssues = [...toIssues, draggedIssue];

    set({
      issues: {
        ...issues,
        [fromColumn]: newFromIssues,
        [toColumn]: newToIssues,
      },
    });
    const inputText = get().inputText;
    const newIssuesFromStore = get().issues;
    sessionStorage.setItem(inputText, JSON.stringify(newIssuesFromStore));
  },
  changeOrder: (issueIndex, fromColumn, toColumn, toIndex) => {
    if (fromColumn !== toColumn) return;
    if (issueIndex === toIndex) return;

    const issues = get().issues;
    const newIssues = issues[fromColumn];
    const filteredIssues = swap(newIssues, issueIndex, toIndex);
    set({
      issues: {
        ...issues,
        [fromColumn]: filteredIssues,
      },
    });
    const inputText = get().inputText;
    const newIssuesFromStore = get().issues;
    sessionStorage.setItem(inputText, JSON.stringify(newIssuesFromStore));
  },
}));

export default useStore;
