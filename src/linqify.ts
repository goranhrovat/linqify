// Utils/EqualityComparers
/**
 * Defines type to support the comparison of objects for equality.
 */
declare type IEqualityComparer<T> = {
    Equals: (x : T, y : T) => boolean
    GetHashCode : (obj : T) => any
};

/**
 * Implements Deep equality comparer for deep value comparison of objects
 * and Primitive equality comparer for value or reference comparison.
 */
declare const EqualityComparers : {
    /**
     * Recursively compare objects by attributes.
     ```javascript
     let people = [{Name:"John", Age:15},{Name:"John", Age:15},{Name:"John", Age:13}]
     people.Distinct().ToArray()
     // [{"Name":"John","Age":15},{"Name":"John","Age":15},{"Name":"John","Age":13}]
     people.Distinct(EqualityComparers.DeepComparer()).ToArray()
     // [{"Name":"John","Age":15},{"Name":"John","Age":13}]
     people.Distinct(EqualityComparers.DeepComparer(t=>({Name:t.Name}))).ToArray()
     // [{"Name":"John","Age":15}]
     people.Distinct(EqualityComparers.DeepComparer(t=>t.Name)).ToArray()
     // [{"Name":"John","Age":15}]
     ```
     */
    DeepComparer : <T>(selector? : (item:T)=>any) => IEqualityComparer<T>,
    PrimitiveComparer : IEqualityComparer<any>,
};

// Utils/SortComparers
/**
 * Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
 */
declare type IComparer<T> = (x : T, y : T) => number;

/**
 * Implements default basic and reverse comparer.
 */
declare const SortComparers : {
    DefaultComparer : IComparer<any>,
    DefaultComparerReverse : IComparer<any>,
}

// KeyValuePair
/**
 * Defines type for key/value pair object.
 */
declare type KeyValuePair<TKey,TValue> = { Key: TKey, Value: TValue }

// Utils/SortUtils
/**@hidden */
declare function getComparer<TSource, TKey>(keySelector : (source : TSource)=>TKey, comparer? : IComparer<TKey>) : IComparer<TKey>;
/**@hidden */
declare function getComparerReverse<TSource, TKey>(keySelector : (source : TSource)=>TKey, comparer? : IComparer<TKey>) : IComparer<TKey>;
/**@hidden */
declare function sortGen<T>(source : IterableIterator<T>, cmpfuns:IComparer<T>[]) : IterableIterator<T>;

// Utils/TypeUtils
/**@hidden */
declare function getType(obj : string) : string;
/**@hidden */
declare function defaultVal(type : string) : any;

// Sequence/IEnumerable & IOrderedEnumerable & Methods/Methods
/**
 * Exposes an enumerator, which supports a simple iteration over a non-generic collection.
 * Is a base class for collection types and implements LINQ methods.
 */
declare class IEnumerable<T> {
    /**
     * Returns an enumerator that iterates through a collection.
     */
    [Symbol.iterator]() : IterableIterator<T>;

    /**
     * Sorts the elements of a sequence in ascending order.
     * @param keySelector - A function to extract a key from an element.
     * @param comparer - An `IComparer<TKey>` to compare keys.
     * @returns An `IOrderedEnumerable<T>` whose elements are sorted in ascending according to a key.
     ```javascript
     ["Jane", "Doe", "Joe"].OrderBy(t=>t).ToArray()
     // ["Doe", "Jane", "Joe"]
     ```
     */
    OrderBy<TKey>(keySelector : (item : T)=>TKey, comparer? : IComparer<TKey>) : IOrderedEnumerable<T>;

    /**
     * Sorts the elements of a sequence in descending order.
     * @param keySelector - A function to extract a key from an element.
     * @param comparer - An `IComparer<TKey>` to compare keys.
     * @returns An `IOrderedEnumerable<T>` whose elements are sorted in descending order according to a key.
     ```javascript
     ["Jane", "Doe", "Joe"].OrderByDescending(t=>t).ToArray()
     // ["Joe", "Jane", "Doe"]
     ```
     */
    OrderByDescending<TKey>(keySelector : (item : T)=>TKey, comparer? : IComparer<TKey>) : IOrderedEnumerable<T>;

    /**
     * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
     * @param seed - The initial accumulator value.
     * @param func - An accumulator function to be invoked on each element.
     * @param resultSelector - A function to transform the final accumulator value into the result value.
     * @returns The transformed final accumulator value.
     ```javascript
     ["Jane", "Doe", "Joe"].Aggregate("", (res, item)=>res+" "+item, t=>t.toUpperCase().trim())
     // "JANE DOE JOE"
     ```
     */
    Aggregate<TAccumulate,TResult>(seed:TAccumulate, func: (seed:TAccumulate, item:T)=>TAccumulate, resultSelector?: (accumulate:TAccumulate)=>TResult) : TResult;
    /**
     * Applies an accumulator function over a sequence.
     * @param func - An accumulator function to be invoked on each element.
     * @returns The final accumulator value.
     ```javascript
     ["Jane", "Doe", "Joe"].Aggregate((res, item)=>res+" "+item)
     // " Jane Doe Joe"
     ```
     */
    Aggregate(func: (seed:T, item:T)=>T) : T;

    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate - A function to test each element for a condition.
     * @returns `true` if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, `false`.
     ```javascript
     [1,9,15].All(t=>t>5)
     // false
     [1,9,15].All(t=>t<50)
     // true
     ```
     */
    All(predicate : (item : T) => boolean) : boolean;

    /**
     * Determines whether any element of a sequence exists or satisfies a condition.
     * @param predicate - A function to test each element for a condition.
     * @returns `true` if any elements in the source sequence pass the test in the specified predicate; otherwise, `false`.
     ```javascript
     [1,9,15].Any(t=>t>5)
     // true
     [1,9,15].Any(t=>t>50)
     // false
     ```
     */
    Any(predicate? : (item : T) => boolean) : boolean;

    /**
     * Appends a value to the end of the sequence.
     * @param element - The value to append to source.
     * @returns A new sequence that ends with element.
     ```javascript
     [1,9,15].Append(20).ToArray()
     // [1, 9, 15, 20]
     ```
     */
    Append(element : T) : IEnumerable<T>;

    /**
     * Returns the input typed as `IEnumerable<T>`.
     * @returns The input sequence typed as `IEnumerable<T>`.
     */
    AsEnumerable() : IEnumerable<T>;

    // declare optional parameter only for Enumerable<number>, no language feature
    /**
     * Computes the average of a sequence of values.
     * @param selector - A transform function to apply to each element.
     * @returns The average of the sequence of values, or `NaN` if the source sequence is empty or contains only values that are null.
     ```javascript
     [1,9,15].Average()
     // 8.333333333333334
     ```
     */
    Average(selector? : (item:T)=>number) : number;

    /**
     * Casts the elements of an IEnumerable to the specified type.
     * Useful for Typescript developers.
     * @returns An `IEnumerable<T>` that contains each element of the source sequence cast to the specified type.
     */
    Cast<TResult>() : IEnumerable<TResult>;

    /**
     * Concatenates two sequences.
     * @param second - The sequence to concatenate to the first sequence.
     * @returns An `IEnumerable<T>` that contains the concatenated elements of the two sequences.
     ```javascript
     [1,9,15].Concat([20,21,25]).ToArray()
     // [1, 9, 15, 20, 21, 25]
     ```
     */
    Concat(second: IEnumerable<T>) : IEnumerable<T>;

    /**
     * Determines whether a sequence contains a specified element.
     * @param value - The value to locate in the sequence.
     * @param comparer - An `IEqualityComparer<T>` to compare values.
     * @returns `true` if the source sequence contains an element that has the specified value; otherwise, false.
     ```javascript
     [1,9,15].Contains(9)
     // true
     ```
     */
    Contains(value : T, comparer? : IEqualityComparer<T>) : boolean;

    /**
     * Returns the number of elements in a sequence.
     * @param predicate - A function to test each element for a condition.
     * @returns The number of elements in the input sequence.
     * A number that represents how many elements in the sequence satisfy the condition in the predicate function.
     ```javascript
     [1,9,15].Count()
     // 3
     [1,9,15].Count(t=>t>5)
     // 2
     ```
     */
    Count(predicate? : (item : T)=>boolean) : number;

    /**
     * Wrapper for custom projection or filtering.
     * @param fun - A generator function which yields transformed source.
     * @returns New `IEnumerable<K>` yielded from generator function.
     ```javascript
     let people = [{Name:"Jack", Age:3}, {Name:"Joe", Age:2}, {Name:"Jane", Age:1}]
     people.Custom(function* () {
         // Output the names as many times as they are old
         for (let t of this)
            yield* Enumerable.Repeat(t.Name, t.Age)
     }).Select(t=>t.toUpperCase()).ToArray()
     // ["JACK", "JACK", "JACK", "JOE", "JOE", "JANE"]
     ```
     */
    Custom<K>(fun : (source:IEnumerable<T>)=>(()=>IterableIterator<K>)) : IEnumerable<K>;
    
    /**
     * Wrapper for custom aggregation of source sequence.
     * @param fun - Function which aggregates sequence and returns a value.
     * @returns Final value aggregated in function.
     ```javascript
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jane", Age:20}]
     let oldest = people.Custom((source)=>{
         // get the oldest person (aka MaxBy) 
         let currOldest = source.FirstOrDefault();
         for (let t of source) if (t.Age > currOldest.Age) currOldest = t;
         return currOldest;
     })
     oldest
     // {Name:"Joe", Age:22}
     ```
     */
    Custom<K>(fun : (source:IEnumerable<T>)=>K) : K;

    /**
     * Returns the elements of an IEnumerable<T>, or a default valued singleton collection if the sequence is empty.
     * @param defaultValue - The value to return if the sequence is empty.
     * @returns An `IEnumerable<T>` that contains defaultValue if source is empty; otherwise, source.
     ```javascript
     [1,9,15].DefaultIfEmpty(5).ToArray()
     // [1,9,15]
     [].DefaultIfEmpty(5).ToArray()
     // [5]
     ```
     */
    DefaultIfEmpty(defaultValue? : T) : IEnumerable<T>;

    /**
     * Returns distinct elements from a sequence.
     * @param comparer - An `IEqualityComparer<T>` to compare values.
     * @returns An `IEnumerable<T>` that contains distinct elements from the source sequence.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].Distinct().ToArray()
     // [1, 2, 3, 4, 5, 6]
     ```
     */
    Distinct(comparer? : IEqualityComparer<T>) : IEnumerable<T>;

    /**
     * Returns the element at a specified index in a sequence.
     * @param index - The zero-based index of the element to retrieve.
     * @returns The element at the specified position in the source sequence.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].ElementAt(5)
     // 3
     ```
     */
    ElementAt(index : number) : T;

    /**
     * Returns the element at a specified index in a sequence or a default value if the index is out of range.
     * @param index - The zero-based index of the element to retrieve.
     * @param defaultValue - Default value if the index is out of range.
     * @returns Default value if the index is outside the bounds of the source sequence; otherwise, the element at the specified position in the source sequence.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].ElementAtOrDefault(20, 123)
     // 123
     [1,1,2,2,2,3,4,5,6,6].ElementAtOrDefault(8, 123)
     // 6
     ```
     */
    ElementAtOrDefault(index : number, defaultValue? : T) : T;

    /**
     * Produces the set difference of two sequences.
     * @param second - An `IEnumerable<T>` whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
     * @param comparer - An `IEqualityComparer<T>` to compare values.
     * @returns A sequence that contains the set difference of the elements of two sequences.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].Except([1,2,8]).ToArray()
     // [3, 4, 5, 6]
     ```
     */
    Except(second : IEnumerable<T>, comparer? : IEqualityComparer<T>) : IEnumerable<T>;

