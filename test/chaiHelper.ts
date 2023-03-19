import chai from 'chai';

export function objValues(
  obj: { [key: string]: any },
  mapFunc: (val: any, key?: string) => any
): any {
  return Object.keys(obj)
    .filter((key) => key.match(/^[\d_]/) == null)
    .reduce(
      (set, key) => ({
        ...set,
        [key]: mapFunc(obj[key], key),
      }),
      {}
    );
}

export function cleanValue(val: any): any {
  if (val == null) return val;
  if (Array.isArray(val)) {
    if (val.length * 2 === Object.keys(val).length) {
      return objValues(val, cleanValue);
    }
    return val.map((val1) => cleanValue(val1));
  }

  const str = val.toString();
  if (str !== '[object Object]') {
    return str;
  }

  return objValues(val, cleanValue);
}

chai.Assertion.overwriteMethod('eql', (original) => {
  return function (this: any, expected: any) {
    const _actual = cleanValue(this._obj);
    const _expected = cleanValue(expected);
    this._obj = _actual;
    original.apply(this, [_expected]);
  };
});
