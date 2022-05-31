---
title: 4.15 - 符号常数 const 和 constexpr 变量
alias: 4.15 - 符号常数 const 和 constexpr 变量
origin: /const-constexpr-and-symbolic-constants/
origin_title: "4.15 -- Symbolic constants-const and constexpr variables"
time: 2022-5-24
type: translation
tags:
- const
- constexpr
---

## Const variables

So far, all of the variables we’ve seen have been non-constant -- that is, their values can be changed at any time. For example:

```cpp
int x { 4 }; // initialize x with the value of 4
x = 5; // change value of x to 5
```

COPY

However, it’s sometimes useful to define variables with values that can not be changed. For example, consider the gravity of Earth (near the surface): `9.8 meters/second^2`. This isn’t likely to change any time soon (and if it does, you’ve likely got bigger problems than learning C++). Defining this value as a constant helps ensure that this value isn’t accidentally changed.

To make a variable constant, simply put the `const` keyword either before or after the variable type, like so:

```cpp
const double gravity { 9.8 };  // preferred use of const before type
int const sidesInSquare { 4 }; // "east const" style, okay, but not preferred
```


Although C++ will accept const either before or after the type, we recommend using _const_ before the type because it better follows standard English language convention where modifiers come before the object being modified (e.g. a “a green ball”, not a “a ball green”).

Constant variables are sometimes called symbolic constants (as opposed to literal constants, which are just values that have no name).

## Const variables must be initialized

Const variables _must_ be initialized when you define them, and then that value can not be changed via assignment:

```cpp
int main()
{
    const double gravity; // error: const variables must be initialized
    gravity = 9.9; // error: const variables can not be changed

    return 0;
}
```

Note that const variables can be initialized from other variables (including non-const ones):

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age };

    // age is non-const and can be changed
    // usersAge is const and can not be changed

    std::cout << usersAge;

    return 0;
}
```

COPY

## Runtime vs compile-time constants

C++ actually has two different kinds of constants.

Runtime constants are constants whose initialization values can only be resolved at runtime (when your program is running). The following are examples of runtime constants:

```cpp
#include <iostream>

void printInt(const int x) // x is a runtime constant because the value isn't known until the program is run
{
    std::cout << x;
}

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age }; // usersAge is a runtime constant because the value isn't known until the program is run

    std::cout << "Your age is: ";
    printInt(usersAge);

    return 0;
}
```

COPY

Variables such as _usersAge_ and _x_ in the above program above are runtime constants, because the compiler can’t determine their initial values until the program is actually run. _usersAge_ relies on user input (which can only be given at runtime) and _x_ depends on the value passed into the function (which is only known at runtime). However, once initialized, the value of these constants can’t be changed.

Compile-time constants are constants whose initialization values can be determined at compile-time (when your program is compiling). The following are examples of compile-time constants:

```cpp
const double gravity { 9.8 }; // the compiler knows at compile-time that gravity will have value 9.8
const int something { 1 + 2 }; // the compiler can resolve this at compiler time
```

COPY

Compile-time constants enable the compiler to perform optimizations that aren’t available with runtime constants. For example, whenever _gravity_ is used, the compiler can simply substitute the identifier _gravity_ with the literal double _9.8_.

When you declare a const variable, the compiler will implicitly keep track of whether it’s a runtime or compile-time constant. In most cases, this doesn’t matter, but there are a few odd cases where C++ requires a compile-time constant instead of a run-time constant (we’ll cover these cases later as we introduce those topics).

## constexpr

To help provide more specificity, C++11 introduced the keyword **constexpr**, which ensures that a constant must be a compile-time constant:

```cpp
#include <iostream>

int main()
{
    constexpr double gravity { 9.8 }; // ok, the value of 9.8 can be resolved at compile-time
    constexpr int sum { 4 + 5 }; // ok, the value of 4 + 5 can be resolved at compile-time

    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    constexpr int myAge { age }; // compile error: age is a runtime constant, not a compile-time constant

    return 0;
}
```

COPY

!!! success "最佳实践"

	Any variable that should not be modifiable after initialization and whose initializer is known at compile-time should be declared as constexpr.  

	Any variable that should not be modifiable after initialization and whose initializer is not known at compile-time should be declared as const.

In reality, developers often skip making local variables in short/trivial functions const, because there is little chance of accidentally modifying a value.

Note that literals are also implicitly constexpr, as the value of a literal is known at compile-time.

## Constant expressions 

A constant expression is an expression that can be evaluated at compile-time. For example:

```cpp
#include <iostream>

