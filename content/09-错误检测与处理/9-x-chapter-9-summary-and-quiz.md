---
title: 9-x-chapter-9-summary-and-quiz
aliases: 9-x-chapter-9-summary-and-quiz
origin: 
origin_title: 9-x-chapter-9-summary-and-quiz
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 9.x — Chapter 9 summary and quiz

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

December 28, 2023, 2:45 pm PST
December 1, 2024

Chapter Review

**Scope creep** occurs when a project’s capabilities grow beyond what was originally intended at the start of the project or project phase.

**Software verification** is the process of testing whether or not the software works as expected in all cases. A **unit test** is a test designed to test a small portion of the code (typically a function or call) in isolation to ensure a particular behavior occurs as expected. **Unit test frameworks** can help you organize your unit tests. **Integration testing** tests the integration of a bunch of units together to ensure they work properly.

**Code coverage** refers to how much of the source code is executed while testing. **Statement coverage** refers to the percentage of statements in a program that have been exercised by testing routines. **Branch coverage** refers to the percentage of branches that have been executed by testing routines. **Loop coverage** (also called the **0, 1, 2 test**) means that if you have a loop, you should ensure it works properly when it iterates 0 times, 1 time, and 2 times.

The **happy path** is the path of execution that occurs when there are no errors encountered. A **sad path** is one where an error or failure state occurs. A **non-recoverable error** (also called a **fatal error**) is an error that is severe enough that the program can’t continue running. A program that handles error cases well is **robust**.

A **buffer** is a piece of memory set aside for storing data temporarily while it is moved from one place to another.

The process of checking whether user input conforms to what the program is expecting is called **input validation**.

**std::cerr** is an output stream (like `std::cout`) designed to be used for error messages.

A **precondition** is any condition that must always be true prior to the execution of some segment of code. An **invariant** is a condition that must be true while some component is executing. A **postcondition** is any condition that must always be true after the execution of some code.

An **assertion** is an expression that will be true unless there is a bug in the program. In C++, runtime assertions are typically implemented using the **assert** preprocessor macro. Assertions are usually turned off in non-debug code. A **static_assert** is an assertion that is evaluated at compile-time.

Assertions should be used to document cases that should be logically impossible. Error handling should be used to handle cases that are possible.

Quiz time

Question #1

In a quiz for lesson [8.x -- Chapter 8 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-8-summary-and-quiz/), we implemented a game of Hi-Lo.

Update your previous solution to handle invalid guesses (e.g. ‘x’), out of bounds guesses (e.g. `0` or `101`), or valid guesses that have extraneous characters (e.g. `43x`). Also handle the user entering extra characters when the game asks them whether they want to play again.

Hint: Write a separate function to handle the user inputting their guess (along with the associated error handling).

\[Show Solution\](javascript:void(0))

```cpp
#include <iostream>
#include <limits>   // for std::numeric_limits
#include "Random.h" // https://www.learncpp.com/cpp-tutorial/global-random-numbers-random-h/

int getGuess(int count, int min, int max)
{
	while (true) // loop until user enters valid input
	{
		std::cout << "Guess #" << count << ": ";

		int guess {};
		std::cin >> guess;

		bool success { std::cin };
		std::cin.clear(); // put us back in 'normal' operation mode (if needed)
		std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // remove any extra input

		// If we didn't extract anything or the extracted guess is out of bounds, try again
		if (!success || guess < min || guess > max)
			continue;

		return guess;
	}
}

// returns true if the user won, false if they lost
bool playHiLo(int guesses, int min, int max)
{
	std::cout << "Let's play a game. I'm thinking of a number between " << min << " and " << max << ". You have " << guesses << " tries to guess what it is.\n";
	int number{ Random::get(min, max) }; // this is the number the user needs to guess

	// Loop through all of the guesses
	for (int count{ 1 }; count <= guesses; ++count)
	{
		int guess{ getGuess(count, min, max) };

		if (guess > number)
			std::cout << "Your guess is too high.\n";
		else if (guess < number)
			std::cout << "Your guess is too low.\n";
		else // guess == number, so the user won
		{
			std::cout << "Correct! You win!\n";
			return true;
		}
	}

	// The user lost
	std::cout << "Sorry, you lose. The correct number was " << number << '\n';
	return false; // if the user lost
}

bool playAgain()
{
	// Keep asking the user if they want to play again until they pick y or n.
	while (true)
	{
		char ch{};
		std::cout << "Would you like to play again (y/n)? ";
		std::cin >> ch;

		// clear out any extraneous input
		std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        
		switch (ch)
		{
		case 'y': return true;
		case 'n': return false;
		}
	}
}

int main()
{
	constexpr int guesses { 7 }; // the user has this many guesses
	constexpr int min     { 1 };
	constexpr int max     { 100 };

	do
	{
		playHiLo(guesses, min, max);
	} while (playAgain());

	std::cout << "Thank you for playing.\n";

	return 0;
}
```

\[Next lesson

10.1Implicit type conversion\](https://www.learncpp.com/cpp-tutorial/implicit-type-conversion/)
[Back to table of contents](/)
\[Previous lesson

9.6Assert and static_assert\](https://www.learncpp.com/cpp-tutorial/assert-and-static_assert/)

*Previous Post*[5.6 — Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)

*Next Post*[8.15 — Global random numbers (Random.h)](https://www.learncpp.com/cpp-tutorial/global-random-numbers-random-h/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
