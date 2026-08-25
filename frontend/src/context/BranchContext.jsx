import { createContext, useContext, useState, useEffect } from "react";

const BranchContext = createContext();

export const BRANCHES = [
  { id: "all", name: "All Branches", code: "ALL", city: "Coimbatore & Tirupur", address: "Consolidated Wholesale Hub", color: "#00E599" },
  { id: "coimbatore", name: "Coimbatore Branch", code: "CBR-001", city: "Coimbatore", address: "Gandhipuram Main Road, Coimbatore", color: "#34D399" },
  { id: "tirupur", name: "Tirupur Branch", code: "TPR-001", city: "Tirupur", address: "Dharapuram Road, Tirupur", color: "#00F59B" },
];

export function BranchProvider({ children }) {
  const [selectedBranch, setSelectedBranch] = useState(() => {
    return localStorage.getItem("best_selected_branch") || "all";
  });

  useEffect(() => {
    localStorage.setItem("best_selected_branch", selectedBranch);
  }, [selectedBranch]);

  const currentBranchObj = BRANCHES.find((b) => b.id === selectedBranch) || BRANCHES[0];

  const filterByBranch = (items, branchKey = "branch") => {
    if (!items || !Array.isArray(items)) return [];
    if (selectedBranch === "all") return items;

    return items.filter((item) => {
      const rawBranch = item[branchKey];
      let branchStr = "";

      if (typeof rawBranch === "object" && rawBranch !== null) {
        branchStr = rawBranch.branchName || rawBranch.name || rawBranch.city || "";
      } else if (typeof rawBranch === "string") {
        branchStr = rawBranch;
      }

      const fallbackStr = item.branchName || item.city || item.address || "";
      const combined = `${branchStr} ${fallbackStr}`.toLowerCase();

      return combined.includes(selectedBranch.toLowerCase());
    });
  };

  return (
    <BranchContext.Provider value={{ selectedBranch, setSelectedBranch, currentBranch: currentBranchObj, branches: BRANCHES, filterByBranch }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
