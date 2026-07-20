import type { ReactNode } from "react";

/**
 * Primitives de champ partagées par les deux formulaires de la section contact
 * (particulier + professionnel). Même rendu que l'existant ; `idPrefix` évite les
 * collisions d'`id` puisque les deux formulaires cohabitent sur la page d'accueil.
 */

type InputMode =
  | "text"
  | "email"
  | "tel"
  | "numeric"
  | "decimal"
  | "search"
  | "url"
  | "none";

const inputClass =
  "w-full border-b border-ink bg-transparent py-3 font-sans text-[15px] text-ink placeholder:italic placeholder:text-muted-ink focus-visible:border-bordeaux focus-visible:outline-none aria-invalid:border-bordeaux";

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink"
    >
      {children}
    </label>
  );
}

export function TextField({
  idPrefix,
  name,
  label,
  type = "text",
  placeholder,
  required,
  error,
  autoComplete,
  inputMode,
}: {
  idPrefix: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: InputMode;
}) {
  const id = `${idPrefix}-${name}`;
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error) || undefined}
        className={inputClass}
      />
      {error && <p className="mt-1 text-[12px] text-bordeaux">{error}</p>}
    </div>
  );
}

export function TextAreaField({
  idPrefix,
  name,
  label,
  rows = 3,
  placeholder,
  required,
  minLength,
  maxLength,
  error,
}: {
  idPrefix: string;
  name: string;
  label: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: string;
}) {
  const id = `${idPrefix}-${name}`;
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error) || undefined}
        className={`min-h-[110px] resize-y ${inputClass}`}
      />
      {error && <p className="mt-1 text-[12px] text-bordeaux">{error}</p>}
    </div>
  );
}

export function SelectField({
  idPrefix,
  name,
  label,
  options,
  required,
  error,
  placeholder = "Sélectionnez",
}: {
  idPrefix: string;
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  const id = `${idPrefix}-${name}`;
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={Boolean(error) || undefined}
        className="w-full appearance-none border-b border-ink bg-transparent py-3 pr-8 font-sans text-[15px] text-ink focus-visible:border-bordeaux focus-visible:outline-none aria-invalid:border-bordeaux"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%232C1F33' stroke-width='1' d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-[12px] text-bordeaux">{error}</p>}
    </div>
  );
}
