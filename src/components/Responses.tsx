import { useEffect, useState } from "react"
import { useRouter } from "next/router"

interface IResponse {
  label: string
  value: string | number | boolean | null
}

interface IResponsesData {
  responses: IResponse[]
}

const FormResponsesPage = () => {
  const router = useRouter()
  const { formId } = router.query
  const [responses, setResponses] = useState<IResponsesData[]>([])

  useEffect(() => {
    const fetchResponses = async () => {
      if (!formId) return

      try {
        const response = await fetch(`/api/responses/${formId}`)
        const data = await response.json()

        if (response.ok) {
          setResponses(data.data)
        } else {
          console.error("Failed to fetch responses:", data.error)
        }
      } catch (error) {
        console.error("Error fetching responses:", error)
      }
    }

    fetchResponses()
  }, [formId])

  return (
    <div>
      <h1>Responses for Form {formId}</h1>
      {responses.map((response, index) => (
        <div key={index}>
          <h2>Response {index + 1}</h2>
          {response.responses.map((field, idx) => (
            <p key={idx}>
              {field.label}: {field.value}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

export default FormResponsesPage
