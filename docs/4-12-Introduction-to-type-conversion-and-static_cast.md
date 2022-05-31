---
title: 4.12 - 类型转换和 static_cast
alias: 4.12 - 类型转换和 static_cast
origin: /introduction-to-type-conversion-and-static_cast/
origin_title: "4.12 — Introduction to type conversion and static_cast"
time: 2022-3-27
type: translation
tags:
- type conversion 
- static_cast
---

## Implicit type conversion

Consider the following program:

```cpp
#include <iostream>

void print(double x) // print takes an double parameter
{
	std::cout << x;
}

int main()
{
	print(5); // what happens when we pass an int value?

	return 0;
}
```

COPY

In the above example, the `print()` function has a parameter of type `double` but the caller is passing in the value `5` which is of type `int`. What happens in this case?

In most cases, C++ will happily convert values of one fundamental type to another fundamental type. The process of converting a value from one type to another type is called type conversion. Thus, the int argument `5` will be converted to double value `5.0` and then copied into parameter `x`. The `print()` function will print this value, resulting in the following output:

5

When the compiler does type conversion for us, we call this implicit type conversion.

## Implicit type conversion warnings

Although implicit type conversion is sufficient for most cases where type conversion is needed, there are a few cases where it is not. Consider the following program, which is similar to the example above:

```cpp
#include <iostream>

void print(int x) // print now takes an int parameter
{
	std::cout << x;
}

int main()
{
	print(5.5); // warning: we're passing in a double value

	return 0;
}
```

COPY

In this program, we’ve changed `print()` to take an `int` parameter, and the function call to `print()` is now passing in `double` value `5.5`. Similar to the above, the compiler will use implicit type conversion in order to convert double value `5.5` into an value of of type `int`, so that it can be passed to function `print()`.

Unlike the initial example, when this program is compiled, your compiler will generate some kind of a warning about a possible loss of data. And because you have “treat warnings as errors” turned on (you do, right?), your compiler will abort the compilation process.

!!! tip "小贴士"

	You’ll need to disable “treat warnings as errors” temporarily if you want to compile this example. See lesson [0.11 -- Configuring your compiler: Warning and error levels](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-warning-and-error-levels/)for more information about this setting.

When compiled and run, this program prints the following:

5

Note that although we passed in value `5.5`, the program printed `5`. Because integral values can’t hold fractions, when double value `5.5` is implicitly converted to an `int`, the fractional component is dropped, and only the integral value is retained.

Because converting a floating point value to an integral value results in any fractional component being dropped, the compiler will warn us when it does an implicit type conversion from a floating point to an integral value. This happens even if we were to pass in a floating point value with no fractional component, like `5.0` -- no actual loss of value occurs during the conversion to integral value `5` in this specific case, but the compiler will still warn us that the conversion is unsafe.

Key insight

Some type conversions are always safe to make (such as `int` to `double`), whereas others may result in the value being changed during conversion (such as `double`to `int`). Unsafe implicit conversions will typically either generate a compiler warning, or (in the case of brace initialization) an error.

This is one of the primary reasons brace initialization is the preferred initialization form. Brace initialization will ensure we don’t try to initialize a variable with a initializer that will lose value when it is implicitly type converted:

```cpp
int main()
{
    double d { 5 }; // okay: int to double is safe
    int x { 5.5 }; // error: double to int not safe

    return 0;
}
```


