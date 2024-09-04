import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircleIcon } from "@radix-ui/react-icons"

export default function PositiveAlert({ message }) {
    return (
        <Alert variant="success" className="mb-4">
        <CheckCircleIcon />
        <div>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </div>
        </Alert>
    )
}