import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to load data</AlertTitle>
      <AlertDescription>
        {message}
        <span className="block mt-1 text-xs opacity-80">
          Ensure the API server is running on port 8000 and the notebook has been executed.
        </span>
      </AlertDescription>
    </Alert>
  );
}