    /**
     * Returns the first element of a sequence.
     * @param predicate - A function to test each element for a condition.
     * @returns The first element in the sequence that passes the test in the specified predicate function.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].First()
     // 1
     [1,1,2,2,2,3,4,5,6,6].First(t=>t>2)
     // 3
     [].First()
     // Error - Uncaught No first element
     ```
     */
    First(predicate? : (item : T) => boolean) : T;

    /**
     * Returns the first element of a sequence, or a default value if no element is found.
     * @param predicate - A function to test each element for a condition.
     * @param defaultValue - Default value if no element is found.
     * @returns Default value if source is empty or if no element passes the test specified by predicate; otherwise, the first element in source that passes the test specified by predicate.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].FirstOrDefault(t=>true, 123)
     // 1
     [1,1,2,2,2,3,4,5,6,6].FirstOrDefault(t=>t>2, 123)
     // 3
     [].FirstOrDefault(t=>true, 123)
     // 123
     ```
     */
    FirstOrDefault(predicate? : (item : T) => boolean, defaultValue? : T) : T;

    /**
     * Executes callback function on every element of a sequence.
     * @param callback - Function to be executed on every element of a sequence.
     ```javascript
     [1,3,5].ForEach(t=>console.log(t))
     // 1
     // 3
     // 5
     ```
     */
    ForEach(callback : (item : T, index? : number) => void) : void;

    /*1,2*/
    /**
     * Groups the elements of a sequence according to a specified key selector function and creates a result value from each group and its key. Key values are compared by using a specified comparer, and the elements of each group are projected by using a specified function.
     * @param keySelector - A function to extract the key for each element.
     * @param elementSelector - A function to map each source element to an element in an `IGrouping<TKey,TElement>`.
     * @param resultSelector - A function to create a result value from each group.
     * @param comparer - An `IEqualityComparer<TKey>` to compare keys with.
     * @returns A collection of elements of type `TResult` where each element represents a projection over a group and its key.
     ```javascript
     let ageGroupEqualityComparer = {
         Equals: (x, y) => x.AgeGroup===y.AgeGroup,
         GetHashCode: obj => obj.AgeGroup
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.GroupBy(t=>t.Age>20 ? {AgeGroup:'Young'} : {AgeGroup:'Old'}, t=>t.Name, (key, group)=>({Key:key, Names:[...group]}), ageGroupEqualityComparer).ToArray()
     // [{"Key":{"AgeGroup":"Old"},"Names":["Jack","Jack"]},{"Key":{"AgeGroup":"Young"},"Names":["Joe"]}]
     ```
     */
    GroupBy<TKey,TElement,TResult>(keySelector : (item : T) => TKey, elementSelector : (item : T) => TElement, resultSelector : (key : TKey, group : IEnumerable<TElement>) => TResult, comparer? : IEqualityComparer<TKey>) : IEnumerable<TResult>;
    /*3*/
    /**
     * Groups the elements of a sequence according to a specified key selector function and projects the elements for each group by using a specified function.
     * @param keySelector - A function to extract the key for each element.
     * @param elementSelector - A function to map each source element to an element in the `IGrouping<TKey,TElement>`.
     * @returns An `IEnumerable<IGrouping<TKey, TElement>>` where each `IGrouping<TKey,TElement>` object contains a collection of objects of type `TElement` and a key.
     ```javascript
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.GroupBy(t=>t.Age>20 ? 'Young' : 'Old', t=>t.Name).Select(t=>({Key:t.Key, Names:t.ToArray()})).ToArray()
     // [{"Key":"Old","Names":["Jack","Jack"]},{"Key":"Young","Names":["Joe"]}]
     ```
     */
    GroupBy<TKey,TElement>(keySelector : (item : T) => TKey, elementSelector : (item : T) => TElement) : IEnumerable<IGrouping<TKey,TElement>>;
    /*4*/
    /**
     * Groups the elements of a sequence according to a key selector function. The keys are compared by using a comparer and each group's elements are projected by using a specified function.
     * @param keySelector - A function to extract the key for each element.
     * @param elementSelector - A function to map each source element to an element in an `IGrouping<TKey,TElement>`.
     * @param comparer - An `IEqualityComparer<T>` to compare keys.
     * @returns An `IEnumerable<IGrouping<TKey, TElement>>` where each `IGrouping<TKey,TElement>` object contains a collection of objects of type `TElement` and a key.
     ```javascript
     let ageGroupEqualityComparer = {
         Equals: (x, y) => x.AgeGroup===y.AgeGroup,
         GetHashCode: obj => obj.AgeGroup
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.GroupBy(t=>t.Age>20 ? {AgeGroup:'Young'} : {AgeGroup:'Old'}, t=>t.Name, ageGroupEqualityComparer).Select(t=>({Key:t.Key, Names:t.ToArray()})).ToArray()
     [{"Key":{"AgeGroup":"Old"},"Names":["Jack","Jack"]},{"Key":{"AgeGroup":"Young"},"Names":["Joe"]}]
     // 
     ```
     */
    GroupBy<TKey,TElement>(keySelector : (item : T) => TKey, elementSelector : (item : T) => TElement, comparer : IEqualityComparer<TKey>) : IEnumerable<IGrouping<TKey,TElement>>;
    /*5,6*/
    /**
     * Groups the elements of a sequence according to a specified key selector function and creates a result value from each group and its key. The keys are compared by using a specified comparer.
     * @param keySelector - A function to extract the key for each element.
     * @param resultSelector - A function to create a result value from each group.
     * @param comparer - An `IEqualityComparer<T>` to compare keys with.
     * @returns A collection of elements of type `TResult` where each element represents a projection over a group and its key.
     ```javascript
     let ageGroupEqualityComparer = {
         Equals: (x, y) => x.AgeGroup===y.AgeGroup,
         GetHashCode: obj => obj.AgeGroup
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.GroupBy(t=>t.Age>20 ? {AgeGroup:'Young'} : {AgeGroup:'Old'}, (key, group)=>({Key:key, Names:[...group]}), ageGroupEqualityComparer).ToArray()
     // [{"Key":{"AgeGroup":"Old"},"Names":[{"Name":"Jack","Age":18},{"Name":"Jack","Age":20}]},{"Key":{"AgeGroup":"Young"},"Names":[{"Name":"Joe","Age":22}]}]
     ```
     */
    GroupBy<TKey,TResult>(keySelector : (item : T) => TKey, resultSelector : (key : TKey, group : IEnumerable<T>) => TResult, comparer? : IEqualityComparer<TKey>) : IEnumerable<TResult>;
    /*7,8*/
    /**
     * Groups the elements of a sequence according to a specified key selector function and compares the keys by using a specified comparer.
     * @param keySelector - A function to extract the key for each element.
     * @param comparer - An IEqualityComparer<T> to compare keys.
     * @returns An `IEnumerable<IGrouping<TKey, TElement>>` where each `IGrouping<TKey,TElement>` object contains a collection of objects of type `TElement` and a key.
     ```javascript
     let ageGroupEqualityComparer = {
         Equals: (x, y) => x.AgeGroup===y.AgeGroup,
         GetHashCode: obj => obj.AgeGroup
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.GroupBy(t=>t.Age>20 ? {AgeGroup:'Young'} : {AgeGroup:'Old'}, ageGroupEqualityComparer).Select(t=>({Key:t.Key, Names:t.ToArray()})).ToArray()
     // [{"Key":{"AgeGroup":"Old"},"Names":[{"Name":"Jack","Age":18},{"Name":"Jack","Age":20}]},{"Key":{"AgeGroup":"Young"},"Names":[{"Name":"Joe","Age":22}]}]
     ```
     */
    GroupBy<TKey>(keySelector : (item : T) => TKey, comparer? : IEqualityComparer<TKey>) : IEnumerable<IGrouping<TKey,T>>;

    /**
     * Correlates the elements of two sequences based on key equality and groups the results. A specified `IEqualityComparer<T>` is used to compare keys.
     * @param inner - The sequence to join to the first sequence.
     * @param outerKeySelector - A function to extract the join key from each element of the first sequence.
     * @param innerKeySelector - A function to extract the join key from each element of the second sequence.
     * @param resultSelector - A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
     * @param comparer - An IEqualityComparer<T> to hash and compare keys.
     * @returns An `IEnumerable<T>` that contains elements of type `TResult` that are obtained by performing a grouped join on two sequences.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Hedlund, Magnus"},{Name:"Adams, Terry"},{Name:"Weiss, Charlotte"}]
     let pets = [{Name:"Barley", Owner:{Name:"Adams, Terry"}},
                {Name:"Boots", Owner:{Name:"Adams, Terry"}},
                {Name:"Whiskers", Owner:{Name:"Weiss, Charlotte"}},
                {Name:"Daisy", Owner:{Name:"Hedlund, Magnus"}},]
    
     let res = people.GroupJoin(pets, person => person, pet=>pet.Owner,
                                (person, petCollection) => ({
                                OwnerName: person.Name,
                                Pets: [petCollection.Select(pet => pet.Name).Aggregate((seed,item)=>seed+" "+item).trim()]
                                }),
                                nameComparer)
                    .ToArray()
     // [{"OwnerName":"Hedlund, Magnus","Pets":["Daisy"]},{"OwnerName":"Adams, Terry","Pets":["Barley Boots"]},{"OwnerName":"Weiss, Charlotte","Pets":["Whiskers"]}]
     ```
     */
    GroupJoin<TInner,TKey,TResult>(inner : IEnumerable<TInner>, outerKeySelector : (outerItem:T)=>TKey, innerKeySelector : (innerItem : TInner)=>TKey, resultSelector : (outerItem : T, inner : IEnumerable<TInner>) => TResult, comparer? : IEqualityComparer<TKey>) : IEnumerable<TResult>;

    /**
     * Produces the set intersection of two sequences.
     * @param second - An `IEnumerable<T>` whose distinct elements that also appear in the first sequence will be returned.
     * @param comparer - An IEqualityComparer<T> to compare values.
     * @returns A sequence that contains the elements that form the set intersection of two sequences.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.Intersect([{Name:"Joe", Age:50}, {Name:"Jane", Age:24}], nameComparer).ToArray()
     // [{"Name":"Joe","Age":22}]
     ```
     */
    Intersect(second : IEnumerable<T>, comparer? : IEqualityComparer<T>) : IEnumerable<T>;

    /**
     * Correlates the elements of two sequences based on matching keys. A specified `IEqualityComparer<T>` is used to compare keys.
     * @param inner - The sequence to join to the first sequence.
     * @param outerKeySelector - A function to extract the join key from each element of the first sequence.
     * @param innerKeySelector - A function to extract the join key from each element of the second sequence.
     * @param resultSelector - A function to create a result element from two matching elements.
     * @param comparer - An `IEqualityComparer<T>` to hash and compare keys.
     * @returns An `IEnumerable<T>` that has elements of type `TResult` that are obtained by performing an inner join on two sequences.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Hedlund, Magnus"},{Name:"Adams, Terry"},{Name:"Weiss, Charlotte"},{Name:"Without Pets"}]
     let pets = [{Name:"Barley", Owner:{Name:"Adams, Terry"}},
                {Name:"Boots", Owner:{Name:"Adams, Terry"}},
                {Name:"Pet Without Owner", Owner:{Name:"Doe, Jane"}},
                {Name:"Whiskers", Owner:{Name:"Weiss, Charlotte"}},
                {Name:"Daisy", Owner:{Name:"Hedlund, Magnus"}},];
    
     people.Join(pets, person => person, pet=>pet.Owner,
                    (person, pet) => ({
                        OwnerName: person.Name,
                        Pet: pet.Name
                    }),
                    nameComparer)
            .ToArray();
     // [{"OwnerName":"Hedlund, Magnus","Pet":"Daisy"},{"OwnerName":"Adams, Terry","Pet":"Barley"},{"OwnerName":"Adams, Terry","Pet":"Boots"},{"OwnerName":"Weiss, Charlotte","Pet":"Whiskers"}]
     ```
     */
    Join<TInner,TKey,TResult>(inner : IEnumerable<TInner>, outerKeySelector : (outerItem:T)=>TKey, innerKeySelector : (innerItem:TInner)=>TKey, resultSelector : (outerItem:T, innerItem:TInner)=>TResult, comparer? : IEqualityComparer<TKey>) : IEnumerable<TResult>

