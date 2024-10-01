import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {

    return (
        <div className="grid grid-cols-[55%_45%] min-h-screen font-sans">
            <div className="flex flex-col items-center pt-20">
                <Skeleton className="w-10 h-10" />
                <div className="text-center flex flex-col gap-2 mt-7">
                    <Skeleton className="w-40 h-8" />
                    <Skeleton className="w-24 h-4" />
                </div>
                <form className="flex flex-col gap-1 mt-7">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-40 h-8" />
                        <Skeleton className="w-40 h-8" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-40 h-8" />
                        <Skeleton className="w-40 h-8" />
                    </div>
                    <Skeleton className="w-40 h-8" />
                    <Skeleton className="w-40 h-8" />
                </form>
            </div>
            <div className="bg-[url('/black_chart.svg')] bg-cover bg-center h-full rounded-tl-bl" />
        </div>
    );
}