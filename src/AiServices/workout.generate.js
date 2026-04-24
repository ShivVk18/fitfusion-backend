import { ApiError } from "../config/ErrorHandler.js";
import { ai } from "../utils/aiConnect.js";


const generateWorkoutPlan = async (profile,DaysPerWeek) => {
const prompt = `You are a certified professional gym trainer and fitness expert.

Your task is to generate a personalized, structured weekly workout plan based on the user's details.

### USER DETAILS:
- Age: ${profile.age}
- Weight: ${profile.Weight} kg
- Height: ${profile.Height} cm
- Goal: ${profile.FitnessGoal}
- Experience Level: ${profile.ExperienceLevel}
- Workout Days per Week: ${DaysPerWeek}
- Injuries or Physical Limitations: ${profile.Injuries || "none"}

### INSTRUCTIONS:
- Create a ${DaysPerWeek}-day workout split
- Each day must have a clear focus (e.g., Chest & Triceps, Push, Pull, Legs, Full Body, etc.)
- Include exercises with:
  - Name
  - Sets
  - Reps
  - Rest time (in seconds)
- Ensure proper balance of all major muscle groups across the week
- Apply progressive overload principles
- Adapt exercises based on experience level:
  - Beginner → machines / basic movements
  - Intermediate → mix of compound + isolation
  - Advanced → compound-heavy with intensity techniques
- STRICTLY avoid exercises that may worsen the given injuries
- Keep workouts realistic and gym-friendly

### OUTPUT RULES:
- Return ONLY valid JSON
- Do NOT include explanations, text, or markdown
- Ensure JSON is properly formatted and parsable
- Ensure all keys and values are enclosed in double quotes

### OUTPUT FORMAT:
{
  "plan_name": "",
  "split_type": "",
  "duration": "",
  "days": [
    {
      "day": "Day 1",
      "focus": "",
      "exercises": [
        {
          "name": "",
          "sets": "",
          "reps": "",
          "rest": ""
        }
      ]
    }
  ]
}` 

try {
    const response = await ai.models.generateContent({
        model:'gemini-2.0-flash',
        contents:prompt,
        config:{
            temperature:0.7,
            maxOutputTokens:2500
        }
    })

    console.log("AI Response:", response.text)

    return response.text
} catch (error) {
    throw new ApiError(500,"Failed to generate workout plan")
}
}

export {
    generateWorkoutPlan
}