'use client'
import { useUser } from "@/components/UserProvider";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";


export default function History() {
    const { historyData } = useUser() || {};

    if (!historyData) {
        return <div>Loading...</div>; 
    }

    return (
        <Card className="mt-8 mx-4">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
                <CardDescription className="text-sm text">View your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={historyData} />
            </CardContent>
        </Card>
    );
}