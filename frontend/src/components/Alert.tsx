import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { CheckCircledIcon } from "@radix-ui/react-icons"

export default function MyAlert({ message, type }) {
    return (
        <Alert variant="destructive" className="mb-4">
        {type === "error" ? <ExclamationTriangleIcon /> : <CheckCircledIcon />}
        <div>
            <AlertTitle>{type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </div>
        </Alert>
    )
}
