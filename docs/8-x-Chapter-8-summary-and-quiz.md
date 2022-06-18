---
title: 
alias: 
origin: /none/
origin_title: "none"
time: 2022-1-20
type: translation
tags:
- summary
---

??? note "关键点速记"
	

You made it! The topics in this chapter (particularly type aliases, overloaded functions, and function templates) appear everywhere in the C++ standard library. We’ve got one more chapter to go (introducing compound types), and then we’ll be ready to dig into some of the most useful pieces of the standard library!

## Quick review

The process of converting a value from one data type to another data type is called a type conversion.

**Implicit type conversion** (also called automatic type conversion or coercion) is performed whenever one data type is expected, but a different data type is supplied. If the compiler can figure out how to do the conversion between the two types, it will. If it doesn’t know how, then it will fail with a compile error.

The C++ language defines a number of built-in conversions between its fundamental types (as well as a few conversions for more advanced types) called **standard conversions**. These include numeric promotions, numeric conversions, and arithmetic conversions.

A **numeric promotio**n is the conversion of smaller numeric types to larger numeric types (typically `int` or `double`), so that the CPU can operate on data that matches the natural data size for the processor. Numeric promotions include both integral promotions and floating-point promotions. Numeric promotions are value-preserving, meaning there is no loss of value or precision.

A **numeric conversion** is a type conversion between fundamental types that isn’t a numeric promotion. A narrowing conversion is a numeric conversion that may result in the loss of value or precision.

In C++, certain binary operators require that their operands be of the same type. If operands of different types are provided, one or both of the operands will be implicitly converted to matching types using a set of rules called the usual arithmetic conversions.

**Explicit type conversion** is performed when the programmer explicitly requests conversion via a cast. A cast represents a request by the programmer to do an explicit type conversion. C++ supports 5 types of casts: `C-style casts`, `static casts`, `const casts`, `dynamic casts`, and `reinterpret casts`. Generally you should avoid `C-style casts`, `const casts`, and `reinterpret casts`. `static_cast` is used to convert a value from one type to a value of another type, and is by far the most used cast in C++.

**Typedefs** and **Type aliases** allow the programmer to create an alias for a data type. These aliases are not new types, and act identically to the aliased type. Typedefs and type aliases do not provide any kind of type safety, and care needs to be taken to not assume the alias is different than the type it is aliasing.

The **auto** keyword has a number of uses. First, auto can be used to do type deduction (also called type inference), which will deduce a variable’s type from its initializer. Type deduction drops const and references, so be sure to add those back if you want them.

Auto can also be used as a function return type to have the compiler infer the function’s return type from the function’s return statements, though this should be avoided for normal functions. Auto is used as part of the trailing return syntax.

**Function overloading** allows us to create multiple functions with the same name, so long as each identically named function has different set of parameter types (or the functions can be otherwise differentiated). Such a function is called an overloaded function (or overload for short). Return types are not considered for differentiation.

When resolving overloaded functions, if an exact match isn’t found, the compiler will favor overloaded functions that can be matched via numeric promotions over those that require numeric conversions. When a function call is made to function that has been overloaded, the compiler will try to match the function call to the appropriate overload based on the arguments used in the function call. This is called overload resolution.

An **ambiguous match** occurs when the compiler finds two or more functions that can match a function call to an overloaded function and can’t determine which one is best.

A **default argument** is a default value provided for a function parameter. Parameters with default arguments must always be the rightmost parameters, and they are not used to differentiate functions when resolving overloaded functions.

**Function templates** allow us to create a function-like definition that serves as a pattern for creating related functions. In a function template, we use **template types** as placeholders for any types we want to be specified later. The syntax that tells the compiler we’re defining a template and declares the template types is called a **template parameter declaration**.

The process of creating functions (with specific types) from function templates (with template types) is called **function template instantiation** (or instantiation) for short. When this process happens due to a function call, it’s called **implicit instantiation**. An instantiated function is called a **function instance** (or **instance** for short, or sometimes a **template function**).

**Template argument deduction** allows the compiler to deduce the actual type that should be used to instantiate a function from the arguments of the function call. Template argument deduction does not do type conversion.

Template types are sometimes called **generic types**, and programming using templates is sometimes called **generic programming**.

In C++20, when the auto keyword is used as a parameter type in a normal function, the compiler will automatically convert the function into a function template with each auto parameter becoming an independent template type parameter. This method for creating a function template is called an **abbreviated function template**.