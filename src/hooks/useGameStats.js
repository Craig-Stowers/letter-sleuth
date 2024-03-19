import { useMemo } from "react";

function calculateRuns(successData, successKeys, failKeys, daysElapsed) {
   // Extract keys and convert them to integers

   // Initialize variables to track the longest run
   let longestRun = 0;
   let currentRun = 0;
   let totalCompleted = 0;
   let totalSuccesses = 0;
   const distribution = {};

   for (let j = 1; j <= 6; j++) {
      if (!distribution[j]) distribution[j] = 0;
   }

   // Iterate through keys to find longest consecutive run
   for (let i = 0; i <= daysElapsed; i++) {
      if (successKeys.includes(i)) {
         currentRun++;
         totalCompleted++;
         totalSuccesses++;
         longestRun = Math.max(longestRun, currentRun);
         const attempts = successData[i].length;
         distribution[attempts]++;
      }
      if (failKeys.includes(i)) {
         totalCompleted++;
         currentRun = 0;
      }
   }

   return [longestRun, currentRun, distribution, totalCompleted, totalSuccesses];
}

export default function useGameStats(localData, daysElapsed) {
   const stats = useMemo(() => {
      if (!localData) return null;
      const successKeys = Object.keys(localData.success)
         .map(Number)
         .sort((a, b) => a - b)
         .filter((day) => day <= daysElapsed);

      const failKeys = Object.keys(localData.failure)
         .map(Number)
         .sort((a, b) => a - b)
         .filter((day) => day <= daysElapsed);

      // const totalSuccesses = successKeys.length;
      //const totalComplete = totalSuccesses + failKeys.length;

      const [longestStreak, currentStreak, distribution, totalCompleted, totalSuccesses] = calculateRuns(
         localData.success,
         successKeys,
         failKeys,
         daysElapsed
      );

      const filteredDistribution = { ...distribution };
      //delete filteredDistribution["-1"];

      return {
         totals: {
            "Games played": totalCompleted,
            "Win percentage": totalCompleted > 0 ? Math.round((totalSuccesses / totalCompleted) * 1000) / 10 : "/",
            "Current streak": currentStreak,
            "Longest streak": longestStreak,
         },
         distribution: filteredDistribution,
      };
   }, [localData, daysElapsed]);
   return stats;
}
