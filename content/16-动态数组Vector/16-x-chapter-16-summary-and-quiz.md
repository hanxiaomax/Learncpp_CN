---
title: 16-x-chapter-16-summary-and-quiz
aliases: 16-x-chapter-16-summary-and-quiz
origin: 
origin_title: 16-x-chapter-16-summary-and-quiz
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 16.x — Chapter 16 summary and quiz

Words of encouragement

This chapter isn’t an easy one. We covered a lot of material, and unearthed some of C++’s warts. Congrats on making it through!

Arrays are one of the keys that unlock a huge amount of power within your C++ programs.

Chapter Review

A **container** is a data type that provides storage for a collection of unnamed objects (called **elements**). We typically use containers when we need to work with a set of related values.

The number of elements in a container is often called it’s **length** (or sometimes **count**). In C++, the term **size** is also commonly used for the number of elements in a container. In most programming languages (including C++), containers are **homogenous**, meaning the elements of a container are required to have the same type.

The **Containers library** is a part of the C++ standard library that contains various class types that implement some common types of containers. A class type that implements a container is sometimes called a **container class**.

An **array** is a container data type that stores a sequence of values **contiguously** (meaning each element is placed in an adjacent memory location, with no gaps). Arrays allow fast, direct access to any element.

C++ contains three primary array types: (C-style) arrays, the `std::vector` container class, and the `std::array` container class.

`std::vector` is one of the container classes in the C++ standard containers library that implements an array. `std::vector` is defined in the <vector> header as a class template, with a template type parameter that defines the type of the elements. Thus, `std::vector<int>` declares a `std::vector` whose elements are of type `int`.

Containers typically have a special constructor called a **list constructor** that allows us to construct an instance of the container using an initializer list. Use list initialization with an initializer list of values to construct a container with those element values.

In C++, the most common way to access array elements is by using the name of the array along with the subscript operator (`operator[]`). To select a specific element, inside the square brackets of the subscript operator, we provide an integral value that identifies which element we want to select. This integral value is called a **subscript** (or informally, an **index**). The first element is accessed using index 0, the second is accessed using index 1, etc… Because the indexing starts with 0 rather than 1, we say arrays in C++ are **zero-based**.

`operator[]` does not do any kind of **bounds checking**, meaning it does not check to see whether the index is within the bounds of 0 to N-1 (inclusive). Passing an invalid index to `operator[]` will result in undefined behavior.

Arrays are one of the few container types that allow **random access**, meaning every element in the container can be accessed directly and with equal speed, regardless of the number of elements in the container.

When constructing a class type object, a matching list constructor is selected over other matching constructors. When constructing a container (or any type that has a list constructor) with initializers that are not element values, use direct initialization.

```cpp
std::vector v1 { 5 }; // defines a 1 element vector containing value `5`.
std::vector v2 ( 5 ); // defines a 5 element vector where elements are value-initialized.
```

`std::vector` can be made const but not constexpr.

Each of the standard library container classes defines a nested typedef member named `size_type` (sometimes written as `T::size_type`), which is an alias for the type used for the length (and indices, if supported) of the container. `size_type` is almost always an alias for `std::size_t`, but can be overridden (in rare cases) to use a different type. We can reasonably assume `size_type` is an alias for `std::size_t`.

When accessing the `size_type` member of a container class, we must scope qualify it with the fully templated name of the container class. For example, `std::vector<int>::size_type`.

We can ask a container class object for its length using the `size()` member function, which returns the length as unsigned `size_type`. In C++17, we can also use the `std::size()` non-member function.

In C++20, the `std::ssize()` non-member function, which returns the length as a large *signed* integral type (usually `std::ptrdiff_t`, which is the type normally used as the signed counterpart to `std::size_t`).

Accessing array elements using the `at()` member function does runtime bounds checking (and throws an exception of type `std::out_of_range` if the bounds are out of range). If the exception isn’t caught, the application will be terminated.

Both `operator[]` and the `at()` member function support indexing with non-const indices. However, both expect the index to be of type `size_type`, which is an unsigned integral type. This causes sign conversion problems when the indices are non-constexpr.

An object of type `std::vector` can be passed to a function just like any other object. That means if we pass a `std::vector` by value, an expensive copy will be made. Therefore, we typically pass `std::vector` by (const) reference to avoid such copies.

We can use a function template to be able to pass a `std::vector` with any element type into a function. You can use an `assert()` to ensure the vector passed in has the correct length.

The term **copy semantics** refers to the rules that determine how copies of objects are made. When we say copy semantics are being invoked, that means we’ve done something that will make a copy of an object.

When ownership of data is transfered from one object to another, we say that data has been **moved**.

