---
title: 10.11 - 类模板参数推断CTAD
alias: 10.11 - 类模板参数推断CTAD
origin: /class-template-argument-deduction-ctad-and-deduction-guides/
origin_title: "10.11 — Class template argument deduction (CTAD) and deduction guides"
time: 2022-8-24
type: translation
tags:
- class template
- CTAD
- C++17
---

??? note "关键点速记"


## Class template argument deduction (CTAD) C++17 

Starting in C++17, when instantiating an object from a class template, the compiler can deduce the template types from the types of the object’s initializer (this is called class template argument deduction or CTAD for short). For example:

```cpp
#include <utility> // for std::pair

int main()
{
    std::pair<int, int> p1{ 1, 2 }; // explicitly specify class template std::pair<int, int> (C++11 onward)
    std::pair p2{ 1, 2 };           // CTAD used to deduce std::pair<int, int> from the initializers (C++17)

    return 0;
}
```

COPY

CTAD is only performed if no template argument list is present. Therefore, both of the following are errors:

```cpp
#include <utility> // for std::pair

int main()
{
    std::pair<> p1 { 1, 2 };    // error: too few template arguments, both arguments not deduced
    std::pair<int> p2 { 3, 4 }; // error: too few template arguments, second argument not deduced

    return 0;
}
```

COPY

!!! info "作者注"

	Many future lessons on this site make use of CTAD. If you’re compiling these examples using the C++14 standard, you’ll get an error about missing template arguments. You’ll need to explicitly add such arguments to the example to make it compile.

## Template argument deduction guides C++17 

In most cases, CTAD works right out of the box. However, in certain cases, the compiler may need a little extra help understanding how to deduce the template arguments properly.

You may be surprised to find that the following program (which is almost identical to the example that uses `std::pair` above) doesn’t compile in C++17:

```cpp
// define our own Pair type
template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

int main()
{
    Pair<int, int> p1{ 1, 2 }; // ok: we're explicitly specifying the template arguments
    Pair p2{ 1, 2 };           // compile error in C++17

    return 0;
}
```

COPY

If you compile this in C++17, you’ll likely get some error about “class template argument deduction failed” or “cannot deduce template arguments” or “No viable constructor or deduction guide”. This is because in C++17, CTAD doesn’t know how to deduce the template arguments for aggregate class templates. To address this, we can provide the compiler with a deduction guide, which tells the compiler how to deduce the template arguments for a given class template.

Here’s the same program with a deduction guide:

```cpp
template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

// Here's a deduction guide for our Pair
// Pair objects initialized with arguments of type T and U should deduce to Pair<T, U>
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;

int main()
{
    Pair<int, int> p1{ 1, 2 }; // explicitly specify class template Pair<int, int> (C++11 onward)
    Pair p2{ 1, 2 };     // CTAD used to deduce Pair<int, int> from the initializers (C++17)

    return 0;
}
```


This example should compile under C++17.

The deduction guide for our `Pair` class is pretty simple, but let’s take a closer look at how it works.

```cpp
// Here's a deduction guide for our Pair
// Pair objects initialized with arguments of type T and U should deduce to Pair<T, U>
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;
```


First, we use the same template type definition as in our `Pair` class. This makes sense, because if our deduction guide is going to tell the compiler how to deduce the types for a `Pair<T, U>`, we have to define what `T` and `U` are (template types). Second, on the right hand side of the arrow, we have the type that we’re helping the compiler to deduce. In this case, we want the compiler to be able to deduce template arguments for objects of type `Pair<T, U>`, so that’s exactly what we put here. Finally, on the left side of the arrow, we tell the compiler what kind of declaration to look for. In this case, we’re telling it to look for a declaration of some object named `Pair` with two arguments (one of type `T`, the other of type `U`). We could also write this as `Pair(T t, U u)` (where `t` and `u` are the names of the parameters, but since we don’t use `t` and `u`, we don’t need to give them names).

Putting it all together, we’re telling the compiler that if it sees a declaration of a `Pair` with two arguments (of types `T` and `U` respectively), it should deduce the type to be a `Pair<T, U>`.

So when the compiler sees the definition `Pair p2{ 1, 2 };` in our program, it will say, “oh, this is a declaration of a `Pair` and there are two arguments of type `int` and `int`, so using the deduction guide, I should deduce this to be a `Pair<int, int>`“.

Here’s a similar example for a Pair that takes a single template type:

```cpp
template <typename T>
struct Pair
{
    T first{};
    T second{};
};

// Here's a deduction guide for our Pair
// pair objects initialized with arguments of type T and T should deduce to Pair<T>
template <typename T>
Pair(T, T)->Pair<T>;

int main()
{
    Pair<int> p1{ 1, 2 }; // explicitly specify class template Pair<int> (C++11 onward)
    Pair p2{ 1, 2 };     // CTAD used to deduce Pair<int, int> from the initializers (C++17)

    return 0;
}
```

COPY

In this case, our deduction guide maps a `Pair(T, T)` (a `Pair` with two arguments of type `T`) to a `Pair<T>`.

!!! info "作者注"

	A few notes about deduction guides.
	
	First, `std::pair` (and other standard library template types) come with pre-defined deduction guides. This is why our example above that uses `std::pair` compiles fine in C++17 without us having to provide deduction guides ourselves.
	
	Second, C++20 added the ability for the compiler to automatically generate deduction guides for aggregate class types, so the version of `Pair`without the deduction guides should compile in C++20. This assumes your compiler supports feature P1816, which as of the time of writing, gcc and Visual Studio do, and Clang does not.