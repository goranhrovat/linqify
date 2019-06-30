# LINQify

[![Build Status](https://travis-ci.org/goranhrovat/linqify.svg?branch=master)](https://travis-ci.org/goranhrovat/linqify)
[![Coverage Status](https://coveralls.io/repos/github/goranhrovat/linqify/badge.svg)](https://coveralls.io/github/goranhrovat/linqify)
[![Known Vulnerabilities](https://snyk.io/test/github/goranhrovat/linqify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/goranhrovat/linqify?targetFile=package.json)
[![dependencies Status](https://david-dm.org/goranhrovat/linqify/status.svg)](https://david-dm.org/goranhrovat/linqify)
[![devDependencies Status](https://david-dm.org/goranhrovat/linqify/dev-status.svg)](https://david-dm.org/goranhrovat/linqify?type=dev)
![](https://img.shields.io/bundlephobia/minzip/linqify.svg)
![](https://img.shields.io/npm/types/linqify.svg)
![](https://img.shields.io/npm/l/linqify.svg)
[![NPM](https://img.shields.io/npm/v/linqify.svg)](https://www.npmjs.com/package/linqify)
[![Chat on Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/linqify/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

![](https://img.shields.io/npm/dependency-version/linqify/dev/rollup.svg)
![](https://img.shields.io/npm/dependency-version/linqify/dev/jest.svg)
![](https://img.shields.io/npm/dependency-version/linqify/dev/eslint.svg)
![](https://img.shields.io/npm/dependency-version/linqify/dev/prettier.svg)

JavaScript library for lazy querying Arrays, Maps, Sets, and Strings based on [LINQ (C#)](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/).

Provides List, Dictionary, HashSet, and Lookup with comparer for complex types.

Features:
  - lazy evaluation with generator functions,
  - extends native javascript Array, Set, Map, and String,
  - C# LINQ naming convention, which does not collide with native methods (e.g. concat and join),
  - includes typescript support in code editors.

## Usage

### Install
````shell
npm install linqify
````

### Node CommonJS module
```typescript
var {Enumerable, List, Dictionary, HashSet, EqualityComparers,
     SortComparers, linqify} = require('linqify');
```

### Node ES module
```typescript
import {Enumerable, List, Dictionary, HashSet, EqualityComparers,
        SortComparers, linqify} from 'linqify';
```

### Browser
#### Always get the latest version
```html
<script src="https://unpkg.com/linqify"></script>
```
#### Get the specific version
```html
<script src="https://unpkg.com/linqify@1.2.1"></script>
```
#### Get the latest minor and patch version of specific major version
```html
<script src="https://unpkg.com/linqify@1"></script>
```

### Documentation, Blogger & GitHub
[LINQify Documentation](https://linqify.github.io "https://linqify.github.io") is located on GitHub Pages.
<br>
[LINQify blog](https://goranhrovat.blogspot.com/search/label/linqify "https://goranhrovat.blogspot.com/search/label/linqifyy") is located on Blogger.
<br>
[Source code](https://github.com/goranhrovat/linqify "https://github.com/goranhrovat/linqify") is available on GitHub.

### Use LINQ methods as you are used to
```javascript
[1,2,3,4,5,4,3,2].Select(t => t*2).Where(t => t>5).Skip(1).Take(3).ToArray();
// [8,10,8]
[1,2,3,4,5,4,3,2].Select(t => t*2).TakeWhile(t => t<5).ToArray();
// [2,4]
[1,2,3,4,5,4,3,2].GroupBy(t => t%2).Select(t => ({Key:t.Key, Vals:[...t]})).ToArray();
// [{"Key":1,"Vals":[1,3,5,3]},{"Key":0,"Vals":[2,4,4,2]}]
[1,2,3,4,5,4,3,2].GroupBy(t => t%2).Select(t => ({Key:t.Key, Sum:t.Sum()})).ToArray();
// [{"Key":1,"Sum":12},{"Key":0,"Sum":12}]
[5,6,1,3,5,8,4,9,3,1,5,4,8,9].Distinct().OrderBy(t=>t).ToArray();
// [1,3,4,5,6,8,9]
[{Name:"Jack", Age:18},
 {Name:"Joe",  Age:22},
 {Name:"Jack", Age:20}].OrderBy(t=>t.Name).ThenByDescending(t=>t.Age).ToArray();
// [{"Name":"Jack","Age":20},{"Name":"Jack","Age":18},{"Name":"Joe","Age":22}]
```

### Define custom Sort comparer
```javascript
function ageComparer (a, b) {
    if (a.Age > b.Age) return 1;
    if (a.Age < b.Age) return -1;
    return 0;
}
let people = [{Name:"Jack", Age:18}, {Name:"Joe",  Age:22}, {Name:"Jack", Age:20}];

people.OrderBy(t=>t, ageComparer).ToArray();
// [{"Name":"Jack","Age":18},{"Name":"Jack","Age":20},{"Name":"Joe","Age":22}]
 
people.OrderByDescending(t=>t, ageComparer).ToArray();
// [{"Name":"Joe","Age":22},{"Name":"Jack","Age":20},{"Name":"Jack","Age":18}]
```

### Define custom Equality comparer
```javascript
let nameEqualityComparer = {
    Equals: (x, y) => x.Name===y.Name,
    GetHashCode: obj => obj.Name
}
let people = [{Name:"Jack", Age:18}, {Name:"Joe",  Age:22},{Name:"Jack", Age:20}];

people.Distinct(nameEqualityComparer).ToArray();
// [{"Name":"Jack","Age":18},{"Name":"Joe","Age":22}]

// or use DeepComparer
let nameEqComparer = EqualityComparers.DeepComparer(t=>({Name:t.Name}));
people.Distinct(nameEqComparer).ToArray();
// [{"Name":"Jack","Age":18},{"Name":"Joe","Age":22}]

let myhashset = people.ToHashSet(nameEqualityComparer);
[...myhashset]
// [{"Name":"Jack","Age":18},{"Name":"Joe","Age":22}]
myhashset.Add({Name:"Jack", Age:25});
// false
myhashset.Add({Name:"Jane", Age:25});
// true
```

### Easily extend the library
#### With generator function
```javascript
Enumerable.setMethod("EvenElements", function*() {
    let ind = 0;
    for (let t of this)
        if (ind++%2 === 0) yield t;
});
["a","b","c","d"].EvenElements().ToArray();
// ["a", "c"]
```
#### Or with normal function
```javascript
Enumerable.setMethod("Variance", function() {
    let avg = this.Average();
    return this.Select(t => Math.pow(t - avg, 2)).Average();
});
[1,3,4,8,12].Variance();
// 15.440000000000001
```

### Create custom anonymous method
#### Output the names as many times as they are old
```javascript
let people = [{Name:"Jack", Age:3}, {Name:"Joe", Age:2}, {Name:"Jane", Age:1}]
people.Custom(function* () {
    for (let t of this)
      yield* Enumerable.Repeat(t.Name, t.Age)
}).Select(t=>t.toUpperCase()).ToArray()
// ["JACK", "JACK", "JACK", "JOE", "JOE", "JANE"]
```
#### Get the oldest person (aka MaxBy)
```javascript
let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jane", Age:20}]
let oldest = people.Custom((source)=>{
    let currOldest = source.FirstOrDefault();
    for (let t of source) if (t.Age > currOldest.Age) currOldest = t;
    return currOldest;
})
oldest
// {Name:"Joe", Age:22}
```

### ToList, ToDictionary, ToHashSet, ToLookup
```javascript
let mylist = [1,3,4,8,12].ToList();
mylist.Add(15);
[...mylist]
// [1, 3, 4, 8, 12, 15]

let mydict = [1,3,4,8,12].ToDictionary(t=>t, t=>t*2);
[...mydict]
// [{"Key":1,"Value":2},{"Key":3,"Value":6},
//  {"Key":4,"Value":8},{"Key":8,"Value":16},
//  {"Key":12,"Value":24}]

let myhashset = [1,3,4,8,12].ToHashSet();
myhashset.IsSupersetOf([1,4]);
// true

let groups = [1,3,4,8,12].ToLookup(t=>t>3 ? "big" : "small", t=>t);
for (let group of groups)
    console.log(group.Key, [...group]);
// small [1, 3]
// big [4, 8, 12]
```

### ToSet, ToMap, ToArray
```javascript
[1,3,4,4,8,12].ToSet();
// Set {1, 3, 4, 8, 12}

[1,3,4,4,8,12].ToMap(t=>t, t=>t*2);
// Map {1 => 2, 3 => 6, 4 => 8, 8 => 16, 12 => 24}

[1,3,4,4,8,12].ToMap(t=>t, t=>t*2).ToArray();
// [[1,2],[3,6],[4,8],[8,16],[12,24]]

let upperNames = ["Jane", "Joe", "Jack"].Select(t=>t.toUpperCase());
upperNames.ToArray();
// or
[...upperNames];
// ["JANE", "JOE", "JACK"]
```

### Extends native Array, Map, Set, and String
```javascript
"Jane Doe".Distinct().Reverse().ToArray();
// ["o", "D", " ", "e", "n", "a", "J"]
new Map([[1,"Jane"],[2,"Joe"],[3,"Jack"]]).Select(t=>`${t[0]}: ${t[1]}`).ToArray();
// ["1: Jane", "2: Joe", "3: Jack"]
new Set([1,4,6,4,7]).Average();
// 4.5
```

### Create IEnumerable from generator
#### Infinite generator of Prime numbers
```javascript
function isPrime(num) {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return true;
}
let primeNumbers = Enumerable.From(function* () {
    let i = 2;
    while (true) {
        if  (isPrime(i)) yield i;
        i++;
    }
});
primeNumbers.Take(10).ToArray();
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

#### Infinite generator of Fibonacci sequence
```javascript
let fibonacciNumbers = Enumerable.From(function* () {
  let current = 0, next = 1;
  
  while (true) {
    yield current;
    [current, next] = [next, current + next];
  }
});
fibonacciNumbers.Take(10).ToArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### With typescript support
![Typescript support](https://linqify.github.io/media/OrderBy.png)


### noConflict option
```javascript
import {linqify} from 'linqify';
var lq = linqify.noConflict();
[1,2,3].Select(t=>t*t).ToArray();
// Uncaught TypeError: [1,2,3].Select is not a function

lq.Enumerable.From([1,2,3]).Select(t=>t*t).ToArray();
// or
lq([1,2,3]).Select(t=>t*t).ToArray();
// [1, 4, 9]
```

### Implemented methods in IEnumerable
[Aggregate](https://linqify.github.io/classes/ienumerable.html#aggregate),
[All](https://linqify.github.io/classes/ienumerable.html#all),
[Any](https://linqify.github.io/classes/ienumerable.html#any),
[Append](https://linqify.github.io/classes/ienumerable.html#append),
[AsEnumerable](https://linqify.github.io/classes/ienumerable.html#asenumerable),
[Average](https://linqify.github.io/classes/ienumerable.html#average),
[Cast](https://linqify.github.io/classes/ienumerable.html#cast),
[Concat](https://linqify.github.io/classes/ienumerable.html#concat),
[Contains](https://linqify.github.io/classes/ienumerable.html#contains),
[Count](https://linqify.github.io/classes/ienumerable.html#count),
[Custom](https://linqify.github.io/classes/ienumerable.html#custom),
[DefaultIfEmpty](https://linqify.github.io/classes/ienumerable.html#defaultifempty),
[Distinct](https://linqify.github.io/classes/ienumerable.html#distinct),
[ElementAt](https://linqify.github.io/classes/ienumerable.html#elementat),
[ElementAtOrDefault](https://linqify.github.io/classes/ienumerable.html#elementatordefault),
[Except](https://linqify.github.io/classes/ienumerable.html#except),
[First](https://linqify.github.io/classes/ienumerable.html#first),
[FirstOrDefault](https://linqify.github.io/classes/ienumerable.html#firstordefault),
[ForEach](https://linqify.github.io/classes/ienumerable.html#foreach),
[GroupBy](https://linqify.github.io/classes/ienumerable.html#groupby),
[GroupJoin](https://linqify.github.io/classes/ienumerable.html#groupjoin),
[Intersect](https://linqify.github.io/classes/ienumerable.html#intersect),
[Join](https://linqify.github.io/classes/ienumerable.html#join),
[Last](https://linqify.github.io/classes/ienumerable.html#last),
[LastOrDefault](https://linqify.github.io/classes/ienumerable.html#lastordefault),
[Max](https://linqify.github.io/classes/ienumerable.html#max),
[Min](https://linqify.github.io/classes/ienumerable.html#min),
[OfType](https://linqify.github.io/classes/ienumerable.html#oftype),
[OrderBy](https://linqify.github.io/classes/ienumerable.html#orderby),
[OrderByDescending](https://linqify.github.io/classes/ienumerable.html#orderbydescending),
[Prepend](https://linqify.github.io/classes/ienumerable.html#prepend),
[Reverse](https://linqify.github.io/classes/ienumerable.html#reverse),
[Select](https://linqify.github.io/classes/ienumerable.html#select),
[SelectMany](https://linqify.github.io/classes/ienumerable.html#selectmany),
[SequenceEqual](https://linqify.github.io/classes/ienumerable.html#sequenceequal),
[Single](https://linqify.github.io/classes/ienumerable.html#single),
[SingleOrDefault](https://linqify.github.io/classes/ienumerable.html#singleordefault),
[Skip](https://linqify.github.io/classes/ienumerable.html#skip),
[SkipLast](https://linqify.github.io/classes/ienumerable.html#skiplast),
[SkipWhile](https://linqify.github.io/classes/ienumerable.html#skipwhile),
[Sum](https://linqify.github.io/classes/ienumerable.html#sum),
[Take](https://linqify.github.io/classes/ienumerable.html#take),
[TakeLast](https://linqify.github.io/classes/ienumerable.html#takelast),
[TakeWhile](https://linqify.github.io/classes/ienumerable.html#takewhile),
[ToArray](https://linqify.github.io/classes/ienumerable.html#toarray),
[ToDictionary](https://linqify.github.io/classes/ienumerable.html#todictionary),
[ToHashSet](https://linqify.github.io/classes/ienumerable.html#tohashset),
[ToList](https://linqify.github.io/classes/ienumerable.html#tolist),
[ToLookup](https://linqify.github.io/classes/ienumerable.html#tolookup),
[ToMap](https://linqify.github.io/classes/ienumerable.html#tomap),
[ToSet](https://linqify.github.io/classes/ienumerable.html#toset),
[Union](https://linqify.github.io/classes/ienumerable.html#union),
[Where](https://linqify.github.io/classes/ienumerable.html#where),
[Zip](https://linqify.github.io/classes/ienumerable.html#zip).


### Implemented methods in IOrderedEnumerable
[ThenBy](https://linqify.github.io/classes/iorderedenumerable.html#thenby),
[ThenByDescending](https://linqify.github.io/classes/iorderedenumerable.html#thenbydescending).

