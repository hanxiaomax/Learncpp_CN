---
title: 13.x - 小结与测试
alias: 13.x - 小结与测试
origin: /chapter-11-comprehensive-quiz/
origin_title: "13.x — Chapter 13 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---
Classes allow you to create your own data types that bundle both data and functions that work on that data. Data and functions inside the class are called members. Members of the class are selected by using the . operator (or -> if you’re accessing the member through a pointer).

Access specifiers allow you to specify who can access the members of a class. Public members can be accessed directly by anybody. Private members can only be accessed by other members of the class. We’ll cover protected members later, when we get to inheritance. By default, all members of a class are private and all members of a struct are public.

Encapsulation is the process of making all of your member data private, so it can not be accessed directly. This helps protect your class from misuse.

Constructors are a special type of member function that allow you to initialize objects of your class. A constructor that takes no parameters (or has all default parameters) is called a default constructor. The default constructor is used if no initialization values are provided by the user. You should always provide at least one constructor for your classes.

Member initializer lists allows you to initialize your member variables from within a constructor (rather than assigning the member variables values).

Non-static member initialization allows you to directly specify default values for member variables when they are declared.

Constructors are allowed to call other constructors (called delegating constructors, or constructor chaining).

Destructors are another type of special member function that allow your class to clean up after itself. Any kind of deallocation or shutdown routines should be executed from here.

All member functions have a hidden *this pointer that points at the class object being modified. Most of the time you will not need to access this pointer directly. But you can if you need to.

It is good programming style to put your class definitions in a header file of the same name as the class, and define your class functions in a .cpp file of the same name as the class. This also helps avoid circular dependencies.

Member functions can (and should) be made const if they do not modify the state of the class. Const class objects can only call const member functions.

Static member variables are shared among all objects of the class. Although they can be accessed from a class object, they can also be accessed directly via the scope resolution operator.

Similarly, static member functions are member functions that have no *this pointer. They can only access static member variables.

Friend functions are functions that are treated like member functions of the class (and thus can access a class’s private data directly). Friend classes are classes where all members of the class are considered friend functions.

It’s possible to create anonymous class objects for the purpose of evaluation in an expression, or passing or returning a value.

You can also nest types within a class. This is often used with enums related to the class, but can be done with other types (including other classes) if desired.