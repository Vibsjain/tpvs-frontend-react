import { memo, useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import * as constants from './constants'
import * as helpers from './utils/helper'
import SelectComponent from './components/selectComponent/selectComponent'
import AgGridTable from "./components/gridTable/agGridTable";
import './visualizer.css'


const TopologyVisualizer = memo(function TopologyVisualizer(params) {
  const [filters, setfilters] = useState({
    date: helpers.getCurrentDate(),
    interval: 1,
    application: 'ORDER_ENTRY_SERVER',
    reportType: 'csv',
    team: 'Ansatz',
    graphType: 'dot',
  })

  const [result, setResult] = useState({
    isHTML: false,
    htmlData: '',
    csvData: '',
    isError: false,
    error: '',
  })

  const [rowData, setRowData] = useState()

  const { readString } = usePapaParse()

  const setTeam = (event) => {
    event.preventDefault();
    setfilters({
      ...filters,
      team: event.target.value
    })
  }

  useEffect(() => {
    evalScript()
  })

  const setApplication = (event) => {
    event.preventDefault();
    setfilters({
      ...filters,
      application: event.target.value.replaceAll(' ', '_')
    })
  }

  const setDate = (event) => {
    event.preventDefault();
    setfilters({
      ...filters,
      date: event.target.value
    })
  }

  const setReportType = (event) => {
    event.preventDefault();
    setfilters({
      ...filters,
      reportType: event.target.value.toLowerCase()
    })
  }

  const setGraphType = (event) => {
    event.preventDefault();
    setfilters({
      ...filters,
      graphType: event.target.value.toLowerCase()
    })
  }

  const handleReadString = () => {
    readString(result.csvData, {
      worker: true,
      complete: (result) => {
        if (result.errors.length)
          console.log(result.errors)
        else {
          setRowData(result.data)
        }
      },
      header: true,
      dynamicTyping: true,
      newline: '\r\n',
      delimiter: ','
    })
  }

  const evalScript = () => {
    const scripts = document.querySelectorAll('script')
    scripts.forEach(script => {
      window.eval(script.innerText)
    })
  }

  const fetchFile = async (event) => {
    event.preventDefault()
    await fetch('http://localhost:8000/fetchFile', {
      method: 'POST',
      body: JSON.stringify(filters),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (filters.reportType === 'html') {
          setResult({
            ...result,
            isHTML: true,
            htmlData: res.data
          })
        } else {
          setResult({
            ...result,
            isHTML: false,
            csvData: res.data
          })
        }
      })
      .then(() => {
        if(!result.isHTML)
          handleReadString()
      })
      .catch((err) => {
        setResult({
          ...result,
          isError: true,
          error: err
        })
      })
  }

  const fetchPrevTopology = async (event) => {
    event.preventDefault();
    if (filters.interval === 1)
      setfilters({
        ...filters,
        date: helpers.getPrevDate(filters.date)
      })
    else
      setfilters({
        ...filters,
        interval: filters.interval -= 1
      })
  }

  return (
    <div>
      <div className="visualizerHeader">
      <button onClick={fetchPrevTopology}>{`<`}</button>
      <form>
        <input className="detailFormDate" type="date" value={filters.date} onChange={setDate} />
        <SelectComponent
          label="Team Name"
          options={constants.TEAMNAME}
          onChange={setTeam}
        />
        <SelectComponent
          label="Application"
          options={constants.APPLICATIONS}
          onChange={setApplication}
        />
        <SelectComponent
          label="Report Type"
          options={constants.REPORT_TYPE}
          onChange={setReportType}
        />
        {filters.reportType === "html" &&
          <SelectComponent
            label="Graph Type"
            options={constants.GRAPH_TYPE}
            onChange={setGraphType}
          />}
        <button onClick={fetchFile}>Fetch Details</button>
      </form>
      <button>{`>`}</button>
      </div>
      {result.isHTML && result.isError === false && result.htmlData &&
        <div dangerouslySetInnerHTML={{ __html: result.htmlData }}>
        </div>
      }
      {result.isHTML === false &&
        result.isError === false &&
        result.csvData &&
        <AgGridTable
          rowData={rowData}
          filters={filters}
        />}
    </div>
  )
})

export default TopologyVisualizer;