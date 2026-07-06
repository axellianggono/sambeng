export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export interface FlatNode {
  id: string;
  parentId: string | null;
  [key: string]: any;
}

export interface TreeNode extends FlatNode {
  children: TreeNode[];
}

export function buildHierarchy(flatList: FlatNode[]): TreeNode[] {
  const map: { [id: string]: TreeNode } = {};
  const roots: TreeNode[] = [];

  // Create mapping of nodes
  flatList.forEach((node) => {
    map[node.id] = { ...node, children: [] };
  });

  // Build tree hierarchy
  flatList.forEach((node) => {
    const treeNode = map[node.id];
    if (node.parentId === null || !map[node.parentId]) {
      roots.push(treeNode);
    } else {
      map[node.parentId].children.push(treeNode);
    }
  });

  return roots;
}
