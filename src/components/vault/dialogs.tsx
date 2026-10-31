import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { MAX_NAME_LENGTH } from "@/lib/constants";
import { errorMessage } from "@/lib/errors";
import { buildTree } from "@/lib/folders";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Loader2, X } from "lucide-react";
import { useState, type FormEvent } from "react";

/** Creates a folder or renames either kind of item. */
export function NameDialog({
  open,
  onOpenChange,
  title,
  description,
  initialValue = "",
  placeholder = "Untitled",
  submitLabel,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  initialValue?: string;
  placeholder?: string;
  submitLabel: string;
  onSubmit: (name: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-arm each time the dialog opens — done during render so no effect runs.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValue(initialValue);
      setError(null);
      setBusy(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const name = value.trim();
    if (!name || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(name);
      onOpenChange(false);
    } catch (caught) {
      setError(errorMessage(caught));
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!busy) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="grid gap-2 py-5">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={value}
              placeholder={placeholder}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              onChange={(event) => setValue(event.target.value)}
              onFocus={(event) => event.target.select()}
            />
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !value.trim()}>
              {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Folder picker used to move a file or a folder somewhere else. */
export function MoveDialog({
  open,
  onOpenChange,
  folders,
  currentParentId,
  excluded = new Set<string>(),
  title,
  description,
  submitLabel = "Move here",
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: Doc<"folders">[];
  currentParentId: Id<"folders"> | null;
  excluded?: Set<string>;
  title: string;
  description?: string;
  submitLabel?: string;
  onSubmit: (target: Id<"folders"> | null) => Promise<void>;
}) {
  const [selected, setSelected] = useState<Id<"folders"> | null>(currentParentId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSelected(currentParentId);
      setError(null);
      setBusy(false);
    }
  }

  const rows: { id: Id<"folders"> | null; name: string; depth: number }[] = [
    { id: null, name: "All files", depth: 0 },
  ];
  const walk = (nodes: ReturnType<typeof buildTree>, depth: number) => {
    for (const node of nodes) {
      rows.push({ id: node.folder._id, name: node.folder.name, depth });
      walk(node.children, depth + 1);
    }
  };
  walk(buildTree(folders), 0);

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(selected);
      onOpenChange(false);
    } catch (caught) {
      setError(errorMessage(caught));
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!busy) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto rounded-lg border border-border/70 py-1.5">
          {rows.map((row) => {
            const disabled = row.id !== null && excluded.has(row.id);
            const isSelected = selected === row.id;
            return (
              <button
                key={row.id ?? "root"}
                type="button"
                disabled={disabled}
                onClick={() => setSelected(row.id)}
                style={{ paddingLeft: `${0.75 + row.depth * 1}rem` }}
                className={cn(
                  "flex w-full items-center gap-2 py-2 pr-3 text-left text-sm transition-colors",
                  disabled
                    ? "cursor-not-allowed text-muted-foreground/50"
                    : isSelected
                      ? "bg-[var(--brand-soft)] text-[var(--brand-soft-foreground)]"
                      : "text-foreground hover:bg-accent",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{row.name}</span>
                {disabled ? (
                  <X className="size-3.5 shrink-0 opacity-60" />
                ) : isSelected ? (
                  <Check className="size-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="size-3.5 shrink-0 opacity-30" />
                )}
              </button>
            );
          })}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={confirm} disabled={busy}>
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Delete confirmation for a file or a whole folder subtree. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setError(null);
      setBusy(false);
    }
  }

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (caught) {
      setError(errorMessage(caught));
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!busy) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Keep it
          </Button>
          <Button
            variant="destructive"
            onClick={confirm}
            disabled={busy}
          >
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
