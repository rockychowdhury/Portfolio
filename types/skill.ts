export interface ISkill {
  _id?: string;
  name: string;
  icon: string;
  icon_group: string; // 'si', 'lu', 'bi', etc.
  icon_type: "icon" | "text";
  description: string;
  group: string;
  is_top_skill: boolean;
  order: number;
  color?: string; // Brand hex color
}
