# LINQify

![](https://img.shields.io/bundlephobia/minzip/linqify.svg)
![](https://img.shields.io/npm/types/linqify.svg)
![](https://img.shields.io/npm/l/linqify.svg)
![](https://img.shields.io/npm/v/linqify.svg)

![](https://img.shields.io/npm/dependency-version/linqify/dev/rollup.svg)
![](https://img.shields.io/npm/dependency-version/linqify/dev/jest.svg)
![](https://img.shields.io/npm/dependency-version/linqify/dev/eslint.svg)
![](https://img.shields.io/npm/dependency-version/linqify/dev/prettier.svg)

JavaScript library for lazy querying Arrays, Maps, Sets, and Strings based on [LINQ (C#)](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/).

Provides Dictionary, HashSet, and Lookup with comparer for complex types.

Features:
  - lazy evaluation with generator functions,
  - extends native javascript Array, Set, Map, and String,
  - C# LINQ naming convention,
  - includes typescript support in code editors.

## Usage

### Install
````shell
npm install linqify
````

### Node CommonJS module
```typescript
var {Enumerable, Dictionary, HashSet, EqualityComparers,
     SortComparers, linqify} = require('linqify');
```

### Node ES module
```typescript
import {Enumerable, Dictionary, HashSet, EqualityComparers,
        SortComparers, linqify} from 'linqify';
```

### Browser
#### Always get the latest version
```html
<script src="https://unpkg.com/linqify"></script>
```
#### Get the specific version
```html
<script src="https://unpkg.com/linqify@1.0.4"></script>
```
#### Get the latest minor and patch version
```html
<script src="https://unpkg.com/linqify@1"></script>
```


### Documentation & GitHub
[LINQify Documentation](https://goranhrovat.github.io/linqify "https://goranhrovat.github.io/linqify") is located on GitHub Pages.
<br>
Source code is available on [GitHub](https://github.com/goranhrovat/linqify "https://github.com/goranhrovat/linqify").

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
function ageSortComparer (a, b) {
    if (a.Age > b.Age) return 1;
    else if (a.Age < b.Age) return -1;
    else return 0;
}
let people = [{Name:"Jack", Age:18}, {Name:"Joe",  Age:22}, {Name:"Jack", Age:20}];

people.OrderBy(t=>t, ageSortComparer).ToArray();
// [{"Name":"Jack","Age":18},{"Name":"Jack","Age":20},{"Name":"Joe","Age":22}]
 
people.OrderByDescending(t=>t, ageSortComparer).ToArray();
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

let myhashset = people.ToHashSet(nameEqualityComparer);
[...myhashset]
// [{"Name":"Jack","Age":18},{"Name":"Joe","Age":22}]
myhashset.Add({Name:"Jack", Age:25});
// false
myhashset.Add({Name:"Jane", Age:25});
// true
```

### Easily extend the library with generator function
```javascript
Enumerable.setMethod("EvenElements", function*() {
    let ind = 0;
    for (let t of this)
        if (ind++%2 === 0) yield t;
});
["a","b","c","d"].EvenElements().ToArray();
// ["a", "c"]
```

### Or extend with normal function
```javascript
Enumerable.setMethod("Variance", function() {
    let avg = this.Average();
    return this.Select(t => Math.pow(t - avg, 2)).Average();
});
[1,3,4,8,12].Variance();
// 15.440000000000001
```

### ToDictionary, ToHashSet, ToLookup
```javascript
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

### Extends native Array, Map, Set and String
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
let primeNumbers = Enumerable.From(function* () {
    const isPrime = num => {
        for(let i = 2, s = Math.sqrt(num); i <= s; i++)
            if(num % i === 0) return false; 
        return true;
    }
    let i = 2;
    while (true) {
        if  (isPrime(i)) yield i;
        i++;
    }
});
primeNumbers.Take(10).ToArray();
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```
<br>

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
![Typescript support](https://goranhrovat.github.io/linqify/media/OrderBy.png)


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
[Aggregate](https://goranhrovat.github.io/linqify/classes/ienumerable.html#aggregate),
[All](https://goranhrovat.github.io/linqify/classes/ienumerable.html#all),
[Any](https://goranhrovat.github.io/linqify/classes/ienumerable.html#any),
[Append](https://goranhrovat.github.io/linqify/classes/ienumerable.html#append),
[AsEnumerable](https://goranhrovat.github.io/linqify/classes/ienumerable.html#asenumerable),
[Average](https://goranhrovat.github.io/linqify/classes/ienumerable.html#average),
[Cast](https://goranhrovat.github.io/linqify/classes/ienumerable.html#cast),
[Concat](https://goranhrovat.github.io/linqify/classes/ienumerable.html#concat),
[Contains](https://goranhrovat.github.io/linqify/classes/ienumerable.html#contains),
[Count](https://goranhrovat.github.io/linqify/classes/ienumerable.html#count),
[DefaultIfEmpty](https://goranhrovat.github.io/linqify/classes/ienumerable.html#defaultifempty),
[Distinct](https://goranhrovat.github.io/linqify/classes/ienumerable.html#distinct),
[ElementAt](https://goranhrovat.github.io/linqify/classes/ienumerable.html#elementat),
[ElementAtOrDefault](https://goranhrovat.github.io/linqify/classes/ienumerable.html#elementatordefault),
[Except](https://goranhrovat.github.io/linqify/classes/ienumerable.html#except),
[First](https://goranhrovat.github.io/linqify/classes/ienumerable.html#first),
[FirstOrDefault](https://goranhrovat.github.io/linqify/classes/ienumerable.html#firstordefault),
[ForEach](https://goranhrovat.github.io/linqify/classes/ienumerable.html#foreach),
[GroupBy](https://goranhrovat.github.io/linqify/classes/ienumerable.html#groupby),
[GroupJoin](https://goranhrovat.github.io/linqify/classes/ienumerable.html#groupjoin),
[Intersect](https://goranhrovat.github.io/linqify/classes/ienumerable.html#intersect),
[Join](https://goranhrovat.github.io/linqify/classes/ienumerable.html#join),
[Last](https://goranhrovat.github.io/linqify/classes/ienumerable.html#last),
[LastOrDefault](https://goranhrovat.github.io/linqify/classes/ienumerable.html#lastordefault),
[Max](https://goranhrovat.github.io/linqify/classes/ienumerable.html#max),
[Min](https://goranhrovat.github.io/linqify/classes/ienumerable.html#min),
[OfType](https://goranhrovat.github.io/linqify/classes/ienumerable.html#oftype),
[OrderBy](https://goranhrovat.github.io/linqify/classes/ienumerable.html#orderby),
[OrderByDescending](https://goranhrovat.github.io/linqify/classes/ienumerable.html#orderbydescending),
[Prepend](https://goranhrovat.github.io/linqify/classes/ienumerable.html#prepend),
[Reverse](https://goranhrovat.github.io/linqify/classes/ienumerable.html#reverse),
[Select](https://goranhrovat.github.io/linqify/classes/ienumerable.html#select),
[SelectMany](https://goranhrovat.github.io/linqify/classes/ienumerable.html#selectmany),
[SequenceEqual](https://goranhrovat.github.io/linqify/classes/ienumerable.html#sequenceequal),
[Single](https://goranhrovat.github.io/linqify/classes/ienumerable.html#single),
[SingleOrDefault](https://goranhrovat.github.io/linqify/classes/ienumerable.html#singleordefault),
[Skip](https://goranhrovat.github.io/linqify/classes/ienumerable.html#skip),
[SkipLast](https://goranhrovat.github.io/linqify/classes/ienumerable.html#skiplast),
[SkipWhile](https://goranhrovat.github.io/linqify/classes/ienumerable.html#skipwhile),
[Sum](https://goranhrovat.github.io/linqify/classes/ienumerable.html#sum),
[Take](https://goranhrovat.github.io/linqify/classes/ienumerable.html#take),
[TakeLast](https://goranhrovat.github.io/linqify/classes/ienumerable.html#takelast),
[TakeWhile](https://goranhrovat.github.io/linqify/classes/ienumerable.html#takewhile),
[ToArray](https://goranhrovat.github.io/linqify/classes/ienumerable.html#toarray),
[ToDictionary](https://goranhrovat.github.io/linqify/classes/ienumerable.html#todictionary),
[ToHashSet](https://goranhrovat.github.io/linqify/classes/ienumerable.html#tohashset),
[ToLookup](https://goranhrovat.github.io/linqify/classes/ienumerable.html#tolookup),
[ToMap](https://goranhrovat.github.io/linqify/classes/ienumerable.html#tomap),
[ToSet](https://goranhrovat.github.io/linqify/classes/ienumerable.html#toset),
[Union](https://goranhrovat.github.io/linqify/classes/ienumerable.html#union),
[Where](https://goranhrovat.github.io/linqify/classes/ienumerable.html#where),
[Zip](https://goranhrovat.github.io/linqify/classes/ienumerable.html#zip).


### Implemented methods in IOrderedEnumerable
[ThenBy](https://goranhrovat.github.io/linqify/classes/iorderedenumerable.html#thenby),
[ThenByDescending](https://goranhrovat.github.io/linqify/classes/iorderedenumerable.html#thenbydescending).

