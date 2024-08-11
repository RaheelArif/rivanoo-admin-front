import React, { useState } from 'react';
import UploadComments from '../../components/UploadComments';
import ResultsTable from '../../components/ResultsTable';



const Comments = () => {
  const [tableData, setTableData] = useState([]);

  return (
    <div className="App">
      <h1>Upload and Process File</h1>
      <UploadComments setTableData={setTableData} />
      <ResultsTable tableData={tableData} />
    </div>
  );
};

export default Comments;
