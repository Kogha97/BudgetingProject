import React from 'react';
import { useContext } from 'react';
import { BudgetContext } from '../Context/budgetContext';


export default function BudgetGrid() {
    const { budgetData } = useContext(BudgetContext);
  
    const getColor = (current, target) => {
      const currentVal = parseFloat(current || '0');
      const targetVal = parseFloat(target || '0');
      return currentVal > targetVal ? 'red' : 'green';
    };
  
    return (
      <div className='budgetContainer'>
        <h3>Budget Target</h3>
        <div className='budgetGrid'>
          <div className='budgetGridHeader'>
            <div>Name</div>
            <div>Current</div>
            <div>Target</div>
          </div>
          {budgetData.map(({ name, current, target }, index) => (
            <div key={index} className='budgetGridRow'>
              <div>{name}</div>
              <div>{current}</div>
              <div style={{ color: getColor(current, target) }}>{target}</div>
            </div>
          ))}
        </div>
      </div>
    );
}