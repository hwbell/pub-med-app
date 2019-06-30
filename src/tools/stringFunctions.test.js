import {
  sliceNearestChar,
  makeRandomString
} from './stringFunctions';

describe('stringFunctions.js', () => {

  it('should return a string of the specified length', () => {
    let result = makeRandomString(10);
    expect(result.length).toEqual(10)
    expect(typeof (result)).toEqual('string')
  })

  it('should return the provided string sliced at the closest provided char, at or preceeding the provided index', () => {
    let str = "Hey, could you, you know, do the dishes, once in a while, dude?"
    let slicedStr = sliceNearestChar(str, ',', 16);
    expect(slicedStr.length).toBeLessThan(17);
    expect(slicedStr).toEqual('Hey, could you');

    slicedStr = sliceNearestChar(str, ',', 30);
    expect(slicedStr.length).toBeLessThan(31);
    expect(slicedStr).toEqual('Hey, could you, you know');
  })
})