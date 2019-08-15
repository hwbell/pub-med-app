import { combineObjects, extractStringDate } from './objectFunctions';

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

  it('should extract a date string from a date object', () => {
    let date = new Date('December 17, 1995 03:24:00'); 
    let dateStr = extractStringDate(date);

    expect(dateStr).toBe('12-17-95 @ 3:24am');

    let date2 = new Date('November 20, 2017 13:43:00'); 
    let dateStr2 = extractStringDate(date2);

    expect(dateStr2).toBe('11-20-17 @ 1:43pm');

    let date3 = new Date('May 21, 2003 15:28:00'); 
    let dateStr3 = extractStringDate(date3);

    expect(dateStr3).toBe('5-21-03 @ 3:28pm');

    let date4 = new Date('January 09, 2019 10:05:00'); 
    let dateStr4 = extractStringDate(date4);

    expect(dateStr4).toBe('1-9-19 @ 10:05am');

  })

})