int main()
{
	std::cout << 3 + 4; // 3 + 4 evaluated at compile-time

	return 0;
}
```

COPY

In the above program, because the literal values `3` and `4` are known at compile-time, the compiler can evaluate the expression `3 + 4` at compile-time and substitute in the resulting value `7`. That makes the code faster because `3 + 4` no longer has to be calculated at runtime.

Constexpr variables can also be used in constant expressions:

```cpp
#include <iostream>

int main()
{
	constexpr int x { 3 };
	constexpr int y { 4 };
	std::cout << x + y; // x + y evaluated at compile-time

	return 0;
}
```

COPY

In the above example, because `x` and `y` are constexpr, the expression `x + y` is a constant expression that can be evaluated at compile-time. Similar to the literal case, the compiler can substitute in the value `7`.

## Constexpr strings

If you try to define a `constexpr std::string`, your compiler will generate an error:

```cpp
#include <iostream>
#include <string>

using namespace std::literals;

int main()
{
    constexpr std::string name{ "Alex"s }; // compile error

    std::cout << "My name is: " << name;

    return 0;
}
```

COPY

This happens because `constexpr std::string` isn’t supported in C++17 or earlier, and only has minimal support in C++20. If you need constexpr strings, use `std::string_view` instead:

```cpp
#include <iostream>
#include <string_view>

using namespace std::literals;

int main()
{
    constexpr std::string_view name{ "Alex"sv }; // ok: std::string_view can be constexpr

    std::cout << "My name is: " << name;

    return 0;
}
```

COPY

!!! info "相关内容"

	<>

We cover std::string view in lesson [[11-7-An-introduction-to-std-string_view|11.7 - std::string_view 简介]]

## Naming your const variables

Some programmers prefer to use all upper-case names for const variables. Others use normal variable names with a ‘k’ prefix. However, we will use normal variable naming conventions, which is more common. Const variables act exactly like normal variables in every case except that they can not be assigned to, so there’s no particular reason they need to be denoted as special.

## Const function parameters and return values

Const can also be used with function parameters:

```cpp
#include <iostream>

void printInt(const int x)
{
    std::cout << x;
}

int main()
{
    printInt(5); // 5 will be used as the initializer for x
    printInt(6); // 6 will be used as the initializer for x

    return 0;
}
```


Making a function parameter const enlists the compiler’s help to ensure that the parameter’s value is not changed inside the function. Note that we did not provide an explicit initializer for our const parameter -- the value of the argument in the function call will be used as the initializer in this case.

When arguments are passed by value, we generally don’t care if the function changes the value of the parameter (since it’s just a copy that will be destroyed at the end of the function anyway). For this reason, we usually don’t const parameters passed by value. But later on, we’ll talk about other kinds of function parameters (where changing the value of the parameter will change the value of the argument passed in). For these other types of parameters, use of const is important.

!!! success "最佳实践"

	Function parameters for arguments passed by value should not be made const.

A function’s return value may also be made const:

```cpp
#include <iostream>

const int getValue()
{
    return 5;
}

int main()
{
    std::cout << getValue();

    return 0;
}
```


However, since the returned value is a copy, there’s little point in making it const.

!!! success "最佳实践"

	Don’t use const with return by value.

## Avoid using object-like preprocessor macros for symbolic constants

In lesson [[2-10-Introduction-to-the-preprocessor|2.10 - 预处理器简介]], you learned that object-like macros have two forms -- one that doesn’t take a substitution parameter (generally used for conditional compilation), and one that does have a substitution parameter. We’ll talk about the case with the substitution parameter here. That takes the form:

`#define` identifier substitution_text

Whenever the preprocessor encounters this directive, any further occurrence of _identifier_ is replaced by _substitution_text_. The identifier is traditionally typed in all capital letters, using underscores to represent spaces.

Consider the following snippet:

```cpp
#define MAX_STUDENTS_PER_CLASS 30
int max_students { numClassrooms * MAX_STUDENTS_PER_CLASS };
```

When you compile your code, the preprocessor replaces all instances of MAX_STUDENTS_PER_CLASS with the literal value 30, which is then compiled into your executable.

So why not use `#define` to make symbolic constants? There are (at least) three major problems.

