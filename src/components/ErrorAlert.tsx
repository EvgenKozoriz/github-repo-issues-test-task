import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react"

interface ErrorAlertProps {
    alertType: string;
    description: string;
  }

const ErrorAlert:React.FC<ErrorAlertProps> = ({alertType, description}) => {
  return (
    <Alert status="error">
    <AlertIcon />
    <AlertTitle>{alertType} Error</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
  )
}

export default ErrorAlert