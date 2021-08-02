module.exports = {
  docsSidebar: [
    "get-started",
    {
      type: "category",
      label: "Guides",
      items: ["main-concepts/phases"],
      collapsed: false,
    },
    /*{
      type: "category",
      label: "Advanced Guides",
      items: ["advanced-guides/ephemeral-data"]
    },*/
    {
      type: "category",
      label: "API",
      items: [
        "api/game",
        "api/phase",
        "api/invalid-action-error",
        "api/client",
        "api/server",
      ],
      collapsed: false,
    }
  ],
};
