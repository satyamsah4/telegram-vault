import type { Doc, Id } from "@/convex/_generated/dataModel";

export interface FolderNode {
  folder: Doc<"folders">;
  children: FolderNode[];
}

/** Turns the flat folder table into a name-sorted tree for the sidebar. */
export function buildTree(folders: Doc<"folders">[]): FolderNode[] {
  const nodes = new Map<string, FolderNode>();
  for (const folder of folders) {
    nodes.set(folder._id, { folder, children: [] });
  }

  const roots: FolderNode[] = [];
  for (const folder of folders) {
    const node = nodes.get(folder._id)!;
    const parent =
      folder.parentId === null ? undefined : nodes.get(folder.parentId);
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortDeep = (list: FolderNode[]) => {
    list.sort((a, b) => a.folder.name.localeCompare(b.folder.name));
    for (const node of list) sortDeep(node.children);
  };
  sortDeep(roots);
  return roots;
}

/** Root → current folder. Unknown or null ids yield an empty path. */
export function folderPath(
  folders: Doc<"folders">[],
  folderId: Id<"folders"> | null,
): Doc<"folders">[] {
  if (folderId === null) return [];
  const byId = new Map(folders.map((folder) => [folder._id, folder]));
  const path: Doc<"folders">[] = [];
  const seen = new Set<string>();
  let cursor: Id<"folders"> | null = folderId;
  while (cursor !== null && !seen.has(cursor)) {
    seen.add(cursor);
    const folder: Doc<"folders"> | undefined = byId.get(cursor);
    if (!folder) break;
    path.unshift(folder);
    cursor = folder.parentId;
  }
  return path;
}

/** The given folder plus everything beneath it. */
export function subtreeIds(
  folders: Doc<"folders">[],
  rootId: Id<"folders">,
): Set<string> {
  const children = new Map<string, string[]>();
  for (const folder of folders) {
    if (folder.parentId === null) continue;
    const list = children.get(folder.parentId) ?? [];
    list.push(folder._id);
    children.set(folder.parentId, list);
  }
  const ids = new Set<string>([rootId]);
  const queue: string[] = [rootId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const child of children.get(current) ?? []) {
      if (ids.has(child)) continue;
      ids.add(child);
      queue.push(child);
    }
  }
  return ids;
}
