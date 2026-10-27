'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

export type FieldOption = {
  value: string;
  label: string;
};

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

function fieldMessages(id: string, hint?: string, error?: string) {
  return (
    <>
      {hint ? (
        <span className="field-hint" id={`${id}-hint`}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </>
  );
}

function formatMoneyText(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (cleaned === '') return '';
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return '';
  return parsed.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function CurrencyField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  optional = false,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  optional?: boolean;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={cn('field', error && 'field-invalid')}>
      <label htmlFor={fieldId}>
        {label}
        {optional ? <span className="field-optional">Optional</span> : null}
      </label>
      <div className="money-input">
        <span aria-hidden="true">$</span>
        <input
          id={fieldId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-describedby={describedBy(fieldId, hint, error)}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.value.replace(/[^0-9.,]/g, ''))}
          onBlur={() => onChange(formatMoneyText(value))}
        />
      </div>
      {fieldMessages(fieldId, hint, error)}
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
  error,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FieldOption[];
  hint?: string;
  error?: string;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={cn('field', error && 'field-invalid')}>
      <label htmlFor={fieldId}>{label}</label>
      <select
        id={fieldId}
        value={value}
        aria-describedby={describedBy(fieldId, hint, error)}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {fieldMessages(fieldId, hint, error)}
    </div>
  );
}

export function RadioField({
  legend,
  value,
  onChange,
  options,
  hint,
}: {
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: FieldOption[];
  hint?: string;
}) {
  const generatedId = useId();
  return (
    <fieldset className="field radio-field">
      <legend>{legend}</legend>
      <div className="radio-options">
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          return (
            <label htmlFor={optionId} key={option.value}>
              <input
                id={optionId}
                type="radio"
                name={generatedId}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {hint ? <span className="field-hint">{hint}</span> : null}
    </fieldset>
  );
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  min = 0,
  max,
  step = 1,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={cn('field', error && 'field-invalid')}>
      <label htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={describedBy(fieldId, hint, error)}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {fieldMessages(fieldId, hint, error)}
    </div>
  );
}

export function MonthField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  optional = false,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  optional?: boolean;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={cn('field', error && 'field-invalid')}>
      <label htmlFor={fieldId}>
        {label}
        {optional ? <span className="field-optional">Optional</span> : null}
      </label>
      <input
        id={fieldId}
        type="month"
        value={value}
        aria-describedby={describedBy(fieldId, hint, error)}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {fieldMessages(fieldId, hint, error)}
    </div>
  );
}
