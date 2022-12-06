---
title: 14.1 - 运算符重载简介
alias: 14.1 - 运算符重载简介
origin: /introduction-to-operator-overloading/
origin_title: "14.1 — Introduction to operator overloading"
time: 2022-4-8
type: translation
tags:
- operator
- overload
---

??? note "Key Takeaway"
	


In lesson [8.9 -- Introduction to function overloading](https://www.learncpp.com/cpp-tutorial/introduction-to-function-overloading/), you learned about function overloading, which provides a mechanism to create and resolve function calls to multiple functions with the same name, so long as each function has a unique function prototype. This allows you to create variations of a function to work with different data types, without having to think up a unique name for each variant.

In C++, operators are implemented as functions. By using function overloading on the operator functions, you can define your own versions of the operators that work with different data types (including classes that you’ve written). Using function overloading to overload operators is called **operator overloading**.

In this chapter, we’ll examine topics related to operator overloading.

**Operators as functions**

Consider the following example:

```cpp
int x { 2 };
int y { 3 };
std::cout << x + y << '\n';
```

COPY

The compiler comes with a built-in version of the plus operator (+) for integer operands -- this function adds integers x and y together and returns an integer result. When you see the expression `x + y`, you can translate this in your head to the function call `operator+(x, y)` (where operator+ is the name of the function).

Now consider this similar snippet:

```cpp
double z { 2.0 };
double w { 3.0 };
std::cout << w + z << '\n';
```

COPY

The compiler also comes with a built-in version of the plus operator (+) for double operands. Expression w + z becomes function call `operator+(w, z)`, and function overloading is used to determine that the compiler should be calling the double version of this function instead of the integer version.

Now consider what happens if we try to add two objects of a user-defined class:

```cpp
Mystring string1 { "Hello, " };
Mystring string2 { "World!" };
std::cout << string1 + string2 << '\n';
```

COPY

What would you expect to happen in this case? The intuitive expected result is that the string “Hello, World!” would be printed on the screen. However, because Mystring is a user-defined class, the compiler does not have a built-in version of the plus operator that it can use for Mystring operands. So in this case, it will give us an error. In order to make it work like we want, we’d need to write an overloaded function to tell the compiler how the + operator should work with two operands of type Mystring. We’ll look at how to do this in the next lesson.

**Resolving overloaded operators**

When evaluating an expression containing an operator, the compiler uses the following rules:

-   If _all_ of the operands are fundamental data types, the compiler will call a built-in routine if one exists. If one does not exist, the compiler will produce a compiler error.
-   If _any_ of the operands are user data types (e.g. one of your classes, or an enum type), the compiler looks to see whether the type has a matching overloaded operator function that it can call. If it can’t find one, it will try to convert one or more of the user-defined type operands into fundamental data types so it can use a matching built-in operator (via an overloaded typecast, which we’ll cover later in this chapter). If that fails, then it will produce a compile error.

**What are the limitations on operator overloading?**

First, almost any existing operator in C++ can be overloaded. The exceptions are: conditional (?:), sizeof, scope (::), member selector (.), pointer member selector (.*), typeid, and the casting operators.

Second, you can only overload the operators that exist. You can not create new operators or rename existing operators. For example, you could not create an operator ** to do exponents.

Third, at least one of the operands in an overloaded operator must be a user-defined type. This means you can not overload the plus operator to work with one integer and one double. However, you could overload the plus operator to work with an integer and a Mystring.

Fourth, it is not possible to change the number of operands an operator supports.

Finally, all operators keep their default precedence and associativity (regardless of what they’re used for) and this can not be changed.

Some new programmers attempt to overload the bitwise XOR operator (^) to do exponentiation. However, in C++, operator^ has a lower precedence level than the basic arithmetic operators, which causes expressions to evaluate incorrectly.

In basic mathematics, exponentiation is resolved before basic arithmetic, so 4 + 3 ^ 2 resolves as 4 + (3 ^ 2) => 4 + 9 => 13.  
However, in C++, the arithmetic operators have higher precedence than operator^, so 4 + 3 ^ 2 resolves as (4 + 3) ^ 2 => 7 ^ 2 => 49.

You’d need to explicitly parenthesize the exponent portion (e.g. 4 + (3 ^ 2)) every time you used it for this to work properly, which isn’t intuitive, and is potentially error-prone.

Because of this precedence issue, it’s generally a good idea to use operators only in an analogous way to their original intent.

Best practice

When overloading operators, it’s best to keep the function of the operators as close to the original intent of the operators as possible.

Furthermore, because operators don’t have descriptive names, it’s not always clear what they are intended to do. For example, operator+ might be a reasonable choice for a string class to do concatenation of strings. But what about operator-? What would you expect that to do? It’s unclear.

Best practice

If the meaning of an overloaded operator is not clear and intuitive, use a named function instead.

Within those confines, you will still find plenty of useful functionality to overload for your custom classes! You can overload the + operator to concatenate your user-defined string class, or add two Fraction class objects together. You can overload the << operator to make it easy to print your class to the screen (or a file). You can overload the equality operator (==) to compare two class objects. This makes operator overloading one of the most useful features in C++ -- simply because it allows you to work with your classes in a more intuitive way.

In the upcoming lessons, we’ll take a deeper look at overloading different kinds of operators.