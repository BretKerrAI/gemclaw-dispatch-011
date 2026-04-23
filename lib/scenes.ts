export const SCENE_IDS = [
  "forest_path",
  "doorway",
  "staircase_down",
  "staircase_up",
  "starfield",
  "mirror",
  "river_crossing",
  "desert_road",
  "lighthouse",
  "subway_tunnel",
  "library_stacks",
  "kitchen_window",
  "rooftop_night",
  "cave_mouth",
  "harbor_fog",
  "attic_ladder",
  "clearing_with_fire",
  "empty_stage",
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export const SCENE_SET: ReadonlySet<string> = new Set(SCENE_IDS);

export function isSceneId(v: unknown): v is SceneId {
  return typeof v === "string" && SCENE_SET.has(v);
}

export const SCENE_LABELS: Record<SceneId, string> = {
  forest_path: "Forest path",
  doorway: "Doorway",
  staircase_down: "Staircase, descending",
  staircase_up: "Staircase, ascending",
  starfield: "Starfield",
  mirror: "Mirror",
  river_crossing: "River crossing",
  desert_road: "Desert road",
  lighthouse: "Lighthouse",
  subway_tunnel: "Subway tunnel",
  library_stacks: "Library stacks",
  kitchen_window: "Kitchen window",
  rooftop_night: "Rooftop, night",
  cave_mouth: "Cave mouth",
  harbor_fog: "Harbor in fog",
  attic_ladder: "Attic ladder",
  clearing_with_fire: "Clearing with fire",
  empty_stage: "Empty stage",
};
