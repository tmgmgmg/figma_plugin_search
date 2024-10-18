import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PluginCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-40" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="w-3/4 h-6 mb-2" />
        <Skeleton className="w-full h-4 mb-1" />
        <Skeleton className="w-5/6 h-4" />
      </CardContent>
      <CardFooter className="p-4 pt-0 w-full mt-auto">
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  );
}
