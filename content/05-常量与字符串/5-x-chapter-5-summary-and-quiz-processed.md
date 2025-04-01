---
title: 5-x-chapter-5-summary-and-quiz-processed
aliases: 5-x-chapter-5-summary-and-quiz-processed
origin: 
origin_title: 5-x-chapter-5-summary-and-quiz-processed
time: 2025-04-01 
type: translation-under-construction
tags:
---
## 测试时间
> 

> [!question] 问题 #1
> 
> Why are named constants often a better choice than literal constants?
> 
> 
> > [!note]- 答案
> > 
> > Using literal constants (a.k.a. magic numbers) in your program makes your program harder to understand and harder to modify. Symbolic constants help document what the numbers actually represent, and changing a symbolic constant at its declaration changes the value everywhere it is used.
> > 
> > Why are const/constexpr variables usually a better choice than #defined symbolic constants?
> > 
> 
> > [!note]- 答案
> > 
> > #define constants do not show up in the debugger and are more likely to have naming conflicts.
> > 

> [!question] 问题 #2
> 
> Find 3 issues in the following code:
> 
> ```cpp
> #include <cstdint> // for std::uint8_t
> #include <iostream>
> 
> int main()
> {
>   std::cout << "How old are you?\n";
> 
>   std::uint8_t age{};
>   std::cin >> age;
> 
>   std::cout << "Allowed to drive a car in Texas: ";
> 
>   if (age >= 16)
>       std::cout << "Yes";
>   else
>       std::cout << "No";
> 
>   std::cout << '.\n';
> 
>   return 0;
> }
> ```
> 
> Sample desired output:
> 
> ```cpp
> How old are you?
> 6
> Allowed to drive a car in Texas: No
> 
> ```
> 
> ```cpp
> How old are you?
> 19
> Allowed to drive a car in Texas: Yes
> 
> ```
> 
> 
> > [!note]- 答案
> > 
> > 1. On line 8, `age` is defined as a `std::uint8_t`. Because `std::uint8_t` is typically defined as a char type, using it here will cause the program to behave as if we’re inputting and outputting a char value rather than a numeric value. For example, if the user entered their age as “18”, only the character `'1'` would be extracted. Because `1` has ASCII value `49`, the user would be treated as if they were 49 years old. A regular `int` should be used to store the age, as the age doesn’t require a specific minimum integer width. We can also remove `#include <cstdint>`.
> > 1. On line 13, we use the magic number `16`. Although the meaning of `16` is clear from the context it is used in, using a `constexpr` variable with the value `16` should be preferred instead.
> > 1. On line 18, `'.\n'` is a multicharacter literal that will print the wrong value. It should be double-quoted (`".\n"`).
> > 

> [!question] 问题 #3
> 
> What are the primary differences between `std::string` and `std::string_view`?
> 
> What can go wrong when using a `std::string_view`?
> 
> 
> > [!note]- 答案
> > 
> > `std::string` provides a modifiable string. It is expensive to initialize and copy.
> > 
> > `std::string_view` provide a read-only view of a string that exists elsewhere. It is inexpensive to initialize and copy. `std::string_view` can be dangerous when the string being viewed is destroyed before the `std::string_view` that is viewing it.
> > 

> [!question] 问题 #4
> 
> Write a program that asks for the name and age of two people, then prints which person is older.
> 
> Here is the sample output from one run of the program:
> 
> ```cpp
> Enter the name of person #1: John Bacon
> Enter the age of John Bacon: 37
> Enter the name of person #2: David Jenkins
> Enter the age of David Jenkins: 44
> David Jenkins (age 44) is older than John Bacon (age 37).
> 
> ```
> 
> 
> > [!hint]- 提示
> > 
> > Hint: Input the person’s name using `std::getline()`
> > 
> 
> > [!note]- 答案
> > 
> > ```cpp
> > #include <iostream>
> > #include <string>
> > #include <string_view>
> > 
> > std::string getName(int num)
> > {
> >     std::cout << "Enter the name of person #" << num << ": ";
> >     std::string name{};
> >     std::getline(std::cin >> std::ws, name); // read a full line of text into name
> > 
> >     return name;
> > }
> > 
> > int getAge(std::string_view sv)
> > {
> >     std::cout << "Enter the age of " << sv << ": ";
> >     int age{};
> >     std::cin >> age;
> > 
> >     return age;
> > }
> > 
> > void printOlder(std::string_view name1, int age1, std::string_view name2, int age2)
> > {
> >     if (age1 > age2)
> >         std::cout << name1 << " (age " << age1 <<") is older than " << name2 << " (age " << age2 <<").\n";
> >     else
> >         std::cout << name2 << " (age " << age2 <<") is older than " << name1 << " (age " << age1 <<").\n";
> > }
> > 
> > int main()
> > {
> >     const std::string name1{ getName(1) };
> >     const int age1 { getAge(name1) };
> >     
> >     const std::string name2{ getName(2) };
> >     const int age2 { getAge(name2) };
> > 
> >     printOlder(name1, age1, name2, age2);
> > 
> >     return 0;
> > }
> > ```
> > 

> [!question] 问题 #5
> 
> In the solution to the above quiz, why can’t variable `age1` in `main` be constexpr?
> 
> 
> > [!note]- 答案
> > 
> > A constexpr variable requires a constant expression initializer, and the call to `getAge()` isn’t allowed in a constant expression. Therefore, we can only make the variable const.
> > 