    /**
     * Returns the last element of a sequence that satisfies a specified condition.
     * @param predicate - A function to test each element for a condition.
     * @returns The last element in the sequence that passes the test in the specified predicate function.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].Last()
     // 6
     [1,1,2,2,2,3,4,5,6,6].Last(t=>t<3)
     // 2
     [].Last()
     // Error - Uncaught No last element
     ```
     */
    Last(predicate? : (item:T)=>boolean) : T;

    /**
     * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.
     * @param predicate - A function to test each element for a condition.
     * @param defaultValue - Default value if no element is found.
     * @returns Default value if the sequence is empty or if no elements pass the test in the predicate function; otherwise, the last element that passes the test in the predicate function.
     ```javascript
     [1,1,2,2,2,3,4,5,6,6].LastOrDefault(t=>true, 123)
     // 6
     [1,1,2,2,2,3,4,5,6,6].LastOrDefault(t=>t<3, 123)
     // 2
     [].LastOrDefault(t=>t<3, 123)
     // 123
     ```
     */
    LastOrDefault(predicate? : (item:T)=>boolean, defaultValue? : T) : T;

    // declare optional parameter only for Enumerable<number>, no language feature
    /**
     * Invokes a transform function on each element of a sequence and returns the maximum Single value.
     * @param selector - A transform function to apply to each element.
     * @returns The maximum value in the sequence.
     ```javascript
     [1,2,6,4,7,34,7,8].Max()
     // 34
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.Max(t => t.Age)
     // 22
     ```
     */
    Max(selector? : (item : T)=>number) : number;

    // declare optional parameter only for Enumerable<number>, no language feature
    /**
     * Invokes a transform function on each element of a sequence and returns the minimum resulting value.
     * @param selector - A transform function to apply to each element.
     * @returns The minimum value in the sequence.
     ```javascript
     [1,2,6,4,7,34,7,8].Min()
     // 1
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.Min(t => t.Age)
     // 18
     ```
     */
    Min(selector? : (item : T)=>number) : number;

    // no language feature
    /**
     * Filters the elements of an `IEnumerable` based on a specified type.
     * @param type - The type to filter the elements of the sequence on.
     * @returns An `IEnumerable<T>` that contains elements from the input sequence of type TResult.
     ```javascript
     [4,1,"1",2,3,"3",4,5,2, true].OfType("string").ToArray()
     // ["1", "3"]
     [4,1,"1",2,3,"3",4,5,2, true].OfType("number").ToArray()
     // [4, 1, 2, 3, 4, 5, 2]
     [4,1,"1",2,3,"3",4,5,2, true].OfType("boolean").ToArray()
     [4,1,"1",true, new Set([1,2])].OfType("Set").ToArray()
     // Set {1, 2}
     ```
     */
    OfType<TResult>(type : string) : IEnumerable<TResult>;

    /**
     * Adds a value to the beginning of the sequence.
     * @param element - The value to prepend to source.
     * @returns A new sequence that begins with element.
     ```javascript
     [1,9,15].Prepend(20).ToArray()
     // [20, 1, 9, 15]
     ```
     */
    Prepend(element : T) : IEnumerable<T>;

    /**
     * Inverts the order of the elements in a sequence.
     * @returns A sequence whose elements correspond to those of the input sequence in reverse order.
     ```javascript
     [1,9,15].Reverse().ToArray()
     // [15, 9, 1]
     ```
     */
    Reverse() : IEnumerable<T>;

    /**
     * Projects each element of a sequence into a new form by incorporating the element's index.
     * @param selector - A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
     * @returns An `IEnumerable<T>` whose elements are the result of invoking the transform function on each element of source.
     ```javascript
     [1,2,3].Select(t=>t*2).ToArray()
     // [2, 4, 6]
     [1,2,3].Select((t,i)=>i+" => "+t).ToArray()
     // ["0 => 1", "1 => 2", "2 => 3"]
     ```
     */
    Select<TResult>(selector : (item:T, index?:number)=>TResult) : IEnumerable<TResult>;

    /**
     * Projects each element of a sequence to an `IEnumerable<T>`, flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein. The index of each source element is used in the intermediate projected form of that element.
     * @param collectionSelector - A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
     * @param resultSelector - A transform function to apply to each element of the intermediate sequence.
     * @returns An `IEnumerable<TResult>` whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
     ```javascript
     let people = [
          { Name:"Jane", Items: [ "a", "b" ] },
          { Name:"Jack", Items: [ "c", "d" ] },
          { Name:"Joe", Items: [ "e", "f" ] },
          { Name:"John", Items: [ "g" ] },
        ]

     people.SelectMany((t,i) => t.Items.Select((z)=>z+i), (per, item) => ({ name:per.Name, item })).ToArray();
     // [{"name":"Jane","item":"a0"},{"name":"Jane","item":"b0"},{"name":"Jack","item":"c1"},
     //  {"name":"Jack","item":"d1"},{"name":"Joe","item":"e2"},{"name":"Joe","item":"f2"},
     //  {"name":"John","item":"g3"}]
     ```
     */
    SelectMany<TCollection,TResult>(collectionSelector : (list:T, index?:number)=>IEnumerable<TCollection>, resultSelector : (list:T, item:TCollection)=>TResult) : IEnumerable<TResult>;
    /**
     * Projects each element of a sequence to an `IEnumerable<T>`, and flattens the resulting sequences into one sequence. The index of each source element is used in the projected form of that element.
     * @param collectionSelector - A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
     * @returns An `IEnumerable<T>` whose elements are the result of invoking the one-to-many transform function on each element of an input sequence.
     ```javascript
     let people = [
          { Name:"Jane", Items: [ "a", "b" ] },
          { Name:"Jack", Items: [ "c", "d" ] },
          { Name:"Joe", Items: [ "e", "f" ] },
          { Name:"John", Items: [ "g" ] },
        ]

     people.SelectMany((t,i) => t.Items.Select((z)=>z+i)).ToArray();
     // ["a0", "b0", "c1", "d1", "e2", "f2", "g3"]
     ```
     */
    SelectMany<TResult>(collectionSelector : (list:T, index?:number)=>IEnumerable<TResult>) : IEnumerable<TResult>;

    /**
     * Determines whether two sequences are equal by comparing their elements by using a specified `IEqualityComparer<T>`.
     * @param second - An `IEnumerable<T>` to compare to the first sequence.
     * @param comparer - An `IEqualityComparer<T>` to use to compare elements.
     * @returns true if the two source sequences are of equal length and their corresponding elements compare equal according to comparer; otherwise, false.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.SequenceEqual([{Name:"Jack"}, {Name:"Joe"}, {Name:"Jack"}], nameComparer)
     // true
     people.SequenceEqual([{Name:"Jack"}, {Name:"Jack"}], nameComparer)
     // false
     ```
     */
    SequenceEqual(second : IEnumerable<T>, comparer? : IEqualityComparer<T>) : boolean;

    /**
     * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
     * @param predicate - A function to test an element for a condition.
     * @returns The single element of the input sequence that satisfies a condition.
     ```javascript
     [1,2,3,4].Single(t=>t>3)
     // 4
     [1,2,3,4].Single(t=>t>2)
     // Error - Uncaught More than 1 element
     [1].Single()
     // 1
     [1,2].Single()
     // Error - Uncaught More than 1 element
     [].Single()
     // Error - Uncaught No element
     ```
     */
    Single(predicate? : (item:T)=>boolean) : T;

    /**
     * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.
     * @param predicate - A function to test an element for a condition.
     * @param defaultValue - Default value if no element is found.
     * @returns The single element of the input sequence that satisfies the condition, or default value if no such element is found.
     ```javascript
     [1,2,3,4].SingleOrDefault(t=>t>3, 123)
     // 4
     [1,2,3,4].SingleOrDefault(t=>t>2, 123)
     // Error - Uncaught More than 1 element
     [1].SingleOrDefault()
     // 1
     [1].SingleOrDefault(t=>true, 123)
     // 1
     [1,2].SingleOrDefault()
     // Error - Uncaught More than 1 element
     [].SingleOrDefault(t=>true, 123)
     // 123
     [].SingleOrDefault()
     // null
     ```
     */
    SingleOrDefault(predicate? : (item:T)=>boolean, defaultValue? : T) : T;

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count - The number of elements to skip before returning the remaining elements.
     * @returns An `IEnumerable<T>` that contains the elements that occur after the specified index in the input sequence.
     ```javascript
     [1,2,3,4,5].Skip(4).ToArray()
     // [5]
     ```
     */
    Skip(count : number) : IEnumerable<T>;

    /**
     * Skip a specified number of elements at the end of a sequence.
     * @param count - The number of elements to skip at the end of a sequence.
     * @returns An `IEnumerable<T>` that contains the elements that occur at the beginning of a sequence without a specified number of elements at the end.
     ```javascript
     [1,2,3,4,5].SkipLast(2).ToArray()
     // [1, 2, 3]
     ```
     */
    SkipLast(count : number) : IEnumerable<T>;

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
     * @param predicate - A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     * @returns An `IEnumerable<T>` that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
     ```javascript
     [1,2,3,4,5].SkipWhile((t,i) => i < 3).ToArray()
     // [4, 5]
     [1,2,3,4,5].SkipWhile((t) => t < 3).ToArray()
     // [3, 4, 5]
     ```
     */
    SkipWhile(predicate : (item:T, index?:number)=>boolean) : IEnumerable<T>;

    // declare optional parameter only for Enumerable<number>, no language feature
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector - A transform function to apply to each element.
     * @returns The sum of the projected values.
     ```javascript
     [1,2,3,4,5].Sum()
     // 15
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.Sum(t=>t.Age)
     // 60
     ```
     */
    Sum(selector?: (item : T)=>number) : number;

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count - The number of elements to return.
     * @returns An `IEnumerable<T>` that contains the specified number of elements from the start of the input sequence.
     ```javascript
     [1,2,3,4,5].Take(3).ToArray()
     // [1, 2, 3]
     ```
     */
    Take(count : number) : IEnumerable<T>;

    /**
     * Take a specified number of elements at the end of a sequence.
     * @param count - The number of elements to return.
     * @returns An `IEnumerable<T>` that contains the specified number of elements from the end of the input sequence.
     ```javascript
     [1,2,3,4,5].TakeLast(3).ToArray()
     // [3, 4, 5]
     ```
     */
    TakeLast(count : number) : IEnumerable<T>;

    /**
     * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.
     * @param predicate - A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     * @returns An `IEnumerable<T>` that contains elements from the input sequence that occur before the element at which the test no longer passes.
     ```javascript
     [1,5,9,12,45,6].TakeWhile((t,i)=>i<5).ToArray()
     // [1, 5, 9, 12, 45]
     [1,5,9,12,45,6].TakeWhile((t)=>t<12).ToArray()
     // [1, 5, 9]
     ```
     */
    TakeWhile(predicate : (item:T, index?:number)=>boolean) : IEnumerable<T>;

