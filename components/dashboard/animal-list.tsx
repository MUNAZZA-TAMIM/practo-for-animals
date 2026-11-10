"use client";

import * as React from "react";
import Link from "next/link";
import {
  Edit3,
  PawPrint,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  createAnimalAction,
  deleteAnimalAction,
  updateAnimalAction,
} from "@/app/account/actions";
import { animalCreateSchema, animalUpdateSchema } from "@/lib/validation/schemas";
import type { Animal } from "@/lib/db";

type AnimalFormState = {
  status: "idle" | "error";
  message?: string;
};

export function AnimalList({ animals: initialAnimals }: { animals: Animal[] }) {
  const [animals, setAnimals] = React.useState<Animal[]>(initialAnimals);
  const [loading, setLoading] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEditId, setOpenEditId] = React.useState<string | null>(null);
  const [openDeleteId, setOpenDeleteId] = React.useState<string | null>(null);

  const [addState, addAction] = React.useActionState<AnimalFormState, FormData>(
    createAnimalAction,
    { status: "idle" },
  );

  const [editState, editAction] = React.useActionState<AnimalFormState, FormData>(
    updateAnimalAction,
    { status: "idle" },
  );

  const [deleteState, deleteAction] = React.useActionState<AnimalFormState, FormData>(
    deleteAnimalAction,
    { status: "idle" },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="kicker">My animals</p>
          <h1 className="mt-2 font-display text-[34px] leading-[1.02] tracking[-0.04em] text-forest-900 sm:text-[42px]">
            Animal profiles
          </h1>
          <p className="mt-1 text-[11px] leading-5 text-ink-muted">
            {animals.length} animal{animals.length !== 1 ? "s" : ""} in your care profile
          </p>
        </div>
        <Button
          asChild
          variant="primary"
          size="lg"
          onClick={() => setOpenAdd(true)}
          disabled={addState.status === "error"}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add an animal
        </Button>
      </div>

      {loading ? (
        <div className="rounded-[20px] border border-line bg-white-warm p-12 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-forest-500 animate-pulse" aria-hidden="true" />
          <p className="mt-4 text-[12px] font-semibold text-forest-900">
            Loading your animals…
          </p>
        </div>
      ) : animals.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-white-warm p-12 text-center">
          <PawPrint className="mx-auto h-10 w-10 text-ink-muted/30" aria-hidden="true" />
          <p className="mt-4 text-[12px] font-semibold text-forest-900">
            No animals in your profile yet
          </p>
          <p className="mt-1 text-[11px] leading-5 text-ink-muted">
            Add your animal&rsquo;s profile so you can select them when
            requesting appointments.
          </p>
          <Button
            asChild
            size="lg"
            onClick={() => setOpenAdd(true)}
            disabled={addState.status === "error"}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add your first animal
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onEdit={() => setOpenEditId(animal.id)}
              onDelete={() => setOpenDeleteId(animal.id)}
            />
          ))}
        </div>
      )}

      <AddAnimalDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSubmit={addAction}
        pending={addState.status === "error" ? false : openAdd}
        error={addState.message}
      />

      {openEditId && (
        <EditAnimalDialog
          open={openEditId !== null}
          onOpenChange={(open) => setOpenEditId(open ? openEditId : null)}
          animal={animals.find((a) => a.id === openEditId) ?? undefined}
          onSubmit={editAction}
          pending={editState.status === "error" ? false : openEditId !== null}
          error={editState.message}
        />
      )}

      {openDeleteId && (
        <DeleteAnimalDialog
          open={openDeleteId !== null}
          onOpenChange={(open) => setOpenDeleteId(open ? openDeleteId : null)}
          animal={animals.find((a) => a.id === openDeleteId) ?? undefined}
          onSubmit={deleteAction}
          pending={deleteState.status === "error" ? false : openDeleteId !== null}
          error={deleteState.message}
        />
      )}
    </div>
  );
}

function AnimalCard({
  animal,
  onEdit,
  onDelete,
}: {
  animal: Animal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card hover:border-forest-900/25 transition-all">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-forest-800">
          <PawPrint className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[17px] leading-[1.04] tracking[-0.02em] text-forest-900">
            {animal.name}
          </h3>
          <p className="mt-0.5 text-[11px] leading-5 text-ink-muted">
            {animal.species}{animal.breed ? ` · ${animal.breed}` : ""}{animal.age ? ` · ${animal.age}` : ""}
          </p>
        </div>
      </div>
      {animal.notes && (
        <p className="mt-4 text-[11px] leading-5 text-ink-muted line-clamp-2">
          {animal.notes}
        </p>
      )}
      <div className="mt-5 flex items-center justify-between gap-2">
        <Button
          asChild
          variant="outlineInverse"
          size="sm"
          onClick={onEdit}
        >
          <Edit3 className="h-3 w-3" aria-hidden="true" />
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete}>
          <Trash2 className="h-3 w-3" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}

