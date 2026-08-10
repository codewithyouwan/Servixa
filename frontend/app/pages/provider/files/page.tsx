import {
  DraftingCompass,
  FileText,
  Folder,
  Image,
  Search,
  Sheet,
  Upload,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { folders, recentFiles, storage, type FileKind } from "../data/files";
import { FileRowActions } from "./components/file-row-actions";

const kindStyles: Record<FileKind, { icon: LucideIcon; className: string }> = {
  pdf: { icon: FileText, className: "bg-destructive/10 text-destructive" },
  image: { icon: Image, className: "bg-chart-2/15 text-chart-2" },
  doc: { icon: FileText, className: "bg-chart-1/15 text-chart-1" },
  sheet: { icon: Sheet, className: "bg-chart-4/15 text-chart-4" },
  cad: { icon: DraftingCompass, className: "bg-chart-5/15 text-chart-5" },
};

export default function FilesPage() {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search files..." className="pl-8" />
        </div>
        <Button className="ml-auto">
          <Upload data-icon="inline-start" />
          Upload
        </Button>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <section className="flex flex-col gap-3">
            <h2 className="font-heading text-base font-medium">Folders</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {folders.map((folder) => (
                <Card key={folder.id} size="sm">
                  <CardContent className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Folder className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {folder.files} files &middot; {folder.size}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <Card>
            <CardHeader>
              <CardTitle>Recent files</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="hidden md:table-cell">Owner</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Modified
                    </TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFiles.map((file) => {
                    const kind = kindStyles[file.kind];
                    return (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${kind.className}`}
                            >
                              <kind.icon className="size-4" />
                            </div>
                            <span className="max-w-52 truncate font-medium lg:max-w-64">
                              {file.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {file.size}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {file.owner}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {file.modified}
                        </TableCell>
                        <TableCell className="text-right">
                          <FileRowActions />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>{storage.usedLabel}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={storage.usedPercent} />
            <div className="flex flex-col gap-3">
              {storage.breakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span>{item.label}</span>
                  <span className="ml-auto text-muted-foreground">
                    {item.size}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
