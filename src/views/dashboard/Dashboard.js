import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'

const Dashboard = () => {
  const [data, setData] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const csvFilePath = '/exports.csv'
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        setData(result.data)
        setLoading(false)
      },
    })
  }, [])
  const labels = data && data[0] ? Object.keys(data[0]).filter((key) => /^\d{4}$/.test(key)) : []
  const countries = [...new Set(data.map((item) => item.country))].filter(Boolean)
  const datasets = countries
    .filter((country) => country !== null)
    .map((country, index) => {
      const countryData = data.filter((item) => item.country === country)
      const countryDataArray = labels.map((year) => countryData[0][year])
      return {
        label: country,
        data: countryDataArray,
        backgroundColor: 'rgba(75, 192, 192, 0.2',
        borderColor: 'rgba(${index * 50}, 192, 192, 1)',
        fill: false,
      }
    })
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        display: true,
        align: 'start',
        labels: {
          boxWidth: 20,
          fontSize: 14,
        },
      },
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return formatYAxisTick(value)
          },
          // maxTicksLimit: 50,
          // stepSize: 100000000000,
          // max: 600000000000,
        },
      },
    },
    elements: {
      line: {
        tension: 0.0,
      },
      point: {
        radius: 2,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
  }
  console.log('datasets: ', datasets)
  const [activeLines, setActiveLines] = useState(countries.map((country) => country)) // Initialize all lines as active
  const chartData = {
    labels,
    datasets: datasets,
  }
  const random = () => Math.round(Math.random() * 100)
  const hardData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [random(), random(), random(), random(), random(), random(), random()],
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [random(), random(), random(), random(), random(), random(), random()],
      },
    ],
  }
  console.log('labels: ', labels)
  console.log('countries: ', countries)
  console.log('chartData: ', chartData)
  console.log('hardData: ', hardData)

  function formatYAxisTick(value) {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B'
    }
    return value
  }

  return (
    <CRow>
      <CCol xs={12}>
        <DocsCallout
          name="Chart"
          href="components/chart"
          content="React wrapper component for Chart.js 3.0, the most popular charting library."
        />
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Data1',
                    backgroundColor: '#g27979',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                  {
                    label: 'Data2',
                    backgroundColor: '#f87978',
                    data: [30, 50, 18, 19, 30, 30, 39, 60, 40],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Line Chart</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                  {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar data={chartData} options={options} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Line Chart</CCardHeader>
          <CCardBody>
            <CChartLine data={chartData} options={options} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard
