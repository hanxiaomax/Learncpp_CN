---
title: 18.9 - 对象切片
alias: 18.9 - 对象切片
origin: /object-slicing/
origin_title: "18.9 — Object slicing"
time: 2022-9-30
type: translation
tags:
- virtual-base-classes
---

??? note "关键点速记"

	- [[pass-by-value|按值传递]]对象时，如果形参是基类，实参是派生类，则会被切片，导致派生类中虚函数无法调用。最保险的是[[pass-by-reference|按引用传递]]，此时即使转换成了基类的引用，也是不妨碍虚函数工作。

让我们回到我们之前的一个例子:

```cpp
#include <iostream>

class Base
{
protected:
    int m_value{};

public:
    Base(int value)
        : m_value{ value }
    {
    }

    virtual const char* getName() const { return "Base"; }
    int getValue() const { return m_value; }
};

class Derived: public Base
{
public:
    Derived(int value)
        : Base{ value }
    {
    }

    const char* getName() const override { return "Derived"; }
};

int main()
{
    Derived derived{ 5 };
    std::cout << "derived is a " << derived.getName() << " and has value " << derived.getValue() << '\n';

    Base& ref{ derived };
    std::cout << "ref is a " << ref.getName() << " and has value " << ref.getValue() << '\n';

    Base* ptr{ &derived };
    std::cout << "ptr is a " << ptr->getName() << " and has value " << ptr->getValue() << '\n';

    return 0;
}
```

在上面的例子中，`ref`引用和`ptr`指向 `derived`，它有一个 `Base` 部分和一个 `derived` 部分。因为`ref`和`ptr`是`Base`类型，所以`ref`和`ptr`只能看到 `derived` 的 `Base` 部分——`derived` 的 `derived` 部分仍然存在，但不能通过 `ref` 或 `ptr` 看到。但是，通过使用虚函数，我们可以访问函数的最后派生的版本。因此，上面的程序输出:

```
derived is a Derived and has value 5
ref is a Derived and has value 5
ptr is a Derived and has value 5
```

但是，如果`Base`不引用或指针指向 `Derived` 对象，而是简单地将 `Derived` 对象**赋值**给`Base`对象，会发生什么情况呢?

```cpp
int main()
{
    Derived derived{ 5 };
    Base base{ derived }; // what happens here?
    std::cout << "base is a " << base.getName() << " and has value " << base.getValue() << '\n';

    return 0;
}
```

`derived`包含一个`Base`部分和`Derived`部分。当将`Derived`对象赋值给`Base`对象时，只会复制派生对象中的`Base`部分，而`Derived`则不会被赋值。在上面的例子中，`base`接收了`derived`的`base`部分的副本，但不会获取`derived`部分的副本，也就是说`Derived`部分实际上已经被“切掉了”。因此，将派生类对象赋值给基类对象称为[[object-slicing|对象切片]](或简称切片)。

因为`base`变量没有`Derived`部分，`base.getName()`只能解析为`base::getName()`。

上面的程序打印出：

```
base is a Base and has value 5
```

使用得当的话，对象切片是很有用的。然而，如果使用不当，切片会以不同的方式导致意想不到的结果。让我们来看看其中的一些案例。


## 切片和函数

现在，你可能会认为上面的例子有点傻。毕竟，为什么要这样把 `derived` 赋值给 `base` 呢？一般很少会这么做。但是，对于函数来说，对象切片是可能在不经意间发生的。

考虑下面的函数：

```cpp
void printName(const Base base) // 注意: base 按值传递，而不是引用
{
    std::cout << "I am a " << base.getName() << '\n';
}
```

这是一个非常简单的函数，带有一个[[pass-by-value|按值传递]]的`const base`对象形参。如果我们像这样调用这个函数：

```cpp
int main()
{
    Derived d{ 5 };
    printName(d); // oops, 没有意识到在实际调用时是按值传递的

    return 0;
}
```

在编写这个程序时，您可能没有注意到`base`是一个值形参，而不是引用。因此，当`printName(d)`调用时，虽然我们可能期望`base.getName()`调用虚函数`getName()`并打印“I am a Derived”，但实际上并不是。相反，`Derived`对象`d`被切片，只有`Base`部分被复制到`base`参数中。当`base.getName()`执行时，即使对`getName()`函数进行了虚化，也没有类的`Derived`部分供它解析。因此，这个程序输出：

```cpp
I am a Base
```

这里可以明显看到问题，但如果函数没有像这样实际打印任何信息，那么该问题会非常难以定位。

当然，==通过将函数形参作为引用而不是按值传递，就可以避免切片(这也是为什么按引用而不是按值传递类是一个好主意的另一个原因)。==

```cpp
void printName(const Base& base) // note: base now passed by reference
{
    std::cout << "I am a " << base.getName() << '\n';
}

int main()
{
    Derived d{ 5 };
    printName(d);

    return 0;
}
```

COPY

This prints:

```
I am a Derived
```

## vector 切片

新程序员时常在使用`std::vector`实现多态时遇到问题。考虑下面的程序：

