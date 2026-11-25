export const NIMO_THEMES = {
    ORIGINAL: "#B8F36B",
    OCEAN: "#60A5FA",
    LAVENDER: "#C084FC",
    SUNSET: "#FB923C",
    ROSE: "#F472B6",
    ICE: "#E8ECF0",
  } as const
  
  export type NimoTheme = keyof typeof NIMO_THEMES