!!! info "相关内容"

	Implicit type conversion is a meaty topic. We dig into this topic in more depth in future lessons, starting with lesson [8.1 -- Implicit type conversion (coercion)](https://www.learncpp.com/cpp-tutorial/implicit-type-conversion-coercion/).

An introduction to explicit type conversion via the static_cast operator

Back to our most recent `print()` example, what if we _intentionally_ wanted to pass a double value to a function taking an integer (knowing that the converted value would drop any fractional component?) Turning off “treat warnings as errors” to just to make our program compile is a bad idea, as it might open the door for other issues to slip through.

C++ supports a second type of type conversion, called explicit type conversion. Explicit type conversion allow us (the programmer) to explicitly tell the compiler to convert a value from one type to another type, and that we take full responsibility for the result of that conversion (meaning that if the conversion results in the loss of value, it’s our fault).

To perform an explicit type conversion, in most cases we’ll use the `static_cast` operator. The syntax for the `static cast` looks a little funny:

static_cast<new_type>(expression)

static_cast takes the value from an expression as input, and returns that value converted into the type specified by _new_type_ (e.g. int, bool, char, double).

Key insight

Whenever you see C++ syntax (excluding the preprocessor) that makes use of angled brackets (<>), the thing between the angled brackets will most likely be a type. This is typically how C++ deals with concepts that need a parameterizable type.

Let’s update our prior program using `static_cast`:

```cpp
#include <iostream>

void print(int x)
{
	std::cout << x;
}

int main()
{
	print( static_cast<int>(5.5) ); // explicitly convert double value 5.5 to an int

	return 0;
}
```

COPY

Because we’re now explicitly requesting that double value `5.5` be converted to an `int` value, the compiler will not generate a warning about a possible loss of data upon compilation (meaning we can leave “treat warnings as errors” enabled).

Related content

C++ supports other types of casts. We talk more about the different types of casts in future lesson [8.5 -- Explicit type conversion (casting) and static_cast](https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/).

Using static_cast to convert char to int

In the lesson on chars [4.11 -- Chars](https://www.learncpp.com/cpp-tutorial/chars/), we saw that printing a char value using `std::cout` results in the value being printed as a char:

```cpp
#include <iostream>

int main()
{
    char ch{ 97 }; // 97 is ASCII code for 'a'
    std::cout << ch << '\n';

    return 0;
}
```

COPY

This prints:

a

If we want to print the integral value instead of the char, we can do this by using `static_cast` to cast the value from a `char` to an `int`:

```cpp
#include <iostream>

int main()
{
    char ch{ 97 }; // 97 is ASCII code for 'a'
    std::cout << ch << " has value " << static_cast<int>(ch) << '\n'; // print value of variable ch as an int

    return 0;
}
```

COPY

This prints:

a has value 97

It’s worth noting that the argument to _static_cast_ evaluates as an expression. When we pass in a variable, that variable is evaluated to produce its value, and that value is then converted to the new type. The variable itself is _not_ affected by casting its value to a new type. In the above case, variable `ch` is still a char, and still holds the same value even after we’ve cast its value to an `int`.

## Converting unsigned numbers to signed numbers

To convert an unsigned number to a signed number, you can also use the `static_cast` operator:

```cpp
#include <iostream>

int main()
{
    unsigned int u { 5u }; // 5u means the number 5 as an unsigned int
    int s { static_cast<int>(u) }; // return value of variable u as an int

    std::cout << s;
    return 0;
}
```

COPY

The `static_cast` operator doesn’t do any range checking, so if you cast a value to a type whose range doesn’t contain that value, undefined behavior will result. Therefore, the above cast from `unsigned int` to `int` will yield unpredictable results if the value of the `unsigned int` is greater than the maximum value a signed `int` can hold.

Warning

The static_cast operator will produce undefined behavior if the value being converted doesn’t fit in range of the new type.

std::int8_t and std::uint8_t likely behave like chars instead of integers

As noted in lesson [4.6 -- Fixed-width integers and size_t](https://www.learncpp.com/cpp-tutorial/fixed-width-integers-and-size-t/), most compilers define and treat `std::int8_t` and `std::uint8_t` (and the corresponding fast and least fixed-width types) identically to types `signed char` and `unsigned char` respectively. Now that we’ve covered what chars are, we can demonstrate where this can be problematic:

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::int8_t myint{65}; // initialize myint with value 65
    std::cout << myint;    // you're probably expecting this to print 65

    return 0;
}
```

COPY

Because `std::int8_t` describes itself as an int, you might be tricked into believing that the above program will print the integral value `65`. However, on most systems, this program will print `A` instead (treating `myint` as a `signed char`). However, this is not guaranteed (on some systems, it may actually print `65`).

If you want to ensure that a `std::int8_t` or `std::uint8_t` object is treated as an integer, you can convert the value to an integer using `static_cast`:

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::int8_t myint{65};
    std::cout << static_cast<int>(myint); // will always print 65

    return 0;
}
```

COPY

In cases where `std::int8_t` is treated as a char, input from the console can also cause problems:

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::cout << "Enter a number between 0 and 255: ";
    std::int8_t myint{};
    std::cin >> myint;

    std::cout << "You entered: " << static_cast<int>(myint);

    return 0;
}
```

COPY

A sample run of this program:

Enter a number between 0 and 255: 35
You entered: 51

Here’s what’s happening. When `std::int8_t` is treated as a char, the input routines interpret our input as a sequence of characters, not as an integer. So when we enter `35`, we’re actually entering two chars, `'3'` and `'5'`. Because a char object can only hold one character, the `'3'` is extracted (the `'5'` is left in the input stream for possible extraction later). Because the char `'3'` has ASCII code point 51, the value `51` is stored in `myint`, which we then print later as an int.

In contrast, the other fixed-width types will always print and input as integral values.