```cpp
#include <vector>

int main()
{
	std::vector<Base> v{};
	v.push_back(Base{ 5 }); // 添加一个 Base 对象到 vector
	v.push_back(Derived{ 6 }); // 添加一个 Derived 对象到 vector 

        // 打印 vector 中的所有元素
	for (const auto& element : v)
		std::cout << "I am a " << element.getName() << " with value " << element.getValue() << '\n';

	return 0;
}
```

编译运行程序，输出：

```
I am a Base with value 5
I am a Base with value 6
```

和之前的例子类似，因为 `std::vector` 被声明为了 `Base` 类型的容器，当添加 Derived(6) 时，它被切片了。

修复这个问题有点麻烦。许多新程序员最先想到创建一个类型为基类引用的 `std::vector` ，像这样：

```cpp
std::vector<Base&> v{};
```

可惜，上面的代码根本就不能编译。`std::vector` 中的对象是必须 be assignable, whereas references can’t be reassigned (only initialized).

One way to address this is to make a vector of pointers:

```cpp
#include <iostream>
#include <vector>

int main()
{
	std::vector<Base*> v{};

	Base b{ 5 }; // b and d can't be anonymous objects
	Derived d{ 6 };

	v.push_back(&b); // add a Base object to our vector
	v.push_back(&d); // add a Derived object to our vector

	// Print out all of the elements in our vector
	for (const auto* element : v)
		std::cout << "I am a " << element->getName() << " with value " << element->getValue() << '\n';

	return 0;
}
```

COPY

This prints:

```
I am a Base with value 5
I am a Derived with value 6
```

which works! A few comments about this. First, nullptr is now a valid option, which may or may not be desirable. Second, you now have to deal with pointer semantics, which can be awkward. But on the upside, this also allows the possibility of dynamic memory allocation, which is useful if your objects might otherwise go out of scope.

Another option is to use std::reference_wrapper, which is a class that mimics an reassignable reference:

```cpp
#include <functional> // for std::reference_wrapper
#include <iostream>
#include <vector>

class Base
{
protected:
    int m_value{};

public:
    Base(int value)
        : m_value{ value }
    {
    }

    virtual const char* getName() const { return "Base"; }
    int getValue() const { return m_value; }
};

class Derived : public Base
{
public:
    Derived(int value)
        : Base{ value }
    {
    }

    const char* getName() const override { return "Derived"; }
};

int main()
{
	std::vector<std::reference_wrapper<Base>> v{}; // a vector of reassignable references to Base

	Base b{ 5 }; // b and d can't be anonymous objects
	Derived d{ 6 };

	v.push_back(b); // add a Base object to our vector
	v.push_back(d); // add a Derived object to our vector

	// Print out all of the elements in our vector
	// we use .get() to get our element out of the std::reference_wrapper
	for (const auto& element : v) // element has type const std::reference_wrapper<Base>&
		std::cout << "I am a " << element.get().getName() << " with value " << element.get().getValue() << '\n';

	return 0;
}
```

COPY

## 畸形对象 Frankenobject

In the above examples, we’ve seen cases where slicing lead to the wrong result because the derived class had been sliced off. Now let’s take a look at another dangerous case where the derived object still exists!

Consider the following code:

```cpp
int main()
{
    Derived d1{ 5 };
    Derived d2{ 6 };
    Base& b{ d2 };

    b = d1; // this line is problematic

    return 0;
}
```

函数的前三行非常简单。创建两个Derived对象，并对第二个对象设置Base引用。

第四行是出错的地方。因为b指向d2，我们把d1赋值给b，你可能认为结果是d1会被复制到d2中，如果b是派生的。但是b是Base, c++为类提供的操作符=在默认情况下不是虚的。因此，只有d1的Base部分被复制到d2中。

结果，你会发现d2现在有d1的基部分和d2的派生部分。在这个特定的例子中，这不是问题(因为Derived类本身没有数据)，但是在大多数情况下，您只需要创建一个Frankenobject——由多个对象的部分组成。更糟糕的是，没有什么简单的方法可以避免这种情况的发生(除了尽可能避免这样的任务)。


The first three lines in the function are pretty straightforward. Create two Derived objects, and set a Base reference to the second one.

The fourth line is where things go astray. Since b points at d2, and we’re assigning d1 to b, you might think that the result would be that d1 would get copied into d2 -- and it would, if b were a Derived. But b is a Base, and the operator= that C++ provides for classes isn’t virtual by default. Consequently, only the Base portion of d1 is copied into d2.

As a result, you’ll discover that d2 now has the Base portion of d1 and the Derived portion of d2. In this particular example, that’s not a problem (because the Derived class has no data of its own), but in most cases, you’ll have just created a Frankenobject -- composed of parts of multiple objects. Worse, there’s no easy way to prevent this from happening (other than avoiding assignments like this as much as possible).

## 结论

Although C++ supports assigning derived objects to base objects via object slicing, in general, this is likely to cause nothing but headaches, and you should generally try to avoid slicing. Make sure your function parameters are references (or pointers) and try to avoid any kind of pass-by-value when it comes to derived classes.
