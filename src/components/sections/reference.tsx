import { SectionTitle } from "@/components/section-title";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { API, SECTION } from "@/constants";

export function Reference() {
  return (
    <section className={SECTION}>
      <SectionTitle note="thirteen props, none required but one">
        Reference
      </SectionTitle>
      <div className="overflow-hidden rounded-lg bg-card ring-1 ring-border ring-inset">
        <Table className="text-[11px]">
          <TableBody>
            {API.map(([prop, type, def, desc]) => (
              <TableRow key={prop} className="hover:bg-muted/50">
                <TableCell className="py-2.5 font-mono tracking-normal whitespace-nowrap text-primary">
                  {prop}
                  {prop === "url" && (
                    <Badge
                      variant="outline"
                      className="ml-1.5 h-4 px-1.5 text-[9px]"
                    >
                      req
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-2.5 font-mono tracking-normal whitespace-nowrap text-muted-foreground">
                  {type}
                </TableCell>
                <TableCell className="py-2.5 font-mono tracking-normal whitespace-nowrap text-muted-foreground">
                  {def}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {desc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
