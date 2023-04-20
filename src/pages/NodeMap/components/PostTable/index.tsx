import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import { getPostListData } from 'api/Post';

interface PostTableProps {
  OnClickedId: (id: number) => void;
}

function PostTable({ OnClickedId }: PostTableProps) {
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getPostListData();
      setRowData(res.data);
    };
    fetchData();
  }, []);

  const [columnDefs] = useState([
    { field: 'title' },
    { field: 'name' },
    { field: 'date' },
  ]);

  const onRowDataClicked = (params: CellClickedEvent) => {
    OnClickedId(params.data.id);
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{ width: 750, height: 550, margin: 'auto auto' }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          minWidth: 100,
          width: 300,
          flex: 1,
        }}
        onCellClicked={onRowDataClicked}
      ></AgGridReact>
    </div>
  );
}

export default PostTable;