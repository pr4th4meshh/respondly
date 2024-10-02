"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ResponseChart from "../_components/ResponseChart";

interface FormField {
  label: string;
  type: string;
  options?: string[];
}

interface FormResponse {
  _id: string;
  label: string;
  value: string | number;
}

interface FormData {
  _id: string;
  title: string;
  fields: FormField[];
  responses: FormResponse[];
}

const ResponsePage: React.FC<{ params: { formId: string } }> = ({ params }) => {
  const formId = params.formId;
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      if (formId) {
        try {
          const response = await axios.get(`/api/forms/${formId}`);
          setForm(response.data.data); // Fetching form details
        } catch (error) {
          console.error("Error fetching form:", error);
        }
      }
    };

    fetchFormData();
  }, [formId]);

  useEffect(() => {
    const fetchResponses = async () => {
      if (formId) {
        try {
          const response = await axios.get(`/api/response/${formId}`);
          setFormData(response.data);
        } catch (err) {
          setError("Failed to fetch form data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResponses();
  }, [formId]);

  if (loading)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center">
        <AiOutlineLoading3Quarters aria-label="Loading.." className="animate-spin text-4xl" />
        <span className="ml-4 text-2xl">Loading, please wait...</span>
      </div>
    );

  if (error)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center">
        <div>
          <p className="text-3xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );

  // Show message if there are no responses
  if (formData?.data.length === 0)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center">
        <p className="text-3xl">This form hasn't got any responses yet.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-5xl font-bold mb-8 text-blue-300 text-center">
          {form?.title} Responses
        </h1>

        {/* Display responses for each field */}
        {form?.fields.map((field, index) => {
          const responseCounts: Record<string, number> = {}; // Count responses (for charts)
          const textResponses: string[] = []; // Store text responses

          // Count responses based on field type
          formData.data.forEach((response) => {
            const value = response.value as string; // Transform to string
            console.log("Field Label:", field.label); // Debugging output
            console.log("Response Label:", response.label); // Debugging output

            // Check if the response label matches the current field's label
            if (response.label === field.label) {
              if (field.type === 'text') {
                textResponses.push(value); // Add text response
              } else if (field.options?.includes(value)) {
                // Count responses based on options
                responseCounts[value] = (responseCounts[value] || 0) + 1; // Increment count for option
              }
            }
          });

          return (
            <div key={index} className="mb-8 p-4 bg-gray-800 rounded-md shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-200">
                {index + 1}. {field.label.charAt(0).toUpperCase() + field.label.slice(1)}
              </h2>
              
              {/* Displaying text responses */}
              {field.type === 'text' ? (
                <ul className="ml-4 mt-2 list-disc list-inside">
                  {textResponses.length > 0 ? (
                    textResponses.map((response, i) => (
                      <li key={i} className="text-lg">{response}</li>
                    ))
                  ) : (
                    <li className="text-lg">No responses recorded.</li>
                  )}
                </ul>
              ) : (
                // Displaying count responses in chart
                <ResponseChart responseCounts={responseCounts} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsePage;