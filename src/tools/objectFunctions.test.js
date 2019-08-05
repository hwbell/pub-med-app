import { combineObjects } from './objectFunctions';

describe('objectFunctions', () => {

  const userOne = {
    name: 'mark', 
    age: 24,
    id: '02390923',
    occupation: 'farmer',
  }

  const userTwo = {
    residence: 'Denver',
    name: 'dave', 
    age: 28,
    id: '343535',
    occupation: 'golfer',
    hobby: 'golf',
    music: 'rock!'
  }

  it('should combine obj1 and obj2 with priority to obj1', () => {
    // use the keys from userTwo, these are the same as userOne except for the added ones
    let keys = Object.keys(userTwo);

    // add one on that isnt on either user to make sure it gets set to ''
    keys.push('interests');
    let combined = combineObjects(userOne, userTwo, keys);

    expect(combined.name).toBe(userOne.name);
    expect(combined.age).toBe(userOne.age);
    expect(combined.id).toBe(userOne.id);
    expect(combined.occupation).toBe(userOne.occupation);

    expect(combined.hobby).toBe(userTwo.hobby);
    expect(combined.music).toBe(userTwo.music);
    expect(combined.interests).toBe('');
    
  })

})