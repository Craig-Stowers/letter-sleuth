const generateRandomSequenceFromSeed = (limit) => {
   function seededRandom(seed) {
      var m = 0x80000000,
         a = 1103515245,
         c = 12345;

      seed = seed & (m - 1);
      return function () {
         seed = (a * seed + c) % m;
         return seed / (m - 1);
      };
   }

   function shuffleArray(array, seed) {
      const random = seededRandom(seed);
      for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
      }
   }

   function generateSequence(seed, count) {
      const sequence = Array.from({ length: count }, (_, i) => i);
      shuffleArray(sequence, seed);
      return sequence;
   }

   // Example usage:
   const seed = 12345; // This seed ensures the sequence can be regenerated
   const count = limit; // Total number of indexes/words
   const sequence = generateSequence(seed, count);

   // Output the first 10 elements of the sequence as an example
   return sequence;
};

export default generateRandomSequenceFromSeed;
