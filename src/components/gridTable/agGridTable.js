import { memo, useCallback, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import './agGridTable.css'

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const AgGridTable = memo(function AgGridTable(params) {
    const { rowData, filters } = params
    const gridRef = useRef();

    const columnDefs = [
        { field: 'groot_name' },
        { field: 'comments', editable: true },
        { field: 'normalized_application' },
        { field: 'normalized_hostname' },
        { field: 'instance_number' },
        { field: 'team' },
        { field: 'groot_status' },
        { field: 'groot_monitoring_state' },
        { field: 'groot_market' },
        { field: 'path' },
        { field: 'accounts' },
        { field: 'aal_server_status' },

    ];

    const gridOptions = {

        defaultColDef: {
            sortable: true,
            filter: 'agTextColumnFilter',
            resizable: true
        },
        enableSorting: true,
        suppressExcelExport: true,
        popupParent: document.body,
    };

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    const saveCSVData = useCallback(async () => {
        if(!window.confirm("Do you want to save file?"))
            return
        let data = gridRef.current.api.getDataAsCsv({
            suppressQuotes: true
        }).split('\r\n');
        data[0] = data[0].toLowerCase()
        data = data.join('\r\n')
        await fetch('http://localhost:8000/updateFile', {
            method: 'POST',
            body: JSON.stringify({
                fileData: data,
                fileParams: filters 
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then((res) => res.json())
        .then((res) => {
            if(res.isError){
                alert('Can not update file, please check details')
            }
            else{
                alert('File updated successfully')
            }
        })
        .catch((err) => {
            alert("Can not save file, please check console for error.")
            console.log("Can not save file", err)
        })
    }, [])

    return (
        <div className="agGridContainer">
            <div className="agGridButtons">
            <button onClick={onBtnExport}>Export CSV</button>
            <button onClick={saveCSVData}>Save to file</button>
            </div>
            <div className="ag-theme-alpine" style={{ height: 500 }}>
                <AgGridReact
                    className="agGridTable"
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    gridOptions={gridOptions}
                />
            </div>
        </div>
    )

})

export default AgGridTable;