    /**
     * Creates an array from a `IEnumerable<T>`.
     * @returns An array that contains the elements from the input sequence.
     ```javascript
     new Set([1,5,9,8]).ToArray()
     // [1, 5, 9, 8]
     ```
     */
    ToArray() : T[];

    /**
     * Creates a `Dictionary<TKey,TValue>` from an `IEnumerable<T>` according to a specified key selector function, a comparer, and an element selector function.
     * @param keySelector - A function to extract a key from each element.
     * @param elementSelector - A transform function to produce a result element value from each element.
     * @param comparer - An `IEqualityComparer<T>` to compare keys.
     * @returns A `Dictionary<TKey,TValue>` that contains values of type `TValue` selected from the input sequence.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jane", Age:20}]
     people.ToDictionary(t=>({Name:t.Name}), t=>t.Age, nameComparer).ToArray()
     // [{"Key":{"Name":"Jack"},"Value":18},{"Key":{"Name":"Joe"},"Value":22},{"Key":{"Name":"Jane"},"Value":20}]
     people.ToDictionary(t=>t.Name, t=>t.Age).ToArray()
     // [{"Key":"Jack","Value":18},{"Key":"Joe","Value":22},{"Key":"Jane","Value":20}]
     ```
     */
    ToDictionary<TKey, TValue>(keySelector : (item:T)=>TKey, elementSelector? : (item:T)=>TValue, comparer? : IEqualityComparer<T>) : Dictionary<TKey, TValue>;
    /**
     * Creates a `Dictionary<TKey,TValue>` from an `IEnumerable<T>` according to a specified key selector function and key comparer.
     * @param keySelector - A function to extract a key from each element.
     * @param comparer - An `IEqualityComparer<T> `to compare keys.
     * @returns A `Dictionary<TKey,TValue>` that contains keys and values.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jane", Age:20}]
     people.ToDictionary(t=>({Name:t.Name}), nameComparer).ToArray()
     // [{"Key":{"Name":"Jack"},"Value":{"Name":"Jack","Age":18}},{"Key":{"Name":"Joe"},"Value":{"Name":"Joe","Age":22}},{"Key":{"Name":"Jane"},"Value":{"Name":"Jane","Age":20}}]
     people.ToDictionary(t=>t.Name).ToArray()
     // [{"Key":"Jack","Value":{"Name":"Jack","Age":18}},{"Key":"Joe","Value":{"Name":"Joe","Age":22}},{"Key":"Jane","Value":{"Name":"Jane","Age":20}}]
     ```
     */
    ToDictionary<TKey, TValue>(keySelector : (item:T)=>TKey, comparer : IEqualityComparer<T>) : Dictionary<TKey, TValue>;

    /**
     * Creates a `HashSet<T>` from an `IEnumerable<T>` using the comparer to compare keys.
     * @param comparer - An IEqualityComparer<T> to compare keys.
     * @returns A `HashSet<T>` that contains values of type `T` selected from the input sequence.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.ToHashSet(nameComparer).ToArray()
     // [{"Name":"Jack","Age":18},{"Name":"Joe","Age":22}]
     ```
     */
    ToHashSet(comparer? : IEqualityComparer<T>) : HashSet<T>;

    /**
     * Creates a `List<T>` from an `IEnumerable<T>`.
     * @param comparer - An `IComparer<TKey>` to compare keys.
     * @returns A `List<T>` that contains elements from the input sequence.
     ```javascript
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     let mylist = people.ToList()
     mylist.Add({Name:"Jane", Age:19})
     mylist.ToArray()
     // [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}, {Name:"Jane", Age:19}]
     ```
     */
    ToList(comparer? : IComparer<T>) : List<T>;

    /**
     * Creates a `Lookup<TKey,TElement>` from an `IEnumerable<T>` according to a specified key selector function, a comparer and an element selector function.
     * @param keySelector - A function to extract a key from each element.
     * @param elementSelector - A transform function to produce a result element value from each element.
     * @param comparer - An `IEqualityComparer<T>` to compare keys.
     * @returns A `Lookup<TKey,TElement>` that contains values of type `TElement` selected from the input sequence.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.ToLookup(t=>({Name:t.Name}), t=>t.Age, nameComparer).Select(t=>({Name:t.Key.Name, Ages:t.ToArray()})).ToArray()
     // [{"Name":"Jack","Ages":[18,20]},{"Name":"Joe","Ages":[22]}]
     people.ToLookup(t=>t.Name, t=>t.Age).Select(t=>({Name:t.Key, Ages:t.ToArray()})).ToArray()
     // [{"Name":"Jack","Ages":[18,20]},{"Name":"Joe","Ages":[22]}]
     ```
     */
    ToLookup<TKey, TElement>(keySelector : (item:T)=>TKey, elementSelector? : (item:T)=>TElement, comparer? : IEqualityComparer<T>) : Lookup<TKey, TElement>;
    /**
     * Creates a `Lookup<TKey,TElement>` from an `IEnumerable<T>` according to a specified key selector function and key comparer.
     * @param keySelector - A function to extract a key from each element.
     * @param comparer - An `IEqualityComparer<T>` to compare keys.
     * @returns A `Lookup<TKey,TElement>` that contains keys and values.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.ToLookup(t=>({Name:t.Name}), nameComparer).Select(t=>({Name:t.Key.Name, Ages:t.ToArray()})).ToArray()
     // [{"Name":"Jack","Ages":[{"Name":"Jack","Age":18},{"Name":"Jack","Age":20}]},{"Name":"Joe","Ages":[{"Name":"Joe","Age":22}]}]
     people.ToLookup(t=>t.Name).Select(t=>({Name:t.Key, Ages:t.ToArray()})).ToArray()
     // [{"Name":"Jack","Ages":[{"Name":"Jack","Age":18},{"Name":"Jack","Age":20}]},{"Name":"Joe","Ages":[{"Name":"Joe","Age":22}]}]
     ```
     */
    ToLookup<TKey, TElement>(keySelector : (item:T)=>TKey, comparer : IEqualityComparer<T>) : Lookup<TKey, TElement>;
    
    /**
     * Creates a `Map<TKey,TElement>` from an `IEnumerable<T>` according to a specified key selector function and an element selector function.
     * @param keySelector - A function to extract a key from each element.
     * @param elementSelector - A transform function to produce a result element value from each element.
     * @returns A `Map<TKey,TElement>` that contains values of type `TElement` selected from the input sequence.
     ```javascript
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jane", Age:20}]
     people.ToMap(t=>t.Name, t=>t.Age)
     // Map {"Jack" => 18, "Joe" => 22, "Jane" => 20}
     people.ToMap(t=>t.Name)
     // Map {"Jack" => {"Name":"Jack","Age":18}, "Joe" => {"Name":"Joe","Age":22}, "Jane" => {"Name":"Jane","Age":20}}
     ```
     */
    ToMap<TKey,TElement>(keySelector : (item:T)=>TKey, elementSelector? : (item:T)=>TElement) : Map<TKey, TElement>;

    /**
     * Creates a `Set<T>` from an `IEnumerable<T>`.
     * @returns A `HashSet<T>` that contains values of type `T` selected from the input sequence.
     ```javascript
     [1,2,5,3,2,5,1].ToSet()
     // Set {1, 2, 5, 3}
     ```
     */
    ToSet() : Set<T>;

    /**
     * Produces the set union of two sequences by using a specified `IEqualityComparer<T>`.
     * @param second - An `IEnumerable<T>` whose distinct elements form the second set for the union.
     * @param comparer - The `IEqualityComparer<T>` to compare values.
     * @returns An `IEnumerable<T>` that contains the elements from both input sequences, excluding duplicates.
     ```javascript
     [1,2,5,2].Union([3,4,5]).ToArray()
     // [1, 2, 5, 3, 4]
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:20}]
     people.Union([{Name:"Jack", Age:35}, {Name:"Jane", Age:23}], nameComparer).ToArray()
     // [{"Name":"Jack","Age":18},{"Name":"Joe","Age":22},{"Name":"Jane","Age":23}]
     ```
     */
    Union(second : IEnumerable<T>, comparer? : IEqualityComparer<T>) : IEnumerable<T>;

    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate - A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     * @returns An `IEnumerable<T>` that contains elements from the input sequence that satisfy the condition.
     ```javascript
     [1,5,6,4,3,2,1,8,9].Where((t,i)=>t>3 && i>2).ToArray()
     // [4, 8, 9]
     ```
     */
    Where(predicate : (item:T, index?:number)=>boolean) : IEnumerable<T>;

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     * @param second - The second sequence to merge.
     * @param resultSelector - A function that specifies how to merge the elements from the two sequences.
     * @returns An `IEnumerable<T>` that contains merged elements of two input sequences.
     ```javascript
     let names = ["Jack", "Jane", "Joe"]
     let ages = [20, 22, 25]
     names.Zip(ages, (Name, Age)=>({Name, Age})).ToArray()
     // [{"Name":"Jack","Age":20},{"Name":"Jane","Age":22},{"Name":"Joe","Age":25}]
     ```
     */
    Zip<TSecond,TResult>(second : IEnumerable<TSecond>, resultSelector : (first:T, second:TSecond)=>TResult) : IEnumerable<TResult>;
}

// Sequence/Enumerable
/**
 * Proved a methods to create `IEnumerable<T>` and to define methods on `IEnumerable<T>`.
 */
declare class Enumerable<T> {
    /**
     * Generates an `IEnumerable<T>` from generator, and objects which implements enumerator.
     * @param source - Source from which an `IEnumerable<T>` is created.
     * @returns Returns the source typed as `IEnumerable<T>`.
     ```javascript
     let naturalNumbers = Enumerable.From(function* () {
         let i = 0;
         while (true) yield i++;
     })
     naturalNumbers.Take(10).ToArray()
     // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     ```
     */
    static From<T>(source : (()=>IterableIterator<T>) | IEnumerable<T> ) : IEnumerable<T>;

    /**
     * Generates a sequence of integral numbers within a specified range.
     * @param start - The value of the first integer in the sequence.
     * @param count - The number of sequential integers to generate.
     * @returns An `IEnumerable<number>` that contains a range of sequential integral numbers.
     ```javascript
     let smallNaturalNumbers = Enumerable.Range(0,10)
     smallNaturalNumbers.ToArray()
     // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     ```
     */
    static Range(start:number, count:number) : IEnumerable<number>;

    /**
     * Generates a sequence that contains one repeated value.
     * @param value - The value to be repeated.
     * @param count - The number of times to repeat the value in the generated sequence.
     * @returns An `IEnumerable<T>` that contains a repeated value.
     ```javascript
     let numbers = Enumerable.Repeat(5,10)
     numbers.ToArray()
     // [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
     ```
     */
    static Repeat<T>(value:T, count:number) : IEnumerable<T>;

    /**
     * Returns an empty `IEnumerable<T>` that has the specified type argument.
     * @returns An empty `IEnumerable<T>` whose type argument is T.
     ```javascript
     Enumerable.Empty().Concat([1,2,3]).ToArray()
     // [1, 2, 3]
     ```
     */
    static Empty<T>() : IEnumerable<T>;

    /**
     * Set new method for querying IEnumerable objects.
     * @param methodName - Name of the new method.
     * @param fun - Generator function or normal function for querying IEnumerable objects.
     ```javascript
     Enumerable.setMethod("EvenElements", function*() {
        let ind = 0;
        for (let t of this)
            if (ind++%2 === 0) yield t;
     });
     ["a","b","c","d"].EvenElements().ToArray();
     ```
     */
    static setMethod<T>(methodName:string, fun : (...args:any[])=>(T | (()=>IterableIterator<T>))) : void;
}

// Sequence/OrderedEnumerable
/**
 * Represents a sorted sequence.
 */
