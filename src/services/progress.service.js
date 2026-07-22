const weightTrend = (progress) => {
    if(progress.length < 2) return "No trend"

    const firstWeight = progress[0].weight
    const lastWeight = progress[progress.length - 1].weight

    if(lastWeight < firstWeight) return "Decreasing"
    if(lastWeight > firstWeight) return "Increasing"
    return "Stable"
}

const calculateWeeklyChange = (progress) => {
    if(progress.length < 2) return 0

    const firstWeight = progress[0].weight
    const lastWeight = progress[progress.length - 1].weight 

    const weeks = (new Date(progress[progress.length - 1].date) - new Date(progress[0].date)) / (1000 * 60 * 60 * 24 * 7)
    
    if(weeks === 0) return 0

    return (lastWeight - firstWeight) / weeks

}

const detectPlateau = (progress) => {
    if(progress.length < 4) return false

    const recentWeights = progress.slice(-4).map(p => p.weight)
    const maxWeight = Math.max(...recentWeights)
    const minWeight = Math.min(...recentWeights)

    return (maxWeight - minWeight) < 0.5
}

const analyzeStrength = (progress) => {
    if(progress.length < 2) return "No strength data"

    const firstChest = progress[0].chest
    const lastChest = progress[progress.length - 1].chest

    const firstBiceps = progress[0].biceps
    const lastBiceps = progress[progress.length - 1].biceps

    const chestTrend = lastChest > firstChest ? "Increasing" : (lastChest < firstChest ? "Decreasing" : "Stable")
    const bicepsTrend = lastBiceps > firstBiceps ? "Increasing" : (lastBiceps < firstBiceps ? "Decreasing" : "Stable")

    return { chestTrend, bicepsTrend }
} 

const generateBasicRecommendations = (progress) => {
    const weightTrendResult = weightTrend(progress)
    const weeklyChange = calculateWeeklyChange(progress)
    const plateau = detectPlateau(progress)
    const strengthAnalysis = analyzeStrength(progress)

    let recommendations = []

    if(weightTrendResult === "Increasing"){
        recommendations.push("Consider reducing calorie intake or increasing cardio.")
    } else if(weightTrendResult === "Decreasing"){
        recommendations.push("Great job! Keep up the good work.")
    } else {
        recommendations.push("Your weight is stable. Consider adjusting your routine for better results.")
    }

    if(weeklyChange > 0.5){
        recommendations.push("Your weekly weight change is quite high. Consider slowing down for sustainable progress.")
    } else if(weeklyChange < -0.5){
        recommendations.push("Your weekly weight change is quite low. Consider increasing intensity or adjusting diet.")
    }

    if(plateau){
        recommendations.push("You seem to be in a plateau. Consider changing your workout routine or diet to break through.")
    }

    if(strengthAnalysis.chestTrend === "Increasing"){
        recommendations.push("Your chest strength is improving. Keep focusing on chest exercises.")
    } else if(strengthAnalysis.chestTrend === "Decreasing"){
        recommendations.push("Your chest strength is declining. Consider adding more chest-focused workouts.")
    }

    if(strengthAnalysis.bicepsTrend === "Increasing"){
        recommendations.push("Your biceps strength is improving. Keep up the good work.")
    }               else if(strengthAnalysis.bicepsTrend === "Decreasing"){ 
        recommendations.push("Your biceps strength is declining. Consider adding more biceps-focused workouts.")
    }
     
    return recommendations
}

export {weightTrend, calculateWeeklyChange, detectPlateau, analyzeStrength, generateBasicRecommendations}