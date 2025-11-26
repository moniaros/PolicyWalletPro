import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  validator?: (value: string) => string | null;
  testId?: string;
}

export function FormInputWithValidation({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error: externalError,
  hint,
  validator,
  testId,
}: FormInputProps) {
  const [touched, setTouched] = useState(false);

  const validationError = touched && validator ? validator(value) : null;
  const error = externalError || validationError;
  const isValid = touched && value && !error;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">{label}</label>
      
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`pr-10 transition-colors ${
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : isValid
              ? "border-emerald-500 focus-visible:ring-emerald-500"
              : ""
          }`}
          data-testid={testId}
        />
        
        {error && touched && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
        )}
      </div>

      {error && touched && (
        <p className="text-xs text-red-500 flex items-center gap-1" data-testid="error-message">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