declare class IOrderedEnumerable<T> extends IEnumerable<T> {
    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order by using a specified comparer.
     * @param keySelector - A function to extract a key from each element.
     * @param comparer - An `IComparer<TKey>` to compare keys.
     * @returns An `IOrderedEnumerable<T>` whose elements are sorted according to a key.
     ```javascript
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:22}, {Name:"Jack", Age:16}]
     people.OrderBy(t=>t.Name).ToArray()
     // [{"Name":"Jack","Age":18},{"Name":"Jack","Age":16},{"Name":"Joe","Age":22}]
     people.OrderBy(t=>t.Name).ThenBy(t=>t.Age).ToArray()
     // [{"Name":"Jack","Age":16},{"Name":"Jack","Age":18},{"Name":"Joe","Age":22}]
     ```
     */
    ThenBy<TKey>(keySelector : (item : T)=>TKey, comparer? : IComparer<TKey>) : IOrderedEnumerable<T>;

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order.
     * @param keySelector - A function to extract a key from each element.
     * @param comparer - An `IComparer<TKey>` to compare keys.
     * @returns An `IOrderedEnumerable<T>` whose elements are sorted in descending order according to a key.
     ```javascript
     let people = [{Name:"Jack", Age:18}, {Name:"Joe", Age:18}, {Name:"Jack", Age:16}]
     people.OrderBy(t=>t.Age).ToArray()
     // [{"Name":"Jack","Age":16},{"Name":"Jack","Age":18},{"Name":"Joe","Age":18}]
     people.OrderBy(t=>t.Age).ThenByDescending(t=>t.Name).ToArray()
     // [{"Name":"Jack","Age":16},{"Name":"Joe","Age":18},{"Name":"Jack","Age":18}]
     ```
     */
    ThenByDescending<TKey>(keySelector : (item : T)=>TKey, comparer? : IComparer<TKey>) : IOrderedEnumerable<T>;
}

// Sequence/IGrouping
/**
 * Represents a collection of objects that have a common key.
 */
declare class IGrouping<TKey,TElement> extends IEnumerable<TElement> {
    /**
     * Gets the key of the `IGrouping<TKey,TElement>`.
     */
    readonly Key : TKey;
}

// DataStructures/HashSet
/**
 * Represents a set of values.
 */
declare class HashSet<T> extends IEnumerable<T> {
    /**
     * Initializes a new instance of the `HashSet<T>` class that is empty and uses the default equality comparer for the set type.
     ```javascript
     let hashset = new HashSet()
     ```
     */
    constructor();
    /**
     * Initializes a new instance of the `HashSet<T>` class that uses the specified equality comparer for the set type, contains elements copied from the specified collection.
     * @param collection - The collection whose elements are copied to the new set.
     * @param comparer - The `IEqualityComparer<T>` implementation to use when comparing values in the set, or null to use the default `EqualityComparer<T>` implementation for the set type.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let hashset = new HashSet([{Name:"Jack", Age:20}, {Name:"John", Age:20}], nameComparer)
     ```
     */
    constructor(collection : IEnumerable<T>, comparer? : IEqualityComparer<T>);
    /**
     * Initializes a new instance of the `HashSet<T>` class that uses the specified equality comparer for the set type.
     * @param comparer - The `IEqualityComparer<T>` implementation to use when comparing values in the set, or null to use the default `IEqualityComparer<T>` implementation for the set type.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let hashset = new HashSet(nameComparer)
     ```
     */
    constructor(comparer : IEqualityComparer<T>);
    
    /**
     * Gets the `IEqualityComparer<T>` object that is used to determine equality for the values in the set.
     */
    readonly Comparer : IEqualityComparer<T>;
    /**
     * Gets the number of elements that are contained in a set.
     ```javascript
     let hs = new HashSet()
     hs.Add(1)
     // true
     hs.Add(2)
     // true
     hs.CountNative
     // 2
     ```
     */
    readonly CountNative : number;

    /**
     * Adds the specified element to a set.
     * @param item - The element to add to the set.
     * @returns true if the element is added to the `HashSet<T>` object; false if the element is already present.
     ```javascript
     let hs = new HashSet()
     hs.Add(1)
     // true
     hs.Add(1)
     // false
     ```
     */
    Add(item : T): boolean;

    /**
     * Removes all elements from a `HashSet<T>` object.
     ```javascript
     let hs = new HashSet()
     hs.Add(1)
     // true
     hs.Add(2)
     // true
     hs.Clear()
     hs.CountNative
     // 0
     ```
     */
    Clear() : void;

    /**
     * Determines whether a `HashSet<T>` object contains the specified element.
     * @param item The element to locate in the `HashSet<T>` object.
     * @returns true if the `HashSet<T>` object contains the specified element; otherwise, false.
     ```javascript
     let hs = new HashSet()
     hs.Add(1)
     // true
     hs.ContainsNative(1)
     // true
     hs.ContainsNative(2)
     // false
     ```
     */
    ContainsNative(item : T) : boolean;

    /**
     * Copies the specified number of elements of a `HashSet<T>` object to an array, starting at the specified array index.
     * @param array - The one-dimensional array that is the destination of the elements copied from the `HashSet<T>` object. The array must have zero-based indexing.
     * @param arrayIndex - The zero-based index in array at which copying begins.
     * @param count - The number of elements to copy to array.
     ```javascript
     let hs1 = new HashSet()
     hs1.Add(1)
     hs1.Add(2)
     hs1.Add(3)
    
     var setArr = [1,2,3,4,5,6,7,8,9]
    
     hs1.CopyTo(setArr, 4, 2)
     setArr
     // [1, 2, 3, 4, 1, 2, 7, 8, 9]
     ```
     */
    CopyTo(array : T[], arrayIndex? : number, count? : number) : void;

    /**
     * Returns an `IEqualityComparer<HashSet<T>>` object that can be used for equality testing of a `HashSet<T>` object.
     * @returns An `IEqualityComparer<HashSet<T>>` object that can be used for deep equality testing of the `HashSet<T>` object.
     ```javascript
     let hs1 = new HashSet([new HashSet([1,2,3]), new HashSet([7,8,9]), new HashSet([4,5,6])])
     let hs2 = new HashSet([new HashSet([1,2,3]), new HashSet([7,8,9]), new HashSet([4,5,6])])
     let hs3 = new HashSet([new HashSet([1,2,3,4]), new HashSet([4,5,6]), new HashSet([7,8,9])])
     hs1.SequenceEqual(hs2, hs1.CreateSetComparer())
     // true
     hs1.SequenceEqual(hs3, hs1.CreateSetComparer())
     // false
     ```
     */
    CreateSetComparer() : IEqualityComparer<HashSet<T>>;

    /**
     * Removes all elements in the specified collection from the current `HashSet<T>` object.
     * @param other - The collection of items to remove from the `HashSet<T>` object.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4])
     hs1.ExceptWith(hs2)
     hs1.ToArray()
     // [1, 5]
     ```
     */
    ExceptWith(other : IEnumerable<T>) : void;

    /**
     * Modifies the current `HashSet<T>` object to contain only elements that are present in that object and in the specified collection.
     * @param other The collection to compare to the current `HashSet<T>` object.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4])
     hs1.IntersectWith(hs2)
     hs1.ToArray()
     // [2, 3, 4]
     ```
     */
    IntersectWith(other : IEnumerable<T>) : void;

    /**
     * Determines whether a `HashSet<T>` object is a proper subset of the specified collection.
     * @param other - The collection to compare to the current `HashSet<T>` object.
     * @returns true if the `HashSet<T>` object is a proper subset of other; otherwise, false.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4])
     let hs3 = new HashSet([2,3,4])
     hs2.IsProperSubsetOf(hs1)
     // true
     hs2.IsProperSubsetOf(hs3)
     // false
     ```
     */
    IsProperSubsetOf(other : IEnumerable<T>) : boolean;

    /**
     * Determines whether a `HashSet<T>` object is a proper superset of the specified collection.
     * @param other - The collection to compare to the current HashSet<T> object.
     * @returns true if the `HashSet<T>` object is a proper superset of other; otherwise, false.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4])
     let hs3 = new HashSet([2,3,4])
     hs1.IsProperSupersetOf(hs2)
     // true
     hs2.IsProperSupersetOf(hs3)
     // false
     ```
     */
    IsProperSupersetOf(other : IEnumerable<T>) : boolean;

    /**
     * Determines whether a `HashSet<T>` object is a subset of the specified collection.
     * @param other - The collection to compare to the current `HashSet<T>` object.
     * @returns true if the `HashSet<T>` object is a subset of other; otherwise, false.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4])
     let hs3 = new HashSet([2,3,4])
     hs2.IsSubsetOf(hs1)
     // true
     hs1.IsSubsetOf(hs2)
     // false
     hs2.IsSubsetOf(hs3)
     // true
     ```
     */
    IsSubsetOf(other : IEnumerable<T>) : boolean;

    /**
     * Determines whether a `HashSet<T>` object is a superset of the specified collection.
     * @param other - The collection to compare to the current `HashSet<T>` object.
     * @returns true if the `HashSet<T>` object is a superset of other; otherwise, false.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4])
     let hs3 = new HashSet([2,3,4])
     hs2.IsSupersetOf(hs1)
     // false
     hs1.IsSupersetOf(hs2)
     // true
     hs2.IsSupersetOf(hs3)
     // true
     ```
     */
    IsSupersetOf(other : IEnumerable<T>) : boolean;

    /**
     * Determines whether the current `HashSet<T>` object and a specified collection share common elements.
     * @param other - The collection to compare to the current `HashSet<T>` object.
     * @returns true if the `HashSet<T>` object and other share at least one common element; otherwise, false.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([6,7,8])
     let hs3 = new HashSet([3,6,7,8])
     hs1.Overlaps(hs2)
     // false
     hs1.Overlaps(hs3)
     // true
     hs2.Overlaps(hs3)
     // true
     ```
     */
    Overlaps(other : IEnumerable<T>) : boolean;

    /**
     * Removes the specified element from a `HashSet<T>` object.
     * @param item - The element to remove.
     * @returns true if the element is successfully found and removed; otherwise, false. This method returns false if item is not found in the `HashSet<T>` object.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     hs1.Remove(3)
     // true
     hs1.Remove(15)
     // false
     hs1.ToArray()
     // [1, 2, 4, 5]
     ```
     */
    Remove(item : T) : boolean;

    /**
     * Removes all elements that match the conditions defined by the specified predicate from a `HashSet<T>` collection.
     * @param match - The function that defines the conditions of the elements to remove.
     * @returns The number of elements that were removed from the `HashSet<T>` collection.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     hs1.RemoveWhere(t=>t%2==0)
     // 2
     [...hs1]
     // [1, 3, 5]
     ```
     */
    RemoveWhere(match : (item : T) => boolean) : number;

    /**
     * Determines whether a `HashSet<T>` object and the specified collection contain the same elements.
     * @param other - The collection to compare to the current `HashSet<T>` object.
     * @returns true if the `HashSet<T>` object is equal to other; otherwise, false.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4])
     let hs3 = new HashSet([2,4,3])
     hs1.SetEquals(hs2)
     // false
     hs2.SetEquals(hs3)
     // true
     ```
     */
    SetEquals(other : IEnumerable<T>) : boolean;

    /**
     * Modifies the current `HashSet<T>` object to contain only elements that are present either in that object or in the specified collection, but not both.
     * @param other - The collection to compare to the current `HashSet<T>` object.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4,5,6])
     hs1.SymmetricExceptWith(hs2)
     [...hs1]
     // [1, 6]
     ```
     */
    SymmetricExceptWith(other : IEnumerable<T>) : void;

