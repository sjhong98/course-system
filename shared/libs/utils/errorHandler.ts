import { toast } from 'react-toastify'

export const errorHandler = (error: Error) => {
  if (error instanceof Error) {
    console.log(error)
    toast.error(error.message)
  }
}
