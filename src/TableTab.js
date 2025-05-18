import React, { useState } from 'react';
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import DisplayPerceptron from './AI_Models/displayPerceptron.js';
import TrainKnn from './AI_Models/trainKnn.js';
import AnnTrainerApp from './AI_Models/trainAnn.js'
import OlsRegressionApp from './AI_Models/trainOls.js'

export default function TableTabExample() {
  const [tab, setTab] = useState(0);
  const handleChange = (_, newValue) => setTab(newValue);
  const headerStyle = { fontSize:'1.5rem', color:'#fff','&.Mui-selected': {color: '#00ccff',}}

  return (
    <Box sx={{ width: '100%'}}>
      <Tabs value={tab} onChange={handleChange} sx={{ background:'#003366',padding:'1rem', position: 'sticky',top: 0, zIndex: 1000,}}  TabIndicatorProps={{style: {backgroundColor: '#00ccff' // สีเส้นขีดใต้ tab ที่เลือก
    }
  }}>
        <Tab label="Perceptron" sx={headerStyle}/>
        <Tab label="K-NN" sx={headerStyle}/>
        <Tab label="A-NN" sx={headerStyle}/>
        <Tab label="OLS" sx={headerStyle}/>
      </Tabs>

      {tab === 0 && <DisplayPerceptron/>}
      {tab === 1 && <TrainKnn/>}
      {tab === 2 && <AnnTrainerApp/>}
      {tab === 3 && <OlsRegressionApp/>}
    </Box>
  );
}