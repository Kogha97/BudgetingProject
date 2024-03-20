import React, { useContext, useEffect, useState } from 'react';
import { BudgetContext } from '../Context/budgetContext';
import { UserContext } from '../Context/userContext';
import axios from 'axios'

export default function BudgetGrid() {
    const { budgetData, fetchBudgetData, filter } = useContext(BudgetContext);
    const { user } = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editTargetAmount, setEditTargetAmount] = useState('');



    const getColor = (current, target) => {
    
      const currentVal = parseFloat(current || '0');
      const targetVal = parseFloat(target || '0');
      
      const percentage = (currentVal/targetVal) * 100
        if( percentage > 110) {
          return 'Maroon';
        } else if (percentage > 100 && percentage <= 110){
          return 'DarkGoldenRod';
        } else if(percentage >= 90 && percentage <= 100){
          return 'MediumSeaGreen';
        } else{
          return 'DodgerBlue'
        }
    };

    const handleUpdateTarget = async (categoryName, newTargetAmount) => {
      const userId = user._id;
    
      if (isSubmitting) return;
      setIsSubmitting(true);
    
      try {

        const response = await axios.put(
          `http://localhost:5001/users/${userId}/budgetTargets`,
          { categoryName, targetAmount: newTargetAmount }, // This is the payload
          { withCredentials: true } // This is the configuration
        );
    
        console.log('response from updating budget target', response.data);
        fetchBudgetData(); // Refresh data to reflect the update
      } catch (error) {
        console.error('Error updating budget target:', error.response ? error.response.data : error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
    

const handleKeyDown = async (e, name, targetAmount) => {
  if (e.key === 'Enter') {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!isSubmitting) {
      setIsSubmitting(true); 
      try {
        await handleUpdateTarget(name, targetAmount);
        console.log('Submission from Enter');
      } catch (error) {
        console.error('Error during submission:', error);
      } finally {
        setIsSubmitting(false); 
        setEditingCategory(null);
        await fetchBudgetData(); 
      }
    }
  }
};

const daysRemainingInMonth = () => {
  const date = new Date();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return (lastDayOfMonth.getDate() - date.getDate());
};


const daysLeft = daysRemainingInMonth();


useEffect(() => {
  fetchBudgetData(); 
}, [filter, fetchBudgetData]); 

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
                        <div  className='budgetGridRowDiv'
                            onClick={() => {
                                setEditingCategory(name);
                                setEditTargetAmount(target);
                            }}
                            
                        >
                          {editingCategory === name ? (
                          <input
                          type="number"
                          value={editTargetAmount}
                          onChange={(e) => setEditTargetAmount(e.target.value)}
                          onBlur={() => {
                            if (!isSubmitting) {
                              console.log('Handling onBlur');
                              handleUpdateTarget(name, editTargetAmount);
                            }
                          }}
                          onKeyDown={(e) => handleKeyDown(e, name, editTargetAmount)}
                          autoFocus
                        />
                          ) : (
                            <span style={{ background: getColor(current, target), color: 'white', opacity: '0.9', borderRadius:'50px',}}>{target}</span>
                          )}
                        </div>
                    </div>
                ))}
            </div>
            <div className='daysRemaining'>
              <p>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</p>
            </div>

        </div>

    );
}
