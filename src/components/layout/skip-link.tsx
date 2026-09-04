type SkipLinkProps = {
  href?: string;
  label: string;
};

export function SkipLink({ href = '#main-content', label }: SkipLinkProps) {
  return (
    <a href={href} className="skip-link">
      {label}
    </a>
  );
}
