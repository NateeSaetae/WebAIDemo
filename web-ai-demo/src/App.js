// App.jsx
import React, { useState } from 'react';
import DisplayPerceptron from './AI_Models/displayPerceptron.js';
import TrainKnn from './AI_Models/trainKnn.js';

export default function App() {
  return(
    <>
      <DisplayPerceptron/>
      <TrainKnn/>
    </>
  )
}
