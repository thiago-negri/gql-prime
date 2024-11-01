function utilsGroupByUnique<A, K>(as: A[], f: (a: A) => K): Map<K, A> {
  const map = new Map<K, A>();
  for (const a of as) {
    const k = f(a);
    map.set(k, a);
  }
  return map;
}

export default utilsGroupByUnique;
