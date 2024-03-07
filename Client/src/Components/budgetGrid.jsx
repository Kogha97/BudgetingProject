import React, { useContext, useState } from 'react';
import { BudgetContext } from '../Context/budgetContext';
import { UserContext } from '../Context/userContext';
import axios from 'axios'

export default function BudgetGrid() {
    const { budgetData, fetchBudgetData } = useContext(BudgetContext);
    const { user } = useContext(UserContext);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);
    const [editTargetAmount, setEditTargetAmount] = useState('');


      console.log(budgetData)



    const getColor = (current, target) => {
        const currentVal = parseFloat(current || '0');
        const targetVal = parseFloat(target || '0');
        return currentVal > targetVal ? 'red' : 'green';
    };

    const handleUpdateTarget = async (categoryName, newTargetAmount) => {
      
      const userId = user._id

      if(isSubmitting) return;
      setIsSubmitting(true)
      try {
        const response = await axios.put(`http://localhost:5001/users/${userId}/budgetTargets`,{
          categoryName,
          targetAmount: newTargetAmount
        });

        console.log('reponse from updating budget target', response.data)
        setIsSubmitting(false)

      } catch (error) {
        console.log('Error updating budget target:', error.response ? error.response.data : error.message)
        setIsSubmitting(false)
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
                        <div 
                            onClick={() => {
                                setEditingCategory(name);
                                setEditTargetAmount(target);
                            }}
                            style={{ color: getColor(current, target) }}
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
                            <span>{target}</span>
                          )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
