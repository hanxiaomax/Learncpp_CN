---
title: 10.1 - 自定义类型简介
alias: 10.1 - 自定义类型简介
origin: /introduction-to-program-defined-user-defined-types/
origin_title: "10.1 — Introduction to program-defined (user-defined) types"
time: 2022-9-16
type: translation
tags:
- struct
- members
- member selection
---

??? note "关键点速记"
	

Because fundamental types are defined as part of the core C++ language, they are available for immediate use. For example, if we want to define a variable with a type of `int` or `double`, we can just do so:

```cpp
int x; // define variable of fundamental type 'int'
double d; // define variable of fundamental type 'double'
```

COPY

This is also true for the compound types that are simple extensions of fundamental types (including functions, pointers, references, and arrays):

```cpp
void fcn(int) {}; // define a function of type void()(int)
int* ptr; // define variable of compound type 'pointer to int'
int& ref; // define variable of compound type 'reference to int'
int arr[5]; // define an array of 5 integers of type int[5] (we'll cover this in a future chapter)
```

COPY

This works because the C++ language already knows what the type names (and symbols) for these types mean -- we do not need to provide or import any definitions.

However, consider the case of a type alias (introduced in lesson [8.6 -- Typedefs and type aliases](https://www.learncpp.com/cpp-tutorial/typedefs-and-type-aliases/)), which allows us to define a new name for an existing type. Because a type alias introduces a new identifier into the program, a type alias must be defined before it can be used:

```cpp
#include <iostream>

using length = int; // define a type alias with identifier 'length'

int main()
{
    length x { 5 }; // we can use 'length' here since we defined it above
    std::cout << x;

    return 0;
}
```

COPY

If we were to omit the definition of `length`, the compiler wouldn’t know what a `length` is, and would complain when we try to define a variable using that type. The definition for `length` doesn’t create an object -- it just tells the compiler what a `length` is so it can be used later.

What are user-defined / program-defined types?

Back in the introduction to the previous chapter ([9.1 -- Introduction to compound data types](https://www.learncpp.com/cpp-tutorial/introduction-to-compound-data-types/)), we introduced the challenge of wanting to store a fraction, which has a numerator and denominator that are conceptually linked together. In that lesson, we discussed some of the challenges with using two separate integers to store a fraction’s numerator and denominator independently.

If C++ had a built-in fraction type, that would have been perfect -- but it doesn’t. And there are hundreds of other potentially useful types that C++ doesn’t include because it’s just not possible to anticipate everything that someone might need (let alone implement and test those things).

Instead, C++ solves for such problems in a different way: by allowing us to create entirely new, custom types for use in our programs! Such types are often called user-defined types (though we think the term program-defined types is better -- we’ll discuss the difference later in this lesson). C++ has two categories of compound types that allow for this: the enumerated types (including unscoped and scoped enumerations), and the class types (including structs, classes, and unions).

Defining program-defined types

Just like type aliases, program-defined types must also be defined before they can be used. The definition for a program-defined type is called a type definition.

Although we haven’t covered what a struct is yet, here’s an example showing the definition of custom Fraction type and an instantiation of an object using that type:

```cpp
// Define a program-defined type named Fraction so the compiler understands what a Fraction is
// (we'll explain what a struct is and how to use them later in this chapter)
// This only defines what a Fraction type looks like, it doesn't create one
struct Fraction
{
	int numerator {};
	int denominator {};
};

// Now we can make use of our Fraction type
int main()
{
	Fraction f{ 3, 4 }; // this actually instantiates a Fraction object named f

	return 0;
}
```

COPY

In this example, we’re using the `struct` keyword to define a new program-defined type named `Fraction` (in the global scope, so it can be used anywhere in the rest of the file). This doesn’t allocate any memory -- it just tells the compiler what a `Fraction` looks like, so we can allocate objects of a `Fraction` type later. Then, inside `main()`, we instantiate (and initialize) a variable of type `Fraction` named `f`.

Program-defined type definitions always end in a semicolon. Failure to include the semicolon at the end of a type definition is a common programmer error, and one that can be hard to debug because the compiler will usually error on the line _after_ the type definition. For example, if you remove the semicolon from the end of the `Fraction` definition (line 8) of the example above, the compiler will probably complain about the definition of `main()`(line 11).

Warning

Don’t forget to end your type definitions with a semicolon, otherwise the compiler will typically error on the next line of code.

We’ll show more examples of defining and using program-defined types in the next lesson ([10.2 -- Unscoped enumerations](https://www.learncpp.com/cpp-tutorial/unscoped-enumerations/)), and we cover structs starting in lesson [10.5 -- Introduction to structs, members, and member selection](https://www.learncpp.com/cpp-tutorial/introduction-to-structs-members-and-member-selection/).

Naming program-defined types

By convention, program-defined types are named starting with a capital letter and don’t use a suffix (e.g. `Fraction`, not `fraction`, `fraction_t`, or `Fraction_t`).

Best practice

Name your program-defined types starting with a capital letter and do not use a suffix.

New programmers sometimes find variable definitions such as the following confusing because of the similarity between the type name and variable name:

```cpp
Fraction fraction {}; // Instantiates a variable named fraction of type Fraction
```

COPY

But this is no different than any other variable definition: the type (`Fraction`) comes first (and because Fraction is capitalized, we know it’s a program-defined type), then the variable name (`fraction`), and then an optional initializer. Because C++ is case-sensitive, there is no naming conflict here!

Using program-defined types throughout a multi-file program

Every code file that uses a program-defined type needs to see the full type definition before it is used. A forward declaration is not sufficient. This is required so that the compiler knows how much memory to allocate for objects of that type.

To propagate type definitions into the code files that need them, program-defined types are typically defined in header files, and then #included into any code file that requires that type definition. These header files are typically given the same name as the program-defined type (e.g. a program-defined type named Fraction would be defined in Fraction.h)

Best practice

A program-defined type used in only one code file should be defined in that code file as close to the first point of use as possible.

A program-defined type used in multiple code files should be defined in a header file with the same name as the program-defined type and then #included into each code file as needed.

Here’s an example of what our Fraction type would look like if we moved it to a header file (named Fraction.h) so that it could be included into multiple code files:

Fraction.h:

```cpp
#ifndef FRACTION_H
#define FRACTION_H

// Define a new type named Fraction
// This only defines what a Fraction looks like, it doesn't create one
// Note that this is a full definition, not a forward declaration
struct Fraction
{
	int numerator {};
	int denominator {};
};

#endif
```

COPY

Fraction.cpp:

```cpp
#include "Fraction.h" // include our Fraction definition in this code file

// Now we can make use of our Fraction type
int main()
{
	Fraction f{ 3, 4 }; // this actually creates a Fraction object named f

	return 0;
}
```

COPY

Type definitions are partially exempt from the one-definition rule

In lesson [2.7 -- Forward declarations and definitions](https://www.learncpp.com/cpp-tutorial/forward-declarations/), we discussed how the one-definition rule requires that each function and global variable only have one definition per program. To use a given function or global variable in a file that does not contain the definition, we need a forward declaration (which we typically propagate via a header file). This works because declarations are enough to satisfy the compiler when it comes to functions and non-constexpr variables, and the linker can then connect everything up.

However, using forward declarations in a similar manner doesn’t work for types, because the compiler typically needs to see the full definition to use a given type. We must be able to propagate the full type definition to each code file that needs it.

To allow for this, types are partially exempt from the one-definition rule: a given type is allowed to be defined in multiple code files.

You’ve already exercised this capability (likely without realizing it): if your program has two code files that both `#include <iostream>`, you’re importing all of the input/output type definitions into both files.

There are two caveats that are worth knowing about. First, you can still only have one type definition per code file (this usually isn’t a problem since header guards will prevent this). Second, all of the type definitions for a given type must be identical, otherwise undefined behavior will result.

Nomenclature: user-defined types vs program-defined types

The term “user-defined type” sometimes comes up in casual conversation, as well as being mentioned (but not defined) in the C++ language standard. In casual conversation, the term tends to mean “a type that you defined yourself” (such as the Fraction type example above). Sometimes this also includes type aliases.

However, as used in the C++ language standard, a user-defined type is intended to be any type not defined as part of the core C++ language (in other words, a non-fundamental type). Therefore, types defined in the C++ standard library (such as `std::string`) are technically considered to be user-defined types, as are any types that you’ve defined yourself.

To provide additional differentiation, the C++20 language standard helpfully defines the term “program-defined type” to mean only types that you’ve defined yourself. We’ll prefer this term when talking about such types, as it is less ambiguous.