import React, { act, useReducer } from "react";
import { useState } from "react";
import './App.css';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if(!operand) return;
  const [integer, fraction] = operand.split('.');
  if(operand.includes('.') && !fraction) return `${INTEGER_FORMATTER.format(integer)}.`
  if(!fraction) return `${INTEGER_FORMATTER.format(integer)}`;
  return `${INTEGER_FORMATTER.format(integer)}.${fraction}`;
}

function reducer(state, action) {
  switch(action.type){
    case ACTIONS.EVALUATE:
      if(!state.currentOperand) return state; 
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: '',
        currentOperand: ''
      }


    case ACTIONS.ADD_DIGIT:
      if(action.payload.digit === '0' && state.currentOperand === '0') {return state}
      if(action.payload.digit === '.' && state.currentOperand.includes('.')) {return state}
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${action.payload.digit}`
      }


    case ACTIONS.CLEAR:
      if(!state.currentOperand) return {};
      return { 
        ...state, 
        currentOperand: ''
      }  


    case ACTIONS.DELETE_DIGIT:
      return {
        ...state, 
        currentOperand: state.currentOperand.slice(0, state.currentOperand.length-1)
      }  

      
    case ACTIONS.CHOOSE_OPERATION:
      if(!state.currentOperand && !state.previousOperand) return state;
      if(state.previousOperand && !state.operation && !state.currentOperand){
        return {
          ...state,
          operation: action.payload.operation
        }
      }
      if(state.previousOperand && !state.operation){
        return {
          previousOperand: state.currentOperand,
          operation: action.payload.operation,
          currentOperand: ''
        }
      }
      if(!state.currentOperand && state.operation){
        return {
          ...state,
          operation: action.payload.operation
        }
      }
      if(!state.previousOperand){
        return {       
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: ''
        }
      }
      return {
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: ''
      }  
  }  
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let evaluation = ''
  if(!prev || !current) return evaluation;

  switch(operation){
    case '+':
      evaluation = `${prev + current}`;
      break;
    case '-':
      evaluation = `${prev - current}`;
      break;
    case '*':
      evaluation = `${prev * current}`;
      break;
    case '/':
      evaluation = `${prev / current}`;      
      break;
  }
  return evaluation;
} 


const App = () => {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: {} })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT, payload: {} })}>DEL</button>

      <OperationButton dispatch={dispatch} operation={'/'} />

      <DigitButton dispatch={dispatch} digit={1} />
      <DigitButton dispatch={dispatch} digit={2} />
      <DigitButton dispatch={dispatch} digit={3} />

      <OperationButton dispatch={dispatch} operation={'*'} />

      <DigitButton dispatch={dispatch} digit={4} />
      <DigitButton dispatch={dispatch} digit={5} />
      <DigitButton dispatch={dispatch} digit={6} />

      <OperationButton dispatch={dispatch} operation={'+'} />

      <DigitButton dispatch={dispatch} digit={7} />
      <DigitButton dispatch={dispatch} digit={8} />
      <DigitButton dispatch={dispatch} digit={9} />

      <OperationButton dispatch={dispatch} operation={'-'} />

      <DigitButton dispatch={dispatch} digit={'.'} />
      <DigitButton dispatch={dispatch} digit={0} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: {} })}>=</button>
    </div>
  )
}
export default App;