function AddAnimalDialog({
  open,
  onOpenChange,
  onSubmit,
  pending,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
  pending: boolean;
  error: string | undefined;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden">
          Add animal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add an animal</DialogTitle>
        <DialogDescription>
          Add your animal&rsquo;s profile to select them when requesting
          appointments.
        </DialogDescription>
        <form action={onSubmit} className="mt-6 space-y-4">
          <Field
            label="Animal name"
            htmlFor="animal-name"
            error={error ? "Please check the fields above" : undefined}
          >
            <Input
              id="animal-name"
              name="name"
              required
              maxLength={80}
              placeholder="e.g. Luna"
              disabled={pending}
            />
          </Field>
          <Field
            label="Species"
            htmlFor="animal-species"
            error={error ? "Please check the fields above" : undefined}
          >
            <Input
              id="animal-species"
              name="species"
              required
              maxLength={50}
              placeholder="e.g. Dog, Cat, Rabbit"
              disabled={pending}
            />
          </Field>
          <Field label="Breed (optional)" htmlFor="animal-breed" optional>
            <Input
              id="animal-breed"
              name="breed"
              maxLength={80}
              placeholder="e.g. Golden Retriever"
              disabled={pending}
            />
          </Field>
          <Field label="Age (optional)" htmlFor="animal-age" optional>
            <Input
              id="animal-age"
              name="age"
              maxLength={50}
              placeholder="e.g. 3 years, 6 months"
              disabled={pending}
            />
          </Field>
          <Field label="Notes (optional)" htmlFor="animal-notes" optional>
            <Input
              id="animal-notes"
              name="notes"
              maxLength={1000}
              placeholder="Anything your provider should know…"
              disabled={pending}
            />
          </Field>
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button
              type="button"
              variant="outlineInverse"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Adding…" : "Add animal"}
            </Button>
          </div>
        </form>
        {error ? (
          <p className="mt-3 text-[11px] text-danger-ink">{error}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EditAnimalDialog({
  open,
  onOpenChange,
  animal,
  onSubmit,
  pending,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal: Animal | undefined;
  onSubmit: (formData: FormData) => void | Promise<void>;
  pending: boolean;
  error: string | undefined;
}) {
  if (!animal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Edit {animal.name}</DialogTitle>
      <DialogDescription>
        Update your animal&rsquo;s profile details.
      </DialogDescription>
      <form action={onSubmit} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={animal.id} />
        <Field
          label="Animal name"
          htmlFor="edit-animal-name"
          error={error ? "Please check the fields above" : undefined}
        >
          <Input
            id="edit-animal-name"
            name="name"
            defaultValue={animal.name}
            required
            maxLength={80}
            disabled={pending}
          />
        </Field>
        <Field
          label="Species"
          htmlFor="edit-animal-species"
          error={error ? "Please check the fields above" : undefined}
        >
          <Input
            id="edit-animal-species"
            name="species"
            defaultValue={animal.species}
            required
            maxLength={50}
            disabled={pending}
          />
        </Field>
        <Field label="Breed (optional)" htmlFor="edit-animal-breed" optional>
          <Input
            id="edit-animal-breed"
            name="breed"
            defaultValue={animal.breed || ""}
            maxLength={80}
            disabled={pending}
          />
        </Field>
        <Field label="Age (optional)" htmlFor="edit-animal-age" optional>
          <Input
            id="edit-animal-age"
            name="age"
            defaultValue={animal.age || ""}
            maxLength={50}
            disabled={pending}
          />
        </Field>
        <Field label="Notes (optional)" htmlFor="edit-animal-notes" optional>
          <Input
            id="edit-animal-notes"
            name="notes"
            defaultValue={animal.notes || ""}
            maxLength={1000}
            disabled={pending}
          />
        </Field>
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            variant="outlineInverse"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
      {error ? (
        <p className="mt-3 text-[11px] text-danger-ink">{error}</p>
      ) : null}
    </Dialog>
  );
}

function DeleteAnimalDialog({
  open,
  onOpenChange,
  animal,
  onSubmit,
  pending,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal: Animal | undefined;
  onSubmit: (formData: FormData) => void | Promise<void>;
  pending: boolean;
  error: string | undefined;
}) {
  if (!animal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Remove {animal.name}?</DialogTitle>
      <DialogDescription>
        This will remove your animal&rsquo;s profile. This cannot be undone.
      </DialogDescription>
      <form action={onSubmit} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={animal.id} />
        <div className="rounded-xl border border-line bg-white-warm p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Animal to remove
          </p>
          <p className="mt-1 text-[12px] font-semibold text-forest-900">
            {animal.name}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            {animal.species}{animal.breed ? ` · ${animal.breed}` : ""}
          </p>
        </div>
        <div className="rounded-xl border border-danger-ink/20 bg-danger-bg p-4">
          <p className="text-[10px] font-bold text-danger-ink">
            This action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            variant="outlineInverse"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Keep profile
          </Button>
          <Button type="submit" variant="danger" size="sm" disabled={pending}>
            {pending ? "Removing…" : "Remove animal"}
          </Button>
        </div>
      </form>
      {error ? (
        <p className="mt-3 text-[11px] text-danger-ink">{error}</p>
      ) : null}
    </Dialog>
  );
}
