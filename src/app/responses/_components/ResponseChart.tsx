import React from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, SubTitle } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend, SubTitle)

interface ResponseChartProps {
  responseCounts: Record<string, number>
}

const ResponseChart: React.FC<ResponseChartProps> = ({ responseCounts }) => {
  // preparing data for Pie Chart
  const pieChartData = {
    labels: Object.keys(responseCounts),
    datasets: [
      {
        label: "Responses",
        data: Object.values(responseCounts),
        backgroundColor: [
          "#fd151b",
          "#ffb30f",
          "#35a7ff",
          "#04e762",
          "#a1ff0a",
          "#580aff",
          "#ffd300",
          "#f050ae",
          "#97cc04",
          "#99cc33",
        ],
      },
    ],
  }

  return (
    <div className="mt-4 w-[300px] h-full">
      <h3 className="text-lg text-center">Response Distribution</h3>
      {Object.keys(responseCounts).length > 0 ? (
        <Pie data={pieChartData} />
      ) : (
        <p className="text-center">No responses for this question.</p>
      )}
    </div>
  )
}

export default ResponseChart
