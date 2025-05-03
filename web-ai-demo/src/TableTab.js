import React, { useState } from 'react';
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import DisplayPerceptron from './AI_Models/displayPerceptron.js';
import TrainKnn from './AI_Models/trainKnn.js';
import AnnTrainerApp from './AI_Models/trainAnn.js'
import OlsRegressionApp from './AI_Models/trainOls.js'

export default function TableTabExample() {
  const [tab, setTab] = useState(0);
  const handleChange = (_, newValue) => setTab(newValue);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Perceptron" />
        <Tab label="K-NN" />
        <Tab label="A-NN"/>
        <Tab label="OLS"/>
      </Tabs>

      {tab === 0 && <DisplayPerceptron/>}
      {tab === 1 && <TrainKnn/>}
      {tab === 2 && <AnnTrainerApp/>}
      {tab === 3 && <OlsRegressionApp/>}
    </Box>
  );
}