---
title: 10.3 - 限定作用域枚举类型
alias: 10.3 - 限定作用域枚举类型
origin: /unscoped-enumeration-input-and-output/
origin_title: "10.3 — Unscoped enumeration input and output"
time: 2022-8-25
type: translation
tags:
- enum 
- unscoped enumerations
---

??? note "关键点速记"

In the prior lesson ([[10-2-unscoped-enumerations|10.2 - 非限定作用域枚举类型]]), we mentioned that enumerators are symbolic constants. What we didn’t tell you then is that enumerators are _integral_ symbolic constants. As a result, enumerated types actually hold an integral value.

This is similar to the case with chars ([[4-11-Chars|4.11 - 字符]]). Consider:

```cpp
char ch { 'A' };
```


A char is really just a 1-byte integral value, and the character `'A'` gets converted to an integral value (in this case, `65`) and stored.

When we define an enumerator, each enumerator is automatically assigned an integer value based on its position in the enumerator list. By default, the first enumerator is assigned the integral value `0`, and each subsequent enumerator has a value one greater than the previous enumerator:

```cpp
#include <iostream>

enum Color
{
    black, // assigned 0
    red, // assigned 1
    blue, // assigned 2
    green, // assigned 3
    white, // assigned 4
    cyan, // assigned 5
    yellow, // assigned 6
    magenta, // assigned 7
};

int main()
{
    Color shirt{ blue }; // This actually stores the integral value 2

    return 0;
}
```


It is possible to explicitly define the value of enumerators. These integral values can be positive or negative, and can share the same value as other enumerators. Any non-defined enumerators are given a value one greater than the previous enumerator.

```cpp
enum Animal
{
    cat = -3,
    dog,         // assigned -2
    pig,         // assigned -1
    horse = 5,
    giraffe = 5, // shares same value as horse
    chicken,      // assigned 6
};
```

COPY

Note in this case, `horse` and `giraffe` have been given the same value. When this happens, the enumerators become non-distinct -- essentially, `horse` and `giraffe` are interchangeable. Although C++ allows it, assigning the same value to two enumerators in the same enumeration should generally be avoided.

!!! success "最佳实践"

	Avoid assigning explicit values to your enumerators unless you have a compelling reason to do so.

## Unscoped enumerations will implicitly convert to integral values

Consider the following program:

```cpp
#include <iostream>

enum Color
{
    black, // assigned 0
    red, // assigned 1
    blue, // assigned 2
    green, // assigned 3
    white, // assigned 4
    cyan, // assigned 5
    yellow, // assigned 6
    magenta, // assigned 7
};

int main()
{
    Color shirt{ blue };

    std::cout << "Your shirt is " << shirt; // what does this do?

    return 0;
}
```

COPY

Since enumerated types hold integral values, as you might expect, this prints:

Your shirt is 2

When an enumerated type is used in a function call or with an operator, the compiler will first try to find a function or operator that matches the enumerated type. For example, when the compiler tries to compile `std::cout << shirt`, the compiler will first look to see if `operator<<` knows how to print an object of type `Color` (because `shirt` is of type `Color`) to `std::cout`. It doesn’t.

If the compiler can’t find a match, the compiler will then implicitly convert an unscoped enumeration or enumerator to its corresponding integer value. Because `std::cout` does know how to print an integral value, the value in `shirt` gets converted to an integer and printed as integer value `2`.

## Printing enumerator names

Most of the time, printing an enumeration as an integral value (such as `2`) isn’t what we want. Instead, we typically will want to print the name of whatever the enumerator represents (`blue`). But to do that, we need some way to convert the integral value of the enumeration (`2`) into a string matching the enumerator name (`"blue"`).

As of C++20, C++ doesn’t come with any easy way to do this, so we’ll have to find a solution ourselves. Fortunately, that’s not very difficult. The typical way to do this is to write a function that takes an enumerated type as a parameter and then outputs the corresponding string (or returns the string to the caller).

The typical way to do this is to test our enumeration against every possible enumerator:

```cpp
// Using if-else for this is inefficient
void printColor(Color color)
{
    if (color == black) std::cout << "black";
    else if (color == red) std::cout << "red";
    else if (color == blue) std::cout << "blue";
    else std::cout << "???";
}
```

COPY

However, using a series of if-else statements for this is inefficient, as it requires multiple comparisons before a match is found. A more efficient way to do the same thing is to use a switch statement. In the following example, we will also return our `Color` as a `std::string`, to give the caller more flexibility to do whatever they want with the name (including print it):

```cpp
#include <iostream>
#include <string>

enum Color
{
    black,
    red,
    blue,
};


// We'll show a better version of this for C++17 below
std::string getColor(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    Color shirt { blue };

    std::cout << "Your shirt is " << getColor(shirt) << '\n';

    return 0;
}
```

COPY

This prints:

Your shirt is blue

This likely performs better than the if-else chain (switch statements tend to be more efficient than if-else chains), and it’s easier to read too. However, this version is still inefficient, because we need to create and return a `std::string` (which is expensive) every time the function is called.

In C++17, a more efficient option is to replace `std::string` with `std::string_view`. `std::string_view` allows us to return string literals in a way that is much less expensive to copy.

```cpp
#include <iostream>
#include <string_view> // C++17

enum Color
{
    black,
    red,
    blue,
};

constexpr std::string_view getColor(Color color) // C++17
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    Color shirt{ blue };

    std::cout << "Your shirt is " << getColor(shirt) << '\n';

    return 0;
}
```

