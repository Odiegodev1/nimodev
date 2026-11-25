import {
    Card,
    CardContent,
    CardHeader,
  } from "@/components/ui/card"
  
  import { Skeleton } from "@/components/ui/skeleton"
  
  export function StatsCardSkeleton() {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-0">
              <Skeleton className="h-3 w-28" />
  
              <Skeleton className="size-9 rounded-xl" />
            </CardHeader>
  
            <CardContent className="px-5 pt-4 pb-5">
              <Skeleton className="h-10 w-24" />
  
              <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4">
                <Skeleton className="size-2 rounded-full" />
  
                <Skeleton className="h-3 w-36" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }