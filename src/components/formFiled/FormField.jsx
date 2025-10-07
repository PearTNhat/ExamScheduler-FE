import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

/**
 * FormField component - Tái sử dụng cho các form với react-hook-form
 *
 * @param {Object} props
 * @param {string} props.name - Tên field (bắt buộc)
 * @param {Object} props.control - Control từ useForm (bắt buộc)
 * @param {string} props.label - Label hiển thị
 * @param {string} props.placeholder - Placeholder cho input
 * @param {string} props.type - Type của input (text, number, email, password, etc.)
 * @param {boolean} props.required - Field có bắt buộc không
 * @param {Object} props.rules - Validation rules từ react-hook-form
 * @param {boolean} props.disabled - Disable input
 * @param {string} props.className - Custom className cho wrapper
 * @param {string} props.inputClassName - Custom className cho input
 * @param {React.ReactNode} props.helperText - Text hướng dẫn hiển thị dưới input
 *
 * @example
 * <FormField
 *   name="email"
 *   control={control}
 *   label="Email"
 *   type="email"
 *   placeholder="Nhập email"
 *   required
 *   rules={{
 *     pattern: {
 *       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
 *       message: "Email không hợp lệ"
 *     }
 *   }}
 * />
 */
export const FormField = ({
  name,
  control,
  label,
  placeholder,
  type = "text",
  required = false,
  rules = {},
  disabled = false,
  className,
  inputClassName,
  helperText,
  ...rest
}) => {
  // Merge required rule
  const validationRules = {
    ...rules,
    ...(required && {
      required: rules.required || `${label || "Trường này"} là bắt buộc`,
    }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("grid gap-2", className)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            className={inputClassName}
            {...rest}
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error.message}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          )}
        </div>
      )}
    />
  );
};

/**
 * FormTextarea component - Textarea với react-hook-form
 */
export const FormTextarea = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  rules = {},
  disabled = false,
  className,
  rows = 4,
  helperText,
  ...rest
}) => {
  const validationRules = {
    ...rules,
    ...(required && {
      required: rules.required || `${label || "Trường này"} là bắt buộc`,
    }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("grid gap-2", className)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}
          <textarea
            {...field}
            id={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            {...rest}
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error.message}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          )}
        </div>
      )}
    />
  );
};

/**
 * FormSelect component - Select với react-hook-form
 */
export const FormSelect = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  rules = {},
  disabled = false,
  className,
  options = [],
  helperText,
  ...rest
}) => {
  const validationRules = {
    ...rules,
    ...(required && {
      required: rules.required || `${label || "Trường này"} là bắt buộc`,
    }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("grid gap-2", className)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}
          <select
            {...field}
            id={name}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error.message}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          )}
        </div>
      )}
    />
  );
};

/**
 * FormCheckbox component - Checkbox với react-hook-form
 */
export const FormCheckbox = ({
  name,
  control,
  label,
  required = false,
  rules = {},
  disabled = false,
  className,
  helperText,
  ...rest
}) => {
  const validationRules = {
    ...rules,
    ...(required && {
      required: rules.required || `${label || "Trường này"} là bắt buộc`,
    }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({
        field: { value, onChange, ...field },
        fieldState: { error },
      }) => (
        <div className={cn("grid gap-2", className)}>
          <div className="flex items-center gap-2">
            <input
              {...field}
              type="checkbox"
              id={name}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              {...rest}
            />
            {label && (
              <Label htmlFor={name} className="cursor-pointer">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error.message}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormField;