COPY

!!! info "相关内容"

	Constexpr return types are covered in in lesson [6.14 -- Constexpr and consteval functions](https://www.learncpp.com/cpp-tutorial/constexpr-and-consteval-functions/).

## Teaching `operator<<` how to print an enumerator

Although the above example functions well, we still have to remember the name of the function we created to get the enumerator name. While this usually isn’t too burdensome, it can become more problematic if you have lots of enumerations. Using operator overloading (a capability similar to function overloading), we can actually teach `operator<<` how to print the value of a program-defined enumeration! We haven’t explained how this works yet, so consider it a bit of magic for now:

```cpp
#include <iostream>

enum Color
{
	black,
	red,
	blue,
};

// Teach operator<< how to print a Color
// Consider this magic for now since we haven't explained any of the concepts it uses yet
// std::ostream is the type of std::cout
// The return type and parameter type are references (to prevent copies from being made)!
std::ostream& operator<<(std::ostream& out, Color color)
{
	switch (color)
	{
	case black: out << "black";  break;
	case red:   out << "red";    break;
	case blue:  out << "blue";   break;
	default:    out << "???";    break;
	}

	return out;
}

int main()
{
	Color shirt{ blue };
	std::cout << "Your shirt is " << shirt; // it works!

	return 0;
}
```

COPY

This prints:

Your shirt is blue

!!! info "扩展阅读"

    For the curious, here’s what the above code is actually doing. When we try to print `shirt` using `std::cout` and `operator<<`, the compiler will see that we’ve overloaded `operator<<` to work with objects of type `Color`. This overloaded `operator<<` function is then called with `std::cout` as the `out` parameter, and our `shirt` as parameter `color`. Since `out` is a reference to `std::cout`, a statement such as `out << "blue"` is really just printing `"blue"` to `std::cout`.

We cover overloading the I/O operators in lesson [14.4 -- Overloading the I/O operators](https://www.learncpp.com/cpp-tutorial/overloading-the-io-operators/). For now, you can copy this code and replace `Color` with your own enumerated type.

## Enumeration size and base

Enumerated types are considered part of the integer family of types, and it’s up to the compiler to determine how much memory to allocate for an enum variable. The C++ standard says the enum size needs to be large enough to represent all of the enumerator values. Most often, it will make enum variables the same size as a standard `int`.

However, it is possible to specify a different underlying type. For example, if you are working in some bandwidth-sensitive context (e.g. sending data over a network) you may want to specify a smaller type:

```cpp
// Use an 8-bit unsigned integer as the enum base
enum Color : std::uint8_t
{
    black,
    red,
    blue,
};
```

COPY

Since enumerators aren’t usually used for arithmetic or comparisons with integers, it’s generally safe to use an unsigned integer if desired.

!!! success "最佳实践"

	Specify the base type of an enumeration only when necessary.

## Integer to unscoped enumerator conversion

While the compiler will implicitly convert unscoped enumerators to an integer, it will _not_ implicitly convert an integer to an unscoped enumerator. The following will produce a compiler error:

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { 2 }; // compile error: integer value 2 won't implicitly convert to a Pet
    pet = 3;       // compile error: integer value 3 won't implicitly convert to a Pet

    return 0;
}
```

COPY

There are two ways to work around this.

First, you can force the compiler to convert an integer to an unscoped enumerator using `static_cast`:

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { static_cast<Pet>(2) }; // convert integer 2 to a Pet
    pet = static_cast<Pet>(3);       // our pig evolved into a whale!

    return 0;
}
```

COPY

We’ll see an example in a moment where this can be useful.

Second, in C++17, if an unscoped enumeration has a specified base, then the compiler will allow you to initialize (but not assign) an unscoped enumeration using an integral value:

```cpp
#include <iostream>

enum Pet: int // we've specified a base
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { 2 }; // ok: can initialize with integer
    pet = 3;       // compile error: can not assign with integer

    return 0;
}
```

COPY

## Unscoped enumerator input

Because `Pet` is a program-defined type, the language doesn’t know how to input a Pet using `std::cin`:

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { pig };
    std::cin >> pet; // compile error, std::cin doesn't know how to input a Pet

    return 0;
}
```

COPY

To work around this, we can read in an integer, and use `static_cast` to convert the integer to an enumerator of the appropriate enumerated type:

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";

    int input{};
    std::cin >> input; // input an integer

    Pet pet{ static_cast<Pet>(input) }; // static_cast our integer to a Pet

    return 0;
}
```

COPY

!!! info "扩展阅读"

    Similar to how we were able to teach `operator<<` to output an enum type above, we can also teach `operator>>` how to input an enum type:

	```cpp
	#include <iostream>
	
	enum Pet
	{
	    cat, // assigned 0
	    dog, // assigned 1
	    pig, // assigned 2
	    whale, // assigned 3
	};
	
	// Consider this magic for now
	// We pass pet by reference so we can have the function modify its value
	std::istream& operator>> (std::istream& in, Pet &pet)
	{
	    int input{};
	    in >> input; // input an integer
	
	    pet = static_cast<Pet>(input);
	    return in;
	}
	
	int main()
	{
	    std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";
	
	    Pet pet{};
	    std::cin >> pet; // input our pet using std::cin
	
	    std::cout << pet << '\n'; // prove that it worked
	
	    return 0;
	}
	```

Again, consider this a bit of magic for now (since we haven’t explained the concepts behind it yet), but you might find it handy.