First, because macros are resolved by the preprocessor, all occurrences of the macro are replaced with the defined value just prior to compilation. If you are debugging your code, you won’t see the actual value (e.g. `30`) -- you’ll only see the name of the symbolic constant (e.g. `MAX_STUDENTS_PER_CLASS`). And because these `#defined` values aren’t variables, you can’t add a watch in the debugger to see their values. If you want to know what value `MAX_STUDENTS_PER_CLASS` resolves to, you’ll have to find the definition of `MAX_STUDENTS_PER_CLASS` (which could be in a different file). This can make your programs harder to debug.

Second, macros can have naming conflicts with normal code. For example:

```cpp
#include "someheader.h"
#include <iostream>

int main()
{
    int beta { 5 };
    std::cout << beta;

    return 0;
}
```


If `someheader.h` happened to `#define` a macro named _beta_, this simple program would break, as the preprocessor would replace the int variable beta’s name with whatever the macro’s value was. This is normally avoided by using all caps for macro names, but it can still happen.

Thirdly, macros don’t follow normal scoping rules, which means in rare cases a macro defined in one part of a program can conflict with code written in another part of the program that it wasn’t supposed to interact with.

!!! warning "注意"

	Avoid using `#define` to create symbolic constants macros. Use const or constexpr variables instead.

## Using symbolic constants throughout a multi-file program

In many applications, a given symbolic constant needs to be used throughout your code (not just in one location). These can include physics or mathematical constants that don’t change (e.g. pi or Avogadro’s number), or application-specific “tuning” values (e.g. friction or gravity coefficients). Instead of redefining these every time they are needed, it’s better to declare them once in a central location and use them wherever needed. That way, if you ever need to change them, you only need to change them in one place.

There are multiple ways to facilitate this within C++ we cover this topic in full detail in lesson [6.9 -- Sharing global constants across multiple files (using inline variables)](https://www.learncpp.com/cpp-tutorial/sharing-global-constants-across-multiple-files-using-inline-variables/).

## Avoid magic numbers, use symbolic constants instead

A magic number is a literal (usually a number) that either has an unclear meaning or is used multiple times.

The following snippet shows an example of a magic number with an unclear meaning:

```cpp
constexpr int maxStudentsPerSchool{ numClassrooms * 30 };
```


What does the literal 30 mean in this context? Although you can probably guess that in this case it’s the maximum number of students per class, it’s not totally obvious. In more complex programs, it can be very difficult to infer what a hard-coded number represents, unless there’s a comment to explain it.

Fortunately, we can use symbolic constants to disambiguate magic numbers:

```cpp
constexpr int maxStudentsPerClass { 30 }; // now obvious what 30 is
constexpr int maxStudentsPerSchool{ numClassrooms * maxStudentsPerClass };
```


Using magic numbers is generally considered bad practice because, in addition to not providing context as to what they are being used for, they pose problems if the value needs to change. Let’s assume that the school buys new desks that allow them to raise the class size from 30 to 35, and our program needs to reflect that. Consider the following program:

```cpp
constexpr int maxStudents{ numClassrooms * 30 };
setMax(30);
```


To update our program to use the new classroom size, we’d have to update the constant 30 to 35. But what about the call to `setMax()`? Does that 30 have the same meaning as the other 30? If so, it should be updated. If not, it should be left alone, or we might break our program somewhere else. If you do a global search-and-replace, you might inadvertently update the argument of setMax() when it wasn’t supposed to change. So you have to look through all the code for every instance of the literal 30, and then determine whether it needs to change or not. That can be seriously time consuming (and error prone).

The following code (using symbolic constants) makes it much clearer that these two uses of the value 30 are not related:

```cpp
constexpr int maxStudentsPerClass { 30 }; // now obvious what 30 is
constexpr int totalStudents{ numClassrooms * maxStudentsPerClass };

constexpr int maxNameLength{ 30 };
setMax(maxNameLength); // now obvious this 30 is used in a different context
```

Magic numbers aren’t always numbers -- they can also be strings or other types.

Note that literals used only once, and in obvious contexts, are not considered “magic”. The values -1, 0, 0.0, and 1 are often used in contexts that are obvious:

```cpp
int idGenerator { 0 };         // fine: we're starting our id generator with value 0
idGenerator = idGenerator + 1; // fine: we're just incrementing our generator
```


Other numbers may also be obvious in context (and thus, not considered magic):

```cpp
int kmtoM(int km) { return km * 1000; } // fine: it's obvious 1000 is a conversion factor
```


!!! success "最佳实践"

	Avoid magic numbers in your code (use symbolic constants instead).