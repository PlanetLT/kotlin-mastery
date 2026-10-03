import Link from "next/link";
import { Button } from "@/shared/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-20">
      <p className="font-mono text-[11px] tracking-[0.18em] text-primary uppercase">Missing page</p>
      <h1 className="font-serif text-4xl tracking-tight">That lesson is not on the path.</h1>
      <p className="leading-7 text-muted-foreground">
        The address does not match a lesson in the catalog. The path still starts at the beginning.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="self-start font-mono">
        Back to the path
      </Button>
    </div>
  );
}
