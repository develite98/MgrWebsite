export interface MenuCategory {
  id: number;
  mms_category_id: number;
  title: string;
  slug: string;
  description: string;
  branch_id: number;
  subCategories: MenuCategory[];
  priority: number;
}
