function RequiredLabel({
  htmlFor,
  text,
  required,
}: {
  htmlFor: string;
  text: string;
  required: boolean;
}) {
  return (
    <label htmlFor={htmlFor}>
      {text}
      {required && <span style={{ color: "red" }}>*</span>}
    </label>
  );
}

export default RequiredLabel;
