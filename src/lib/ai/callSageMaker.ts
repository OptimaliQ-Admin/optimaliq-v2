// src/lib/ai/callSageMaker.ts

export async function callSageMaker(inputVector: number[]) {
  try {
    const response = await fetch('/api/ml_score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strategy_score: inputVector[0],
        process_score: inputVector[1],
        technology_score: inputVector[2],
        industry: inputVector.slice(3).indexOf(1) // Convert one-hot encoding back to industry index
      }),
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.score;
  } catch (error) {
    console.error('Error calling ML API:', error);
    throw error;
  }
}
