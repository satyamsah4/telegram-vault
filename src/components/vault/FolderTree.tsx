import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { FolderNode } from "@/lib/folders";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Move,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function FolderTree({
  tree,
  activeId,
  activePathIds,
  onSelect,
  onRename,
  onMove,
  onDelete,
}: {
  tree: FolderNode[];
  activeId: Id<"folders"> | null;
  activePathIds: Set<string>;
  onSelect: (id: Id<"folders"> | null) => void;
  onRename: (folder: Doc<"folders">) => void;
  onMove: (folder: Doc<"folders">) => void;
  onDelete: (folder: Doc<"folders">) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isOpen = (id: string) => expanded.has(id) || activePathIds.has(id);

  const renderBranches = (nodes: FolderNode[], depth: number) =>
    nodes.flatMap((node) => {
      const open = isOpen(node.folder._id);
      const isActive = activeId === node.folder._id;
      return [
        <li key={node.folder._id}>
          <div
            className="flex items-center gap-0.5 pr-1.5"
            style={{ paddingLeft: `${depth * 0.6}rem` }}
          >
            <button
              type="button"
              aria-label={open ? "Collapse folder" : "Expand folder"}
              onClick={() => toggle(node.folder._id)}
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded text-muted-foreground transition-colors hover:bg-sidebar-accent",
                node.children.length === 0 && "invisible",
              )}
            >
              <ChevronRight
                className={cn(
                  "size-3.5 transition-transform duration-150",
                  open && "rotate-90",
                )}
              />
            </button>
            <button
              type="button"
              onClick={() => onSelect(node.folder._id)}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                isActive
                  ? "bg-[var(--brand-soft)] font-medium text-[var(--brand-soft-foreground)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              {open ? (
                <FolderOpen className="size-4 shrink-0 opacity-80" />
              ) : (
                <Folder className="size-4 shrink-0 opacity-80" />
              )}
              <span className="truncate">{node.folder.name}</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Actions for ${node.folder.name}`}
                  className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => onRename(node.folder)}>
                  <Pencil className="mr-2 size-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(node.folder)}>
                  <Move className="mr-2 size-4" />
                  Move to…
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(node.folder)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {open && node.children.length > 0 ? (
            <ul>{renderBranches(node.children, depth + 1)}</ul>
          ) : null}
        </li>,
      ];
    });

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Folders">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
          activeId === null
            ? "bg-[var(--brand-soft)] font-medium text-[var(--brand-soft-foreground)]"
            : "text-sidebar-foreground hover:bg-sidebar-accent",
        )}
      >
        <Folder className="size-4 shrink-0 opacity-80" />
        <span className="truncate">All files</span>
      </button>
      {tree.length > 0 ? <ul className="mt-0.5">{renderBranches(tree, 0)}</ul> : null}
    </nav>
  );
}