    /**
     * Searches the set for a given value and returns the equal value it finds, if any.
     * @param equalValue The value to search for.
     * @returns An object with properties actualValue and contains indicating whether the search was successful.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     hs1.TryGetValue(2)
     // {actualValue: 2, contains: true}
     hs1.TryGetValue(6)
     // {actualValue: undefined, contains: false}
     ```
     */
    TryGetValue(equalValue : T) : {actualValue:T, contains:boolean};

    /**
     * Modifies the current `HashSet<T>` object to contain all elements that are present in itself, the specified collection, or both.
     * @param other - The collection to compare to the current `HashSet<T>` object.
     ```javascript
     let hs1 = new HashSet([1,2,3,4,5])
     let hs2 = new HashSet([2,3,4,5,6])
     hs1.UnionWith(hs2)
     [...hs1]
     // [1, 2, 3, 4, 5, 6]
     ```
     */
    UnionWith(other : IEnumerable<T>) : void;
}

// DataStructures/Dictionary
/**
 * Represents a collection of keys and values.
 */
declare class Dictionary<TKey,TValue> extends IEnumerable<KeyValuePair<TKey,TValue>> {
    /**
     * Initializes a new instance of the `Dictionary<TKey,TValue>` class that is empty, and uses the default equality comparer for the key type.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.Add(2,"Joe")
     dict1.ToArray()
     // [{"Key":1,"Value":"Jack"},{"Key":2,"Value":"Joe"}]
     ```
     */
    constructor();

    /**
     * Initializes a new instance of the `Dictionary<TKey,TValue>` class that contains elements copied from the specified `IEnumerable<KeyValuePair<TKey, TValue>>` and uses the specified `IEqualityComparer<T>`.
     * @param dictionary - The `IEnumerable<KeyValuePair<TKey, TValue>>` whose elements are copied to the new `Dictionary<TKey,TValue>`.
     * @param comparer - The `IEqualityComparer<T>` implementation to use when comparing keys, or null to use the default equality comparer.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let dict1 = new Dictionary([{Key:{Name:"Jack"}, Value:20}, {Key:{Name:"John"}, Value:20}], nameComparer)
     ```
     */
    constructor(dictionary : IEnumerable<KeyValuePair<TKey, TValue>>, comparer? : IEqualityComparer<TKey>);

    /**
     * Initializes a new instance of the `Dictionary<TKey,TValue>` class that is empty, and uses the specified `IEqualityComparer<T>`.
     * @param comparer - The `IEqualityComparer<T>` implementation to use when comparing keys, or null to use the default Eequality comparer.
     ```javascript
     let nameComparer = {
        Equals: (a,b) => a.Name===b.Name,
        GetHashCode: a => a.Name
     }
     let dict1 = new Dictionary(nameComparer)
     ```
     */
    constructor(comparer : IEqualityComparer<TKey>);

    /**
     * Gets the `IEqualityComparer<T>` that is used to determine equality of keys for the dictionary.
     */
    readonly Comparer : IEqualityComparer<TKey>;
    
    /**
     * Gets the number of key/value pairs contained in the `Dictionary<TKey,TValue>`.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.Add(2,"Joe")
     dict1.CountNative
     // 2
     ```
     */
    readonly CountNative : number;

    /**
     * Gets a collection containing the keys in the `Dictionary<TKey,TValue>`.
     ```javascript
     let dict1 = new Dictionary()
     let keys = dict1.Keys
     dict1.Add(1,"Jack")
     dict1.Add(2,"Joe")
     [...keys]
     // [1, 2]
     ```
     */
    readonly Keys : Dictionary.KeyCollection<TKey,TValue>;

    /**
     * Gets a collection containing the values in the `Dictionary<TKey,TValue>`.
     ```javascript
     let dict1 = new Dictionary()
     let values = dict1.Values
     dict1.Add(1,"Jack")
     dict1.Add(2,"Joe")
     [...values]
     // ["Jack", "Joe"]
     ```
     */
    readonly Values : Dictionary.ValueCollection<TKey,TValue>;
    
    /**
     * Gets the value associated with the specified key.
     * @param key - The key of the value to get.
     * @returns The value associated with the specified key.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.Get(1)
     // "Jack"
     ```
     */
    Get(key : TKey) : TValue;

    /**
     * Sets the value associated with the specified key. Override the value if the key exists.
     * @param key - The key of the value to set.
     * @param value - The value to set.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.Set(1,"Joe")
     dict1.Set(2,"Jane")
     dict1.ToArray()
     // [{"Key":1,"Value":"Joe"},{"Key":2,"Value":"Jane"}]
     ```
     */
    Set(key : TKey, value: TValue) : void;

    /**
     * Adds the specified key and value to the dictionary. The method throws an Error when attempting to add a duplicate key.
     * @param key - The key of the element to add.
     * @param value - The value of the element to add.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.ToArray()
     // [{"Key":1,"Value":"Jack"}]
     ```
     */
    Add(key : TKey, value : TValue) : void;

    /**
     * Removes all keys and values from the `Dictionary<TKey,TValue>`.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.Clear()
     dict1.ToArray()
     // []
     ```
     */
    Clear() : void;

    /**
     * Determines whether the `Dictionary<TKey,TValue>` contains the specified key.
     * @param key - The key to locate in the `Dictionary<TKey,TValue>`.
     * @returns true if the `Dictionary<TKey,TValue>` contains an element with the specified key; otherwise, false.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.ContainsKey(1)
     // true
     dict1.ContainsKey(2)
     // false
     ```
     */
    ContainsKey(key : TKey) : boolean;

    /**
     * Determines whether the `Dictionary<TKey,TValue>` contains a specific value.
     * @param value - The value to locate in the `Dictionary<TKey,TValue>`.
     * @returns true if the `Dictionary<TKey,TValue>` contains an element with the specified value; otherwise, false.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.ContainsValue("Jack")
     // true
     dict1.ContainsValue("Joe")
     // false
     ```
     */
    ContainsValue(value : TValue) : boolean;

    /**
     * Removes the value with the specified key from the `Dictionary<TKey,TValue>`.
     * @param key - The key of the element to remove.
     * @returns true if the element is successfully found and removed; otherwise, false. This method returns false if key is not found in the `Dictionary<TKey,TValue>`.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.Add(2,"Joe")
     dict1.Remove(1)
     // true
     dict1.Remove(3)
     // false
     dict1.ToArray()
     // [{"Key":2,"Value":"Joe"}]
     ```
     */
    Remove(key : TKey) : boolean;

    /**
     * Try to add the specified key and value to the dictionary. The method returns false when attempting to add a duplicate key.
     * @param key - The key of the element to add.
     * @param value - The value of the element to add.
     * @returns true if key and value are successfully added and false if key is already present.
     ```javascript
     let dict1 = new Dictionary()
     dict1.TryAdd(1,"Jack")
     // true
     dict1.TryAdd(1,"Joe")
     // false
     ```
     */
    TryAdd(key : TKey, value : TValue) : boolean;

    /**
     * Gets the value associated with the specified key.
     * @param key - The key of the value to get.
     * @returns An object with properties value and contains indicating whether the search was successful.
     ```javascript
     let dict1 = new Dictionary()
     dict1.Add(1,"Jack")
     dict1.TryGetValue(1)
     // {value: "Jack", contains: true}
     dict1.TryGetValue(2)
     // {value: undefined, contains: false}
     ```
     */
    TryGetValue(key : TKey) : {value:TValue, contains:boolean};
}

declare namespace Dictionary {
    /**
     * Represents the collection of keys in a `Dictionary<TKey,TValue>`.
     */
    class KeyCollection<TKey, TValue> extends IEnumerable<TKey> {

        /**
         * Initializes a new instance of the `Dictionary.KeyCollection<TKey,TValue>` class that reflects the keys in the specified `Dictionary<TKey,TValue>`.
         * @param dictionary - The `Dictionary<TKey,TValue>` whose keys are reflected in the new `Dictionary.KeyCollection<TKey,TValue>`.
         */
        constructor(dictionary : Dictionary<TKey, TValue>);

        /**
         * Gets the number of elements contained in the `Dictionary.KeyCollection<TKey,TValue>`.
         ```javascript
         let dict1 = new Dictionary()
         let keys = dict1.Keys
         dict1.Add(1,"Jack")
         dict1.Add(2,"Joe")
         keys.CountNative
         // 2
         ```
         */
        readonly CountNative : number;

        /**
         * Copies the `Dictionary.KeyCollection<TKey,TValue>` elements to an existing one-dimensional array, starting at the specified array index.
         * @param array - The one-dimensional array that is the destination of the elements copied from `Dictionary.KeyCollection<TKey,TValue>`. The Array must have zero-based indexing.
         * @param index - The zero-based index in array at which copying begins.
         ```javascript
         let dict1 = new Dictionary()
         let keys = dict1.Keys
         dict1.Add(1,"Jack")
         dict1.Add(2,"Joe")
         let arr = [1,2,3,4,5,6]
         keys.CopyTo(arr, 4)
         arr
         // [1, 2, 3, 4, 1, 2]
         ```
         */
        CopyTo(array : TKey[], index : number) : void;
    }

    /**
     * Represents the collection of values in a `Dictionary<TKey,TValue>`.
     */
    class ValueCollection<TKey, TValue> extends IEnumerable<TValue> {
        /**
         * Initializes a new instance of the `Dictionary.ValueCollection<TKey,TValue>` class that reflects the values in the specified `Dictionary<TKey,TValue>`.
         * @param dictionary - The `Dictionary<TKey,TValue>` whose values are reflected in the new `Dictionary.ValueCollection<TKey,TValue>`.
         */
        constructor(dictionary : Dictionary<TKey, TValue>);

        /**
         * Gets the number of elements contained in the `Dictionary.ValueCollection<TKey,TValue>`.
         ```javascript
         let dict1 = new Dictionary()
         let values = dict1.Values
         dict1.Add(1,"Jack")
         dict1.Add(2,"Joe")
         values.CountNative
         // 2
         ```
         */
        readonly CountNative : number;

        /**
         * Copies the `Dictionary.ValueCollection<TKey,TValue>` elements to an existing one-dimensional array, starting at the specified array index.
         * @param array - The one-dimensional array that is the destination of the elements copied from `Dictionary.ValueCollection<TKey,TValue>`. The Array must have zero-based indexing.
         * @param index - The zero-based index in array at which copying begins.
         ```javascript
         let dict1 = new Dictionary()
         let values = dict1.Values
         dict1.Add(1,"Jack")
         dict1.Add(2,"Joe")
         let arr = [1,2,3,4,5,6]
         values.CopyTo(arr, 4)
         arr
         // [1, 2, 3, 4, "Jack", "Joe"]
         ```
         */
        CopyTo(array : TValue[], index : number) : void;
    }
}

// DataStructures/List
/**
 * Represents a list of objects that can be accessed by index. Provides methods to search, sort, and manipulate lists.
 */
declare class List<T> extends IEnumerable<T> {
    
    /**
     * Initializes a new instance of the `List<T>` class that is empty and has the default initial capacity.
     * @param comparer - An `IComparer<TKey>` to compare items.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:30})
     mylist.ToArray()
     // [{"Name":"Jack","Age":30}]
     ```
     */
    constructor(comparer?: IComparer<T>);

    /**
     * Initializes a new instance of the `List<T>` class that contains elements copied from the specified collection.
     * @param collection - The collection whose elements are copied to the new list.
     * @param comparer - An `IComparer<TKey>` to compare items.
     ```javascript
     let mylist = new List([{"Name":"Jane","Age":20}])
     mylist.Add({Name:"Jack", Age:30})
     mylist.ToArray()
     // [{"Name":"Jane","Age":20},{"Name":"Jack","Age":30}]
     ```
     */
    constructor(collection : IEnumerable<T>, comparer?: IComparer<T>);

