---
title: 8-15-global-random-numbers-random-h
aliases: 8-15-global-random-numbers-random-h
origin: 
origin_title: 8-15-global-random-numbers-random-h
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 8.15 — Global random numbers (Random.h)

What happens if we want to use a random number generator in multiple functions or files? One way is to create (and seed) our PRNG in our `main()` function, and then pass it everywhere we need it. But that’s a lot of passing for something we may only use sporadically, and in many different places. It would add a lot of clutter to our code to pass such an object around.

Alternately, you could create a static local `std::mt19937` variable in each function that needs it (static so that it only gets seeded once). However, it’s overkill to have every function that uses a random number generator define and seed its own local generator, and the low volume of calls to each generator may lead to lower quality results.

What we really want is a single PRNG object that we can share and access anywhere, across all of our functions and files. The best option here is to create a global random number generator object (inside a namespace!). Remember how we told you to avoid non-const global variables? This is an exception.

Here’s a simple, header-only solution that you can #include in any code file that needs access to a randomized, self-seeded `std::mt19937`:

Random.h:

```cpp
#ifndef RANDOM_MT_H
#define RANDOM_MT_H

#include <chrono>
#include <random>

// This header-only Random namespace implements a self-seeding Mersenne Twister.
// Requires C++17 or newer.
// It can be #included into as many code files as needed (The inline keyword avoids ODR violations)
// Freely redistributable, courtesy of learncpp.com (https://www.learncpp.com/cpp-tutorial/global-random-numbers-random-h/)
namespace Random
{
	// Returns a seeded Mersenne Twister
	// Note: we'd prefer to return a std::seed_seq (to initialize a std::mt19937), but std::seed can't be copied, so it can't be returned by value.
	// Instead, we'll create a std::mt19937, seed it, and then return the std::mt19937 (which can be copied).
	inline std::mt19937 generate()
	{
		std::random_device rd{};

		// Create seed_seq with clock and 7 random numbers from std::random_device
		std::seed_seq ss{
			static_cast<std::seed_seq::result_type>(std::chrono::steady_clock::now().time_since_epoch().count()),
				rd(), rd(), rd(), rd(), rd(), rd(), rd() };

		return std::mt19937{ ss };
	}

	// Here's our global std::mt19937 object.
	// The inline keyword means we only have one global instance for our whole program.
	inline std::mt19937 mt{ generate() }; // generates a seeded std::mt19937 and copies it into our global object

	// Generate a random int between [min, max] (inclusive)
        // * also handles cases where the two arguments have different types but can be converted to int
	inline int get(int min, int max)
	{
		return std::uniform_int_distribution{min, max}(mt);
	}

	// The following function templates can be used to generate random numbers in other cases

	// See https://www.learncpp.com/cpp-tutorial/function-template-instantiation/
	// You can ignore these if you don't understand them

	// Generate a random value between [min, max] (inclusive)
	// * min and max must have the same type
	// * return value has same type as min and max
	// * Supported types:
	// *    short, int, long, long long
	// *    unsigned short, unsigned int, unsigned long, or unsigned long long
	// Sample call: Random::get(1L, 6L);             // returns long
	// Sample call: Random::get(1u, 6u);             // returns unsigned int
	template <typename T>
	T get(T min, T max)
	{
		return std::uniform_int_distribution<T>{min, max}(mt);
	}

	// Generate a random value between [min, max] (inclusive)
	// * min and max can have different types
        // * return type must be explicitly specified as a template argument
	// * min and max will be converted to the return type
	// Sample call: Random::get<std::size_t>(0, 6);  // returns std::size_t
	// Sample call: Random::get<std::size_t>(0, 6u); // returns std::size_t
	// Sample call: Random::get<std::int>(0, 6u);    // returns int
	template <typename R, typename S, typename T>
	R get(S min, T max)
	{
		return get<R>(static_cast<R>(min), static_cast<R>(max));
	}
}

#endif
```

Using Random.h

Generating random numbers using the above is as simple as following these three steps:

1. Copy/paste the above code into a file named `Random.h` in your project directory and save it. Optionally add Random.h to your project.
1. `#include "Random.h"` from any .cpp file in your project that needs to generate random numbers.
1. Call `Random::get(min, max)` to generate a random number between `min` and `max` (inclusive). No initialization or setup is required.

Here is a sample program demonstrating different uses of Random.h:

main.cpp:

```cpp
#include "Random.h" // defines Random::mt, Random::get(), and Random::generate()
#include <cstddef> // for std::size_t
#include <iostream>

int main()
{
	// We can call Random::get() to generate random integral values
	// If the two arguments have the same type, the returned value will have that same type.
	std::cout << Random::get(1, 6) << '\n';   // returns int between 1 and 6
	std::cout << Random::get(1u, 6u) << '\n'; // returns unsigned int between 1 and 6

        // In cases where we have two arguments with different types
        // and/or if we want the return type to be different than the argument types
        // We must specify the return type using a template type argument (between the angled brackets)
	// See https://www.learncpp.com/cpp-tutorial/function-template-instantiation/
	std::cout << Random::get<std::size_t>(1, 6u) << '\n'; // returns std::size_t between 1 and 6

	// If we have our own distribution, we can access Random::mt directly

	// Let's create a reusable random number generator that generates uniform numbers between 1 and 6
	std::uniform_int_distribution die6{ 1, 6 }; // for C++14, use std::uniform_int_distribution<> die6{ 1, 6 };
	for (int count{ 1 }; count <= 10; ++count)
	{
		std::cout << die6(Random::mt) << '\t'; // generate a roll of the die here
	}

	std::cout << '\n';

	return 0;
}
```

A few notes about the implementation of Random.h Optional

Normally, defining variables and functions in a header file would cause violations of the one-definition rule (ODR) when that header file was included into more than one source file. However, we’ve made our `mt` variable and supporting functions `inline`, which allows us to have duplicate definitions without violating the ODR so long as those definitions are all identical. Because we’re #including those definitions from a header file (rather than typing them manually, or copy/pasting them), we can ensure they are identical. Inline functions and variables were added to the language largely to make doing this kind of header-only functionality possible.

Related content

We cover inline functions and variables in lesson [7.9 -- Inline functions and variables](https://www.learncpp.com/cpp-tutorial/inline-functions-and-variables/).

The other challenge that we have to overcome is in how we initialize our global `Random::mt` object, as we want it to be self-seeding so that we don’t have to remember to explicitly call an initialization function for it to work correctly. Our initializer must be an expression. But in order to initialize a `std::mt19937`, we need several helper objects (a `std::random_device` and a `std::seed_seq`) which must be defined as statements. This is where a helper function comes in handy. A function call is an expression, so we can use the return value of a function as an initializer. And inside the function itself, we can have any combination of statements that we need. Thus, our `generate()` function creates and returns a fully-seeded `std::mt19937` object (seeded using both the system clock and `std::random_device`) that we use as the initializer to our global `Random::mt` object.