export const mappings = {
  dcp: {
    "GDR": { testID: "Dropdown-item-gdr", expectedText: "Granular Data Reporting (GDR)" },
    "AML": { testID: "Dropdown-item-aml", expectedText: "Anti-Money Laundering (AML)" },
    "RPO": { testID: "Dropdown-item-rpo", expectedText: "Retail Payment Oversight (RPO)" }
  },
  submissionType: {
    "Regular report": { testID: "Dropdown-item-submission", expectedText: "Regular report" },
    "Supplementary file": { testID: "Dropdown-item-supplementary", expectedText: "Supplementary file" },
  },
  dataArea: {
    //GDR
    "CL": { testID: "Dropdown-item-CL", expectedText: "CL - Corporate Loans"},
    "IBL": { testID: "Dropdown-item-IBL", expectedText: "IBL - Interbank Loans and Deposits"},
    "DSH": { testID: "Dropdown-item-DSH", expectedText: "DSH - Debt Securities Held"},
    "RML": { testID: "Dropdown-item-RML", expectedText: "RML - Residential Mortgage Loans"},
    "DCTCL": { testID: "Dropdown-item-DCTCL", expectedText: "DCTCL - Data Constraint Tracker - Corporate Loans"},
    "DCTIBL": { testID: "Dropdown-item-DCTIBL", expectedText: "DCTIBL - Data Constraint Tracker - Interbank Loans and Deposits"},
    "DCTDSH": { testID: "Dropdown-item-DCTDSH", expectedText: "DCTDSH - Data Constraint Tracker - Debt Securities Held"},
    "DSHHKO": { testID: "Dropdown-item-DSHHKO", expectedText: "DSHHKO - Debt Securities Held Hong Kong Office"},
    //AML
    "FCR": { testID: "Dropdown-item-FCR", expectedText: "FCR - Financial Crime Risk (AIs)"},
    "IRA": { testID: "Dropdown-item-IRA", expectedText: "IRA - Institutional Risk Assessment"},
    "ONSITE": { testID: "Dropdown-item-ONSITE", expectedText: "ONSITE - Onsite Exam File"},
    "AMLOTH": { testID: "Dropdown-item-AMLOTH", expectedText: "AMLOTH - Other files"},
    //AML - SVF
    "FCRSVF": { testID: "Dropdown-item-FCRSVF", expectedText: "FCRSVF - Financial Crime Risk (SVF licensees)"},
    //RPO
    "SVFSTA": { testID: "Dropdown-item-SVFSTA", expectedText: "SVFSTA - SVF additional file"},
    "SVFMS": { testID: "Dropdown-item-SVFMS", expectedText: "SVFMS - SVF statistic file"},

  }
} as const;

export function expand<T extends Record<string, string>>(cases: T[]) {
  return cases.map(tc => {
    const expandedEntries = Object.entries(tc).map(([key, value]) => {
      if (mappings[key as keyof typeof mappings] && mappings[key as keyof typeof mappings][value]) {
        const mappedValue = mappings[key as keyof typeof mappings][value];
        return [key, { shortName: value, ...mappedValue }];
      }
      return [key, value];
    });
    return Object.fromEntries(expandedEntries);
  });
}