    /**
     * Gets the `IComparer<T>` that is used to compare items.
     */
    readonly Comparer : IComparer<T>;

    /**
     * Gets the number of elements contained in the `List<T>`.
     ```javascript
     let mylist = new List([{"Name":"Jane","Age":20}])
     mylist.Add({Name:"Jack", Age:30})
     mylist.CountNative
     // 2
     ```
     */
    readonly CountNative : number;

    /**
     * Gets the element at the specified index.
     * @param index - The zero-based index of the element to get.
     * @returns The element at the specified index.
     ```javascript
     let mylist = new List([{"Name":"Jane","Age":20}])
     mylist.Add({Name:"Jack", Age:30})
     mylist.Get(0)
     // {"Name":"Jane","Age":20}
     mylist.Get(1)
     // {"Name":"Jack","Age":30}
     ```
     */
    Get(index : number) : T;

    /**
     * Sets the element at the specified index.
     * @param index - The zero-based index of the element to set.
     * @param item - The element to set.
     ```javascript
     let mylist = new List([{"Name":"Jane","Age":20}])
     mylist.Add({Name:"Jack", Age:30})
     mylist.Set(0, {"Name":"Joe","Age":50})
     mylist.Get(0)
     // {"Name":"Joe","Age":50}
     ```
     */
    Set(index : number, item : T) : void;

    /**
     * Adds an object to the end of the `List<T>`.
     * @param item - The object to be added to the end of the `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:30})
     mylist.ToArray()
     // [{"Name":"Jack","Age":30}]
     ```
     */
    Add(item : T) : void;

    /**
     * Adds the elements of the specified collection to the end of the `List<T>`.
     * @param collection - The collection whose elements should be added to the end of the `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.AddRange([{"Name":"Jane","Age":20},{"Name":"Jack","Age":30}])
     mylist.ToArray()
     // [{"Name":"Jane","Age":20},{"Name":"Jack","Age":30}]
     ```
     */
    AddRange(collection : IEnumerable<T>) : void;

    /**
     * Searches the entire sorted `List<T>` for an element using the specified comparer and returns the zero-based index of the element.
     * @param item - The object to locate.
     * @param comparer - The `IComparer<T>` implementation to use when comparing elements.
     * @returns The zero-based index of item in the sorted `List<T>`, if item is found; otherwise, a negative number that is the bitwise complement of the index of the next element that is larger than item or, if there is no larger element, the bitwise complement of Count.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:30})
     mylist.Add({Name:"John", Age:40})
     mylist.BinarySearch({Age:30}, ageComparer)
     // 2
     let person = {Name: "Doe", Age:25}
     let index = mylist.BinarySearch(person, ageComparer)
     index
     // -3
     mylist.Insert(~index, person)
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"Jane","Age":20},
     //  {"Name":"Doe","Age":25},{"Name":"Joe","Age":30},
     //  {"Name":"John","Age":40}]
     ```
     */
    BinarySearch(item : T, comparer?: IComparer<T>) : number;

    /**
     * Searches a range of elements in the sorted `List<T>` for an element using the specified comparer and returns the zero-based index of the element.
     * @param index - The zero-based starting index of the range to search.
     * @param count - The length of the range to search.
     * @param item - The object to locate.
     * @param comparer - The `IComparer<T>` implementation to use when comparing elements.
     * @returns The zero-based index of item in the sorted `List<T>`, if item is found; otherwise, a negative number that is the bitwise complement of the index of the next element that is larger than item or, if there is no larger element, the bitwise complement of Count.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:30})
     mylist.Add({Name:"John", Age:40})
     mylist.BinarySearch({Age:30}, ageComparer)
     // 2
     let person = {Name: "Doe", Age:25}
     let index = mylist.BinarySearch(1, 2, person, ageComparer)
     index
     // -3
     mylist.Insert(~index, person)
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"Jane","Age":20},
     //  {"Name":"Doe","Age":25},{"Name":"Joe","Age":30},
     //  {"Name":"John","Age":40}]
     ```
     */
    BinarySearch(index: number, count : number, item : T, comparer: IComparer<T>) : number;

    /**
     * Removes all elements from the `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:30})
     mylist.Clear()
     mylist.ToArray()
     // []
     ```
     */
    Clear() : void;

    /**
     * Determines whether an element is in the `List<T>`.
     * @param item - The object to locate in the List<T>.
     * @returns true if item is found in the `List<T>`; otherwise, false.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List(ageComparer)
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:30})
     mylist.Add({Name:"John", Age:40})
     mylist.ContainsNative({Age:20})
     // true
     mylist.ContainsNative({Age:25})
     // false
     ```
     */
    ContainsNative(item : T) : boolean;

    /**
     * Converts the elements in the current `List<T>` to another type, and returns a list containing the converted elements.
     * @param converter - A function that converts each element from one type to another type.
     * @returns A `List<T>` of the target type containing the converted elements from the current `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     let newlist = mylist.ConvertAll(t => ({Name:t.Name, Age:t.Age+1}))
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"Jane","Age":20}]
     newlist.ToArray()
     // [{"Name":"Jack","Age":11},{"Name":"Jane","Age":21}]
     ```
     */
    ConvertAll<TOutput>(converter : (item : T) => TOutput) : List<TOutput>;

    /**
     * Copies the entire `List<T>` to a compatible one-dimensional array, starting at the specified index of the target array.
     * @param array - The one-dimensional `Array` that is the destination of the elements copied from `List<T>`. The `Array` must have zero-based indexing.
     * @param arrayIndex - The zero-based index in array at which copying begins.
     ```javascript
     let mylist = new List([1,2,3])
     let arr = [15,16,17,18,19,20]
     mylist.CopyTo(arr, 2)
     arr
     // [15, 16, 1, 2, 3, 20]
     ```
     */
    CopyTo(array : Array<T>, arrayIndex? : number) : void;

    /**
     * Copies a range of elements from the `List<T>` to a compatible one-dimensional array, starting at the specified index of the target array.
     * @param index - The zero-based index in the source `List<T>` at which copying begins.
     * @param array - The one-dimensional `Array` that is the destination of the elements copied from `List<T>`. The Array must have zero-based indexing.
     * @param arrayIndex - The zero-based index in array at which copying begins.
     * @param count - The number of elements to copy.
     ```javascript
     let mylist = new List([1,2,3,4,5,6,7,8])
     let arr = [15,16,17,18,19,20]
     mylist.CopyTo(1, arr, 2, 3)
     arr
     // [15, 16, 2, 3, 4, 20]
     ```
     */
    CopyTo(index:number, array : Array<T>, arrayIndex : number, count : number) : void;

