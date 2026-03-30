import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input, InputProps } from '@/components/ui/input';

export function InputField({
  label,
  description,
  inputProps,
  className,
}: {
  label?: string;
  description?: string;
  inputProps: InputProps;
  className?: string;
}) {
  const { id, ...rest } = inputProps;
  return (
    <Field className={className}>
      {label != null && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Input id={id} {...rest} />
      {description != null && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