**Move semantics** refers to the rules that determine how the data from one object is moved to another object. When move semantics is invoked, any data member that can be moved is moved, and any data member that can’t be moved is copied. The ability to move data instead of copying it can make move semantics more efficient than copy semantics, especially when we can replace an expensive copy with an inexpensive move.

Normally, when an object is being initialized with or assigned an object of the same type, copy semantics will be used (assuming the copy isn’t elided). Move semantics will be automatically used instead when the type of the object supports move semantics, and the initializer or object being assigned from is an rvalue.

We can return move-capable types (like `std::vector` and `std::string`) by value. Such types will inexpensively move their values instead of making an expensive copy.

Accessing each element of a container in some order is called **traversal**, or **traversing** the container. Traversal is also sometimes called **iterating over** or **iterating through** the container.

Loops are often used to traverse through an array, with a loop variable being used as an index. Beware of off-by-one errors, where the loop body executes one too many or one too few times.

A **range-based for loop** (also sometimes called a **for-each loop**) allows traversal of a container without having to do explicit indexing. Favor range-based-for loops over regular for-loops when traversing containers.

Use type deduction (`auto`) with ranged-based for-loops to have the compiler deduce the type of the array element. The element declaration should use a (const) reference whenever you would normally pass that element type by (const) reference. Consider always using `const auto&` unless you need to work with copies. This will ensure copies aren’t made even if the element type is later changed.

Unscoped enumerations can be used as indices, and help provide any information about the meaning of the index.

Adding an additional “count” enumerator is useful whenever we need an enumerator that represents the array length. You can assert or static_assert that an array’s length is equal to the count enumerator to ensure an array is initialized with the expected number of initializers.

Arrays where the length of the array must be defined at the point of instantiation and then cannot be changed are called **fixed-size arrays** or **fixed-length arrays**. A **dynamic array** (also called a **resizable array**) is an array whose size can be changed after instantiation. This ability to be resized is what makes `std::vector` special.

A `std::vector` can be resized after instantiation by calling the `resize()` member function with the new desired length.

In the context of a `std::vector`, **capacity** is how many elements the `std::vector` has allocated storage for, and **length** is how many elements are currently being used. We can ask a `std::vector` for its capacity via the `capacity()` member function.

When a `std::vector` changes the amount of storage it is managing, this process is called **reallocation**. Because reallocation typically requires every element in the array to be copied, reallocation is an expensive process. As a result, we want to avoid reallocation as much as reasonable.

Valid indices for the subscript operator (`operator[]`) and `at()` member function is based on the vector’s length, not the capacity.

`std::vector` has a member function called `shrink_to_fit()` that requests that the vector shrink its capacity to match its length. This request is non-binding.

The order in which items are added to and removed from a stack can be described as **last-in, first-out (LIFO)**. The last plate added onto the stack will be the first plate that is removed. In programming, a **stack** is a container data type where the insertion and removal of elements occurs in a LIFO manner. This is commonly implemented via two operations named **push** and **pop**.

The `std::vector` member functions `push_back()` and `emplace_back()` will increment the length of a `std::vector`, and will cause a reallocation to occur if the capacity is not sufficient to insert the value. When pushing triggers a reallocation, `std::vector` will typically allocate some extra capacity to allow additional elements to be added without triggering another reallocation the next time an element is added.

The `resize()` member function changes the length of the vector, and the capacity (if necessary).\
The `reserve()` member function changes just the capacity (if necessary)

To increase the number of elements in a `std::vector`:

- Use `resize()` when accessing a vector via indexing. This changes the length of the vector so your indices will be valid.
- Use `reserve()` when accessing a vector using stack operations. This adds capacity without changing the length of the vector.

Both `push_back()` and `emplace_back()` push an element onto the stack. If the object to be pushed already exists, `push_back()` and `emplace_back()` are equivalent. However, in cases where we are creating a temporary object for the purpose of pushing it onto the vector, `emplace_back()` can be more efficient. Prefer emplace_back() when creating a new temporary object to add to the container, or when you need to access an explicit constructor. Prefer push_back() otherwise.

There is a special implementation for `std::vector<bool>` that may be more space efficient for Boolean values by similarly compacting 8 Boolean values into a byte.

`std::vector<bool>` is not a vector (it is not required to be contiguous in memory), nor does it hold `bool` values (it holds a collection of bits), nor does it meet C++’s definition of a container. Although `std::vector<bool>` behaves like a vector in most cases, it is not fully compatible with the rest of the standard library. Code that works with other element types may not work with `std::vector<bool>`. As a result, `std::vector<bool>` should generally be avoided.