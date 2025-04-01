---
title: F.X-chapter-f-summary-and-quiz
aliases: F.X-chapter-f-summary-and-quiz
origin: 
origin_title: F-5-chapter-f-summary-and-quiz
time: 2025-04-01 
type: translation-under-construction
tags:
---
# F.X — Chapter F summary and quiz

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

December 2, 2024, 11:32 am PST
December 2, 2024

A **constexpr** function is a function that is allowed to be called in a constant expression. To make a function a constexpr function, we simply use the `constexpr` keyword in front of the return type. Constexpr functions are only guaranteed to be evaluated at compile-time when used in a context that requires a constant expression. Otherwise they may be evaluated at compile-time (if eligible) or runtime. Constexpr functions are implicitly inline, and the compiler must see the full definition of the constexpr function to call it at compile-time.

A **consteval function** is a function that must evaluate at compile-time. Consteval functions otherwise follow the same rules as constexpr functions.

Quiz time

Question #1

Add `const` and/or `constexpr` to the following program:

```cpp
#include <iostream>

// gets tower height from user and returns it
double getTowerHeight()
{
	std::cout << "Enter the height of the tower in meters: ";
	double towerHeight{};
	std::cin >> towerHeight;
	return towerHeight;
}

// Returns ball height from ground after "seconds" seconds
double calculateBallHeight(double towerHeight, int seconds)
{
	double gravity{ 9.8 };

	// Using formula: [ s = u * t + (a * t^2) / 2 ], here u(initial velocity) = 0
	double distanceFallen{ (gravity * (seconds * seconds)) / 2.0 };
	double currentHeight{ towerHeight - distanceFallen };

	return currentHeight;
}

// Prints ball height above ground
void printBallHeight(double ballHeight, int seconds)
{
	if (ballHeight > 0.0)
		std::cout << "At " << seconds << " seconds, the ball is at height: " << ballHeight << " meters\n";
	else
		std::cout << "At " << seconds << " seconds, the ball is on the ground.\n";
}

// Calculates the current ball height and then prints it
// This is a helper function to make it easier to do this
void printCalculatedBallHeight(double towerHeight, int seconds)
{
	double ballHeight{ calculateBallHeight(towerHeight, seconds) };
	printBallHeight(ballHeight, seconds);
}

int main()
{
	double towerHeight{ getTowerHeight() };

	printCalculatedBallHeight(towerHeight, 0);
	printCalculatedBallHeight(towerHeight, 1);
	printCalculatedBallHeight(towerHeight, 2);
	printCalculatedBallHeight(towerHeight, 3);
	printCalculatedBallHeight(towerHeight, 4);
	printCalculatedBallHeight(towerHeight, 5);

	return 0;
}
```

\[Show Solution\](javascript:void(0))

```cpp
#include <iostream>

// This function should not be made constexpr because output and input can only be done at runtime.
// The versions of `operator<<` and `operator>>` that do output and input don't support constexpr.
double getTowerHeight()
{
	std::cout << "Enter the height of the tower in meters: ";
	double towerHeight{};
	std::cin >> towerHeight;
	return towerHeight;
}

// Returns height from ground after "seconds" seconds
// This function is made constepxr because it just calculates a value from its inputs and return it.
// Arithmetic can be done at compile-time, and no non-constexpr functions are called.
// Reminder: A constexpr function can be evaluated at compile-time or runtime.
//   If its arguments are constexpr, it can be called at compile-time.
//   In this case, it's called at runtime because the argument for towerHeight isn't constexpr.
// If a function can be made constexpr, it should be.
// Remember: function parameters are not constexpr, even in a constexpr function
constexpr double calculateBallHeight(double towerHeight, int seconds)
{
	constexpr double gravity{ 9.8 }; // constexpr because it's a compile-time constant

	// Using formula: [ s = u * t + (a * t^2) / 2 ], here u(initial velocity) = 0
	// These variables can't be constexpr since their initializers aren't constant expressions
	const double distanceFallen{ (gravity * (seconds * seconds)) / 2.0 };
	const double currentHeight{ towerHeight - distanceFallen };

	return currentHeight;
}

// This function should not be made constexpr because output and input can only be done at runtime.
// The versions of `operator<<` and `operator>>` that do output and input don't support constexpr.
void printBallHeight(double ballHeight, int seconds)
{
	if (ballHeight > 0.0)
		std::cout << "At " << seconds << " seconds, the ball is at height: " << ballHeight << " meters\n";
	else
		std::cout << "At " << seconds << " seconds, the ball is on the ground.\n";
}

// This function should not be made constexpr because output and input can only be done at runtime.
// The versions of `operator<<` and `operator>>` that do output and input don't support constexpr.
void printCalculatedBallHeight(double towerHeight, int seconds)
{
	// height can only be const (not constexpr) because its initializer is not a constant expression
	const double ballHeight{ calculateBallHeight(towerHeight, seconds) };
	printBallHeight(ballHeight, seconds);
}

int main()
{
	// towerHeight can only be const (not constexpr) because its initializer is not a constant expression
	const double towerHeight{ getTowerHeight() };

	printCalculatedBallHeight(towerHeight, 0);
	printCalculatedBallHeight(towerHeight, 1);
	printCalculatedBallHeight(towerHeight, 2);
	printCalculatedBallHeight(towerHeight, 3);
	printCalculatedBallHeight(towerHeight, 4);
	printCalculatedBallHeight(towerHeight, 5);

	return 0;
}
```

\[Next lesson

12.1Introduction to compound data types\](https://www.learncpp.com/cpp-tutorial/introduction-to-compound-data-types/)
[Back to table of contents](/)
\[Previous lesson

F.4Constexpr functions (part 4)\](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-4/)

*Previous Post*[F.4 — Constexpr functions (part 4)](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-4/)

*Next Post*

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
