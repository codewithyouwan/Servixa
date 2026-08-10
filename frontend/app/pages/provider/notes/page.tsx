import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notes, noteTags } from "../data/notes";
import { NotesGrid } from "./components/notes-grid";

export default function NotesPage() {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search notes..." className="pl-8" />
        </div>
        <Button className="ml-auto">
          <Plus data-icon="inline-start" />
          New note
        </Button>
      </div>
      <NotesGrid notes={notes} tags={noteTags} />
    </>
  );
}
