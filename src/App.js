import React from "react";
import ProductsTable from "./components/ProductsTable";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <div className="App">
      <AppLayout content={<ProductsTable />} />
    </div>
  );
}

export default App;
