import {
    Card,
    CardHeader,
    CardContent,
  } from "@/components/ui/card"
  
  import { Skeleton } from "@/components/ui/skeleton"
  
  export function RecentActivitySkeleton() {
    return (
      <Card
        className="
          h-fit w-full xl:w-2/5
          gap-0 rounded-2xl
          border-border/60 bg-card/60
          py-0 shadow-none
        "
      >
        <CardHeader className="space-y-3 px-5 pt-5 pb-5">
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-lg" />
  
            <Skeleton className="h-4 w-32" />
          </div>
  
          <Skeleton className="h-3 w-4/5" />
        </CardHeader>
  
        <CardContent className="space-y-5 px-5 pb-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <Skeleton className="size-10 shrink-0 rounded-xl" />
  
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-3/4" />
  
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
  
          <Skeleton className="mt-4 h-10 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }