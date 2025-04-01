---
title: 14.13 - 匿名对象
alias: 14.13 - 匿名对象
origin: /anonymous-objects/
origin_title: "13.16 — Anonymous objects"
time: 2022-9-16
type: translation
tags:
- class
- friend
---

在某些情况下，我们只需要一个临时的变量。例如，考虑以下情况:


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



在`add()` 函数中，变量 `sum` 只被当做一个临时的占位符变量来使用。它并没有其他特别的功能——它唯一的功能就是保存表达式的结果并作为返回值返回。

实际上，我们可以通过匿名对象编写一个更加简单的 `add()` 函数。[[anonymous-object|匿名对象]]本质上是一个没有名称的值。因为它们没有名字，所以在它们被创建后，我们没有办法去引用它们。因此，匿名对象只能具有“表达式作用域”，即它们在一个表达式中被创建、求值和销毁。

下面例子中的 `add()` 函数使用了匿名对象：

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


当表达式 `x + y` 求值时，它的结果会被存放到一个匿名对象中。然后，该对象的一个拷贝会被返回给主调函数，然后这个匿名对象就会被销毁。

这不仅适用于返回值，也适用于函数形参。例如，与其这样做：


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

不如这样做：

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

在这个例子中，表达式 `5+3` 被求值为 8 ，然后结果被存放在匿名对象时。这个匿名对象的拷贝随后被传递给 `printValue()` 函数，然后被销毁。

注意，这使我们的代码变得非常简洁——我们不必用只使用一次的临时变量来弄乱代码。


## 匿名类对象

尽管我们前面的例子都是内置数据类型，但是我们也可以构造自定义类型的匿名对象。方法和创建普通对象类似，只需要省略变量名即可。

```cpp
Cents cents{ 5 }; // 普通变量
Cents{ 7 }; // 匿名对象
```

在上面的例子中，`Cents{ 7 }` 会创建一个匿名对象并使用7作为其初始值，然后该对象就被销毁了。在这个例子中，匿名对象看上去没什么用。让我们看另一个例子吧：

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

注意，此示例与前面使用整数的示例非常相似。在本例中，我们的 `main()`函数向`print()`函数传递了一个`Cents`类型的对象(名为cents)。

我们可以通过使用匿名对象来简化这个程序:


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


你可能希望程序打印如下内容：

```
6 cents
```

现在，让我们再看一个更复杂的例子：

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

在上面的例子中，我们使用了很多命名为Cents的值。在`add()` 函数中，我们有一个名为`sum`的`Cents`对象，我们使用它作为中间值，在返回·之前保存它。在函数`main()` 中，我们有另一个名为`sum`的`Cents`对象，也用作中间值。

我们可以通过使用匿名值来简化程序:

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
    // 列表初始化会参考函数返回值的类型
    // 然后创建所需的对象
    return { c1.getCents() + c2.getCents() }; // 返回匿名的 Cents value
}

int main()
{
    Cents cents1{ 6 };
    Cents cents2{ 8 };
    std::cout << "I have " << add(cents1, cents2).getCents() << " cents.\n"; // print anonymous Cents value

    return 0;
}
```

这个版本的`add()` 函数与上面的函数相同，只是它使用了一个匿名的Cents值而不是一个命名变量。还要注意的是，在`main()` 中，我们不再使用命名的`sum`变量作为临时存储。相反，我们会匿名使用 `add()` 的返回值！

因此，我们的程序更短、更清晰，而且通常更容易理解(一旦你理解了这个概念)。

事实上，因为cent1和cent2只在一个地方使用，我们可以进一步匿名化:

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


## 小结

在C++中，匿名对象主要用于传递参数或返回值而不必为此创建大量临时变量。动态分配的内存也是匿名完成的(这就是为什么它的地址必须分配给指针，否则我们就没有办法引用它)。

另外值得注意的是，因为匿名对象具有表达式作用域，所以它们只能使用一次(除非绑定到一个固定的[[lvalue-reference|左值引用]]，这将延长临时对象的生命周期，以匹配引用的生命周期)。如果需要在多个表达式中引用一个值，则应该使用命名变量。