    /**
     * Determines whether the `List<T>` contains elements that match the conditions defined by the specified predicate.
     * @param match - The function that defines the conditions of the elements to search for.
     * @returns true if the `List<T>` contains one or more elements that match the conditions defined by the specified predicate; otherwise, false.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Exists(t=>t.Age===20)
     // true
     mylist.Exists(t=>t.Age===25)
     // false
     ```
     */
    Exists(match:(item : T) => boolean) : boolean;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire `List<T>`.
     * @param match - The function that defines the conditions of the element to search for.
     * @param defaultValue - Default value if no elements are found.
     * @returns The first element that matches the conditions defined by the specified predicate, if found; otherwise, the default value.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Find(t=>t.Age===20, {Name:"Andy", Age:45})
     // {"Name":"Jane","Age":20}
     mylist.Find(t=>t.Age===25, {Name:"Andy", Age:45})
     // {"Name":"Andy","Age":45}
     mylist.Find(t=>t.Age===25)
     // null
     ```
     */
    Find(match:(item : T) => boolean, defaultValue?:T) : T;

    /**
     * Retrieves all the elements that match the conditions defined by the specified predicate.
     * @param match - The function that defines the conditions of the elements to search for.
     * @returns A `List<T>` containing all the elements that match the conditions defined by the specified predicate, if found; otherwise, an empty `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:30})
     mylist.FindAll(t=>t.Age>15).ToArray()
     // [{"Name":"Jane","Age":20},{"Name":"Joe","Age":30}]
     mylist.FindAll(t=>t.Age>30).ToArray()
     // []
     ```
     */
    FindAll(match:(item : T) => boolean) : List<T>;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the zero-based index of the first occurrence within the entire `List<T>`.
     * @param match - The function that defines the conditions of the element to search for.
     * @returns The zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, -1.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:30})
     mylist.FindIndex(t=>t.Age>15)
     // 1
     mylist.FindIndex(t=>t.Age===30)
     // 2
     mylist.FindIndex(t=>t.Age>30)
     // -1
     ```
     */
    FindIndex(match : (item : T) => boolean) : number;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the zero-based index of the first occurrence within the range of elements in the `List<T>` that extends from the specified index to the last element.
     * @param startIndex - The zero-based starting index of the search.
     * @param match - The function that defines the conditions of the element to search for.
     * @returns The zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, -1.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:30})
     mylist.FindIndex(2, t=>t.Age>15)
     // 2
     mylist.FindIndex(1, t=>t.Age===30)
     // 2
     mylist.FindIndex(1, t=>t.Age>30)
     // -1
     ```
     */
    FindIndex(startIndex: number, match : (item : T) => boolean) : number;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the zero-based index of the first occurrence within the range of elements in the `List<T>` that starts at the specified index and contains the specified number of elements.
     * @param startIndex - The zero-based starting index of the search.
     * @param count - The number of elements in the section to search.
     * @param match - The function that defines the conditions of the element to search for.
     * @returns The zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, -1.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:30})
     mylist.FindIndex(2, 1, t=>t.Age>15)
     // 2
     mylist.FindIndex(1, 1, t=>t.Age===30)
     // -1
     mylist.FindIndex(1, 2, t=>t.Age>30)
     // -1
     ```
     */
    FindIndex(startIndex: number, count:number, match : (item : T) => boolean) : number;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the last occurrence within the entire `List<T>`.
     * @param match - The function that defines the conditions of the element to search for.
     * @param defaultValue - Default value if no elements are found.
     * @returns The last element that matches the conditions defined by the specified predicate, if found; otherwise, the default value.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.FindLast(t=>t.Age===20, {Name:"Andy", Age:45})
     // {"Name":"Joe", "Age":20}
     mylist.FindLast(t=>t.Age===25, {Name:"Andy", Age:45})
     // {"Name":"Andy","Age":45}
     mylist.FindLast(t=>t.Age===25)
     // null
     ```
     */
    FindLast(match: (item : T) => boolean, defaultValue?:T) : number;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the zero-based index of the last occurrence within the entire `List<T>`.
     * @param match - The function that defines the conditions of the element to search for.
     * @returns The zero-based index of the last occurrence of an element that matches the conditions defined by match, if found; otherwise, -1.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.FindLastIndex(t=>t.Age>5)
     // 2
     mylist.FindLastIndex(t=>t.Age>30)
     // -1
     ```
     */
    FindLastIndex(match : (item : T) => boolean) : number;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the zero-based index of the last occurrence within the range of elements in the `List<T>` that extends from the first element to the specified index.
     * @param startIndex - The zero-based starting index of the backward search.
     * @param match - The function that defines the conditions of the element to search for.
     * @returns The zero-based index of the last occurrence of an element that matches the conditions defined by match, if found; otherwise, -1.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.FindLastIndex(1, t=>t.Age>5)
     // 2
     mylist.FindIndex(1, t=>t.Age==10)
     // -1
     mylist.FindIndex(1, t=>t.Age>30)
     // -1
     ```
     */
    FindLastIndex(startIndex: number, match : (item : T) => boolean) : number;

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the zero-based index of the last occurrence within the range of elements in the `List<T>` that contains the specified number of elements and ends at the specified index.
     * @param startIndex - The zero-based starting index of the backward search.
     * @param count - The number of elements in the section to search.
     * @param match - The function that defines the conditions of the element to search for.
     * @returns The zero-based index of the last occurrence of an element that matches the conditions defined by match, if found; otherwise, -1.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.FindIndex(1, 1, t=>t.Age>15)
     // 1
     mylist.FindIndex(2, 1, t=>t.Age>15)
     // 2
     mylist.FindIndex(1, 2, t=>t.Age==10)
     // -1
     ```
     */
    FindLastIndex(startIndex: number, count:number, match : (item : T) => boolean) : number;

    /**
     * Creates a shallow copy of a range of elements in the source `List<T>`.
     * @param index - The zero-based `List<T>` index at which the range starts.
     * @param count - The number of elements in the range.
     * @returns A shallow copy of a range of elements in the source `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.Add({Name:"John", Age:50})
     let newlist1 = mylist.GetRange(0,2)
     newlist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"Jane","Age":20}]
     let newlist2 = mylist.GetRange(1,2)
     newlist.ToArray()
     // [{"Name":"Jane","Age":20},{"Name":"Joe","Age":20}]
     ```
     */
    GetRange(index:number, count:number) : List<T>;

    /**
     * Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the `List<T>` that starts at the specified index and contains the specified number of elements.
     * @param item - The object to locate in the `List<T>`.
     * @param index - The zero-based starting index of the search. 0 (zero) is valid in an empty list.
     * @param count - The number of elements in the section to search.
     * @returns The zero-based index of the first occurrence of item within the range of elements in the `List<T>` that starts at index and contains count number of elements, if found; otherwise, -1.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List(ageComparer)
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.Add({Name:"John", Age:50})
     mylist.IndexOf({Age:20})
     // 1
     mylist.IndexOf({Age:20}, 2, 2)
     // 2
     mylist.IndexOf({Age:20}, 3, 1)
     // -1
     ```
     */
    IndexOf(item:T, index?:number, count?:number):number;

    /**
     * Inserts an element into the `List<T>` at the specified index.
     * @param index - The zero-based index at which item should be inserted.
     * @param item - The object to insert.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.Insert(1, {Name:"John", Age:50})
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"John","Age":50},
     //  {"Name":"Jane","Age":20},{"Name":"Joe","Age":20}]
     ```
     */
    Insert(index:number, item:T) : void;

    /**
     * nserts the elements of a collection into the `List<T>` at the specified index.
     * @param index - The zero-based index at which the new elements should be inserted.
     * @param collection - The collection whose elements should be inserted into the `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.InsertRange(1, [{Name:"John", Age:50}, {Name:"Doe", Age:70}])
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"John","Age":50},
     //  {"Name":"Doe","Age":70},{"Name":"Jane","Age":20},
     //  {"Name":"Joe","Age":20}]
     ```
     */
    InsertRange(index:number, collection:IEnumerable<T>) : void;

    /**
     * Searches for the specified object and returns the zero-based index of the last occurrence within the range of elements in the `List<T>` that contains the specified number of elements and ends at the specified index.
     * @param item - The object to locate in the `List<T>`.
     * @param index - The zero-based starting index of the backward search.
     * @param count - The number of elements in the section to search.
     * @returns The zero-based index of the last occurrence of item within the range of elements in the `List<T>` that contains count number of elements and ends at index, if found; otherwise, -1.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List(ageComparer)
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.Add({Name:"John", Age:50})
     mylist.LastIndexOf({Age:20})
     // 2
     mylist.LastIndexOf({Age:20}, 0, 2)
     // 1
     mylist.LastIndexOf({Age:20}, 0, 1)
     // -1
     ```
     */
    LastIndexOf(item:T, index?:number, count?:number) : number;

    /**
     * Removes the first occurrence of a specific object from the `List<T>`.
     * @param item - The object to remove from the `List<T>`. The value can be null for reference types.
     * @returns true if item is successfully removed; otherwise, false. This method also returns false if item was not found in the `List<T>`.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List(ageComparer)
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.Remove({Age:50})
     // false
     mylist.Remove({Age:20})
     // true
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"Joe","Age":20}]
     ```
     */
    Remove(item:T) : boolean;

    /**
     * Removes all the elements that match the conditions defined by the specified predicate.
     * @param match - The function that defines the conditions of the elements to remove.
     * @returns The number of elements removed from the `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.RemoveAll(t=>t.Age>30)
     // 0
     mylist.RemoveAll(t=>t.Age>10)
     // 2
     mylist.ToArray()
     // [{"Name":"Jack","Age":10}]
     ```
     */
    RemoveAll(match:(item : T) => boolean) : number;

    /**
     * Removes the element at the specified index of the `List<T>`.
     * @param index - The zero-based index of the element to remove.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.RemoveAt(1)
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"Joe","Age":20}]
     ```
     */
    RemoveAt(index:number): void;

    /**
     * Removes a range of elements from the `List<T>`.
     * @param index - The zero-based starting index of the range of elements to remove.
     * @param count - The number of elements to remove.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.RemoveRange(1, 2)
     mylist.ToArray()
     // [{"Name":"Jack","Age":10}]
     ```
     */
    RemoveRange(index:number, count:number): void;

    /**
     * Reverses the order of the elements in the entire `List<T>`.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.ReverseNative()
     mylist.ToArray()
     // [{"Name":"Joe","Age":20},{"Name":"Jane","Age":20},
     //  {"Name":"Jack","Age":10}]
     ```
     */
    ReverseNative():void
    
    /**
     * Reverses the order of the elements in the specified range.
     * @param index - The zero-based starting index of the range to reverse.
     * @param count - The number of elements in the range to reverse.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:20})
     mylist.Add({Name:"Joe", Age:20})
     mylist.ReverseNative(0, 2)
     mylist.ToArray()
     // [{"Name":"Jane","Age":20},{"Name":"Jack","Age":10},
     //  {"Name":"Joe","Age":20}]
     ```
     */
    ReverseNative(index:number, count:number):void

    /**
     * Sorts the elements in the entire `List<T>` using the specified comparer.
     * @param comparer - The `IComparer<T>` implementation to use when comparing elements.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List(ageComparer)
     mylist.Add({Name:"John", Age:20})
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:50})
     mylist.Add({Name:"Joe", Age:20})
     mylist.Sort()
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"John","Age":20},
     //  {"Name":"Joe","Age":20},{"Name":"Jane","Age":50}]

     let nameComparer = (a, b) => (a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
     mylist.Sort(nameComparer)
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"Jane","Age":50},
     //  {"Name":"Joe","Age":20},{"Name":"John","Age":20}]
     ```
     */
    Sort(comparer?: IComparer<T>) : void;

    /**
     * Sorts the elements in a range of elements in `List<T>` using the specified comparer.
     * @param index - The zero-based starting index of the range to sort.
     * @param count - The length of the range to sort.
     * @param comparer - The `IComparer<T>` implementation to use when comparing elements.
     ```javascript
     let ageComparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0)
     let mylist = new List(ageComparer)
     mylist.Add({Name:"John", Age:20})
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:50})
     mylist.Add({Name:"Joe", Age:20})
     mylist.Sort(0, 3, mylist.Comparer)
     mylist.ToArray()
     // [{"Name":"Jack","Age":10},{"Name":"John","Age":20},
     //  {"Name":"Jane","Age":50},{"Name":"Joe","Age":20}]
     ```
     */
    Sort(index: number, count: number, comparer: IComparer<T>) : void;

    /**
     * Determines whether every element in the `List<T>` matches the conditions defined by the specified predicate.
     * @param match - The function that defines the conditions to check against the elements.
     * @returns true if every element in the `List<T>` matches the conditions defined by the specified predicate; otherwise, false. If the list has no elements, the return value is true.
     ```javascript
     let mylist = new List()
     mylist.Add({Name:"John", Age:20})
     mylist.Add({Name:"Jack", Age:10})
     mylist.Add({Name:"Jane", Age:50})
     mylist.TrueForAll(t=>t.Age>5)
     // true
     mylist.TrueForAll(t=>t.Age>10)
     // false
     ```
     */
    TrueForAll(match:(item : T) => boolean) : boolean;
}

// DataStructures/Lookup
/**
 * Represents a collection of keys each mapped to one or more values.
 */
declare class Lookup<TKey,TElement> extends IEnumerable<IGrouping<TKey,TElement>> {
    
    /**
     * Gets the number of key/value collection pairs in the `Lookup<TKey,TElement>`.
     ```javascript
     let arr = [1,2,3,4,5,6,7]
     let lookup = arr.ToLookup(t=>t%2, t=>t)
     lookup.CountNative
     // 2
     ```
     */
    readonly CountNative : number;

    /**
     * Gets the collection of values indexed by the specified key.
     * @param key - The key of the desired collection of values.
     * @returns The collection of values indexed by the specified key.
     ```javascript
     let arr = [1,2,3,4,5,6,7]
     let lookup = arr.ToLookup(t=>t%2, t=>t)
     lookup.Get(1).ToArray()
     // [1, 3, 5, 7]
     ```
     */
    Get(key : TKey) : IEnumerable<TElement>;

    /**
     * Applies a transform function to each key and its associated values and returns the results.
     * @param resultSelector - A function to project a result value from each key and its associated values.
     * @returns A collection that contains one value for each key/value collection pair in the `Lookup<TKey,TElement>`.
     ```javascript
     let arr = [1,2,3,4,5,6,7]
     let lookup = arr.ToLookup(t=>t%2, t=>t)
     lookup.ApplyResultSelector((Key, Values)=>({Key, Average:Values.Average()})).ToArray()
     // [{"Key":1,"Average":4},{"Key":0,"Average":4}]
     ```
     */
    ApplyResultSelector<TResult>(resultSelector: (key : TKey, values : IEnumerable<TElement>)=>TResult) : IEnumerable<TResult>;

    /**
     * Determines whether a specified key is in the `Lookup<TKey,TElement>`.
     * @param key - The key to find in the `Lookup<TKey,TElement>`.
     * @returns true if key is in the `Lookup<TKey,TElement>`; otherwise, false.
     ```javascript
     let arr = [1,2,3,4,5,6,7]
     let lookup = arr.ToLookup(t=>t%2, t=>t)
     lookup.ContainsNative(1)
     // true
     lookup.ContainsNative(3)
     // false
     ```
     */
    ContainsNative(key : TKey) : boolean;
}

// Methods/NativeExtensions
declare global {
    interface Array<T> extends IEnumerable<T> {}
    interface Set<T> extends IEnumerable<T> {}
    interface Map<K, V> extends IEnumerable<[K,V]> {}
    interface String extends IEnumerable<String> {}
}

declare const linqify : {
                            <T>(source : (()=>IterableIterator<T>) | IEnumerable<T>) : IEnumerable<T>,
                            Enumerable: typeof Enumerable,
                            Dictionary: typeof Dictionary,
                            List:typeof List,
                            HashSet:typeof HashSet,
                            EqualityComparers:typeof EqualityComparers,
                            SortComparers:typeof SortComparers,
                            /**
                             * Method for switching to noConflict mode. Used in case of incidentally overriding methods.
                             * @returns New object containing all necessery classes and other objects required to use package.
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
                             */
                            noConflict: () => {
                                <T>(source : (()=>IterableIterator<T>) | IEnumerable<T>) : IEnumerable<T>,
                                Enumerable: typeof Enumerable,
                                Dictionary:typeof Dictionary,
                                List:typeof List,
                                HashSet:typeof HashSet,
                                EqualityComparers:typeof EqualityComparers,
                                SortComparers:typeof SortComparers
                            }
                        };

export {Enumerable, IEnumerable, IOrderedEnumerable, Dictionary, List, HashSet, EqualityComparers, IComparer, IEqualityComparer, KeyValuePair, SortComparers, linqify};
