---
title: 13.16 - 匿名对象
alias: 13.16 - 匿名对象
origin: /anonymous-objects/
origin_title: "13.16 — Anonymous objects"
time: 2022-9-16
type: translation
tags:
- class
- friend
---


In certain cases, we need a variable only temporarily. For example, consider the following situation:

```cpp
#include <iostream>

int add(int x, int y)
{
    int sum{ x + y };
    return sum;
}

int main()
{
    std::cout << add(5, 3) << '\n';

    return 0;
}
```

COPY

In the add() function, note that the sum variable is really only used as a temporary placeholder variable. It doesn’t contribute much -- rather, its only function is to transfer the result of the expression to the return value.

There is actually an easier way to write the add() function using an anonymous object. An **anonymous object** is essentially a value that has no name. Because they have no name, there’s no way to refer to them beyond the point where they are created. Consequently, they have “expression scope”, meaning they are created, evaluated, and destroyed all within a single expression.

Here is the add() function rewritten using an anonymous object:

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y; // an anonymous object is created to hold and return the result of x + y
}

int main()
{
    std::cout << add(5, 3) << '\n';

    return 0;
}
```

COPY

When the expression `x + y` is evaluated, the result is placed in an anonymous object. A copy of the anonymous object is then returned to the caller by value, and the anonymous object is destroyed.

This works not only with return values, but also with function parameters. For example, instead of this:

```cpp
#include <iostream>

void printValue(int value)
{
    std::cout << value;
}

int main()
{
    int sum{ 5 + 3 };
    printValue(sum);

    return 0;
}
```

COPY

We can write this:

```cpp
#include <iostream>

void printValue(int value)
{
    std::cout << value;
}

int main()
{
    printValue(5 + 3);

    return 0;
}
```

COPY

In this case, the expression 5 + 3 is evaluated to produce the result 8, which is placed in an anonymous object. A copy of this anonymous object is then passed to the printValue() function, (which prints the value 8) and then is destroyed.

Note how much cleaner this keeps our code -- we don’t have to litter the code with temporary variables that are only used once.

## 匿名类对象

Although our prior examples have been with built-in data types, it is possible to construct anonymous objects of our own class types as well. This is done by creating objects like normal, but omitting the variable name.

```cpp
Cents cents{ 5 }; // normal variable
Cents{ 7 }; // anonymous object
```

COPY

In the above code, `Cents{ 7 }` will create an anonymous Cents object, initialize it with the value 7, and then destroy it. In this context, that isn’t going to do us much good. So let’s take a look at an example where it can be put to good use:

```cpp
#include <iostream>

class Cents
{
private:
    int m_cents{};

public:
    Cents(int cents)
        : m_cents { cents }
    {}

    int getCents() const { return m_cents; }
};

void print(const Cents& cents)
{
   std::cout << cents.getCents() << " cents\n";
}

int main()
{
    Cents cents{ 6 };
    print(cents);

    return 0;
}
```

COPY

Note that this example is very similar to the prior one using integers. In this case, our main() function is passing a Cents object (named cents) to function print().

We can simplify this program by using anonymous objects:

```cpp
#include <iostream>

class Cents
{
private:
    int m_cents{};

public:
    Cents(int cents)
        : m_cents { cents }
    {}

    int getCents() const { return m_cents; }
};

void print(const Cents& cents)
{
   std::cout << cents.getCents() << " cents\n";
}

int main()
{
    print(Cents{ 6 }); // Note: Now we're passing an anonymous Cents value

    return 0;
}
```

COPY

As you’d expect, this prints:

6 cents

Now let’s take a look at a slightly more complex example:

```cpp
#include <iostream>

class Cents
{
private:
    int m_cents{};

public:
    Cents(int cents)
        : m_cents { cents }
    {}

    int getCents() const { return m_cents; }
};

Cents add(const Cents& c1, const Cents& c2)
{
    Cents sum{ c1.getCents() + c2.getCents() };
    return sum;
}

int main()
{
    Cents cents1{ 6 };
    Cents cents2{ 8 };
    Cents sum{ add(cents1, cents2) };
    std::cout << "I have " << sum.getCents() << " cents.\n";

    return 0;
}
```

COPY

In the above example, we’re using quite a few named Cents values. In the add() function, we have a Cents value named sum that we’re using as an intermediary value to hold the sum before we return it. And in function main(), we have another Cents value named sum also used as an intermediary value.

We can make our program simpler by using anonymous values:

```cpp
#include <iostream>

class Cents
{
private:
    int m_cents{};

public:
    Cents(int cents)
        : m_cents { cents }
    {}

    int getCents() const { return m_cents; }
};

Cents add(const Cents& c1, const Cents& c2)
{
    // List initialization looks at the return type of the function
    // and creates the correct object accordingly.
    return { c1.getCents() + c2.getCents() }; // return anonymous Cents value
}

int main()
{
    Cents cents1{ 6 };
    Cents cents2{ 8 };
    std::cout << "I have " << add(cents1, cents2).getCents() << " cents.\n"; // print anonymous Cents value

    return 0;
}
```

COPY

This version of add() functions identically to the one above, except it uses an anonymous Cents value instead of a named variable. Also note that in main(), we no longer use a named “sum” variable as temporary storage. Instead, we use the return value of add() anonymously!

As a result, our program is shorter, cleaner, and generally easier to follow (once you understand the concept).

In fact, because cents1 and cents2 are only used in one place, we can anonymize this even further:

```cpp
#include <iostream>

class Cents
{
private:
    int m_cents{};

public:
    Cents(int cents)
        : m_cents { cents }
    {}

    int getCents() const { return m_cents; }
};

Cents add(const Cents& c1, const Cents& c2)
{
    return { c1.getCents() + c2.getCents() }; // return anonymous Cents value
}

int main()
{
    std::cout << "I have " << add(Cents{ 6 }, Cents{ 8 }).getCents() << " cents.\n"; // print anonymous Cents value

    return 0;
}
```

COPY

## 小结

In C++, anonymous objects are primarily used either to pass or return values without having to create lots of temporary variables to do so. Memory allocated dynamically is also done so anonymously (which is why its address must be assigned to a pointer, otherwise we’d have no way to refer to it).

It is also worth noting that because anonymous objects have expression scope, they can only be used once (unless bound to a constant l-value reference, which will extend the lifetime of the temporary object to match the lifetime of the reference). If you need to reference a value in multiple expressions, you should use a named variable instead.

