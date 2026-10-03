import Link from "next/link";
import { Button } from "@/shared/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-20">
      <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-primary uppercase">Missing page</p>
      <h1 className="font-heading text-4xl">That lesson is not on the path.</h1>
      <p className="leading-7 text-muted-foreground">
        The address does not match a lesson in the catalog. The path still starts at the beginning.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="self-start">
        Back to the path
      </Button>
    </div>
  );
}
