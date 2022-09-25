---
title: 14.x - 小结与测试
alias: 14.x - 小结与测试
origin: /chapter-14-comprehensive-quiz/
origin_title: "14.x — Chapter 14 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---

Operator overloading is a variant of function overloading that lets you overload operators for your classes. When operators are overloaded, the intent of the operators should be kept as close to the original intent of the operators as possible. If the meaning of an operator when applied to a custom class is not clear and intuitive, use a named function instead.

Operators can be overloaded as a normal function, a friend function, or a member function. The following rules of thumb can help you determine which form is best for a given situation:

-   If you’re overloading assignment (=), subscript ([]), function call (()), or member selection (->), do so as a member function.
-   If you’re overloading a unary operator, do so as a member function.
-   If you’re overloading a binary operator that modifies its left operand (e.g. operator+=), do so as a member function if you can.
-   If you’re overloading a binary operator that does not modify its left operand (e.g. operator+), do so as a normal function or friend function.

Typecasts can be overloaded to provide conversion functions, which can be used to explicitly or implicitly convert your class into another type.

A copy constructor is a special type of constructor used to initialize an object from another object of the same type. Copy constructors are used for direct/uniform initialization from an object of the same type, copy initialization (Fraction f = Fraction(5,3)), and when passing or returning a parameter by value.

If you do not supply a copy constructor, the compiler will create one for you. Compiler-provided copy constructors will use memberwise initialization, meaning each member of the copy is initialized from the original member. The copy constructor may be elided for optimization purposes, even if it has side-effects, so do not rely on your copy constructor actually executing.

Constructors are considered converting constructors by default, meaning that the compiler will use them to implicitly convert objects of other types into objects of your class. You can avoid this by using the explicit keyword in front of your constructor. You can also delete functions within your class, including the copy constructor and overloaded assignment operator if desired. This will cause a compiler error if a deleted function would be called.

The assignment operator can be overloaded to allow assignment to your class. If you do not provide an overloaded assignment operator, the compiler will create one for you. Overloaded assignment operators should always include a self-assignment check (unless it’s handled naturally, or you’re using the copy and swap idiom).

New programmers often mix up when the assignment operator vs copy constructor are used, but it’s fairly straightforward:

-   If a new object has to be created before the copying can occur, the copy constructor is used (note: this includes passing or returning objects by value).
-   If a new object does not have to be created before the copying can occur, the assignment operator is used.

By default, the copy constructor and assignment operators provided by the compiler do a memberwise initialization or assignment, which is a shallow copy. If your class dynamically allocates memory, this will likely lead to problems, as multiple objects will end up pointing to the same allocated memory. In this case, you’ll need to explicitly define these in order to do a deep copy. Even better, avoid doing your own memory management if you can and use classes from the standard library.