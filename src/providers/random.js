import { createContext, useContext } from 'react';
import { create } from 'random-seed';

const RandomContext = createContext({});

export const RandomProvider = RandomContext.Provider;
export function useRandom() {
  const randomSeed = useContext(RandomContext)
  return create(randomSeed);
};

export function useShuffled(array) {
  const rng = useRandom();

  const arrayCopy = JSON.parse(JSON.stringify(array));

  var currentIndex = arrayCopy.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = rng.intBetween(0, currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arrayCopy[currentIndex];
    arrayCopy[currentIndex] = arrayCopy[randomIndex];
    arrayCopy[randomIndex] = temporaryValue;
  }

  return arrayCopy;
}
