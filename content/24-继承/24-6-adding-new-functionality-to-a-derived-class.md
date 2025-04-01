---
title: 17.6 - 为派生类添加新功能
alias: 17.6 - 为派生类添加新功能
origin: /adding-new-functionality-to-a-derived-class/
origin_title: "17.6 — Adding new functionality to a derived class"
time: 2022-3-24
type: translation
tags:
- inheritance
---




在[[24-1-introduction-to-inheritance|17.1 - 继承简介]]中我们提到，使用派生类最大的好处在于可以重用代码。你可以继承基类的功能并在派生类中添加需要的新功能、修改已经存在的功能或者隐藏你不需要的功能。在接下来的几节课中，我们会详细介绍如何做到这些。

首先编写一个简单的类：
```cpp
#include <iostream>

class Base
{
protected:
    int m_value {};

public:
    Base(int value)
        : m_value { value }
    {
    }

    void identify() const { std::cout << "I am a Base\n"; }
};
```

现在，让我们创建一个继承自`Base`的派生类。因为我们希望派生类能够在派生对象实例化时设置`m_value`的值，所以需要在`Derived`的[[member-initializer-list|成员初始化值列表]]中调用`Base`的构造函数。


```cpp
class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }
};
```

## 向派生类中添加新的功能

在上面的例子中，因为我们可以访问`Base`类的源代码，所以如果需要，我们可以直接向`Base`添加功能。

有时候，虽然基类的代码可以访问，但我们不想修改它。考虑这样一种情况，您刚刚从第三方供应商购买了一个代码库，但需要一些额外的功能。您可以添加到原始代码中，但这不是最好的解决方案。如果供应商远程发布了新版本怎么办？添加的内容要么被覆盖，要么必须手动将它们迁移到更新中，这既耗时又有风险。

或者，有时甚至不可能修改基类。考虑标准库中的代码。我们无法修改作为标准库一部分的代码。但是我们能够从这些类继承，然后将我们自己的功能添加到我们的派生类中。同样的情况也发生在第三方库中，在那里你可以访问头文件，但是代码是预编译的。

在任何一种情况下，最好的答案是创建一个自己的派生类，并向派生类添加你想要的功能。

基类中没有包括用于公共代码访问`m_value`的方法。我们可以通过在基类中添加一个访问函数来补救这个问题——但为了举例，我们将把它添加到派生类中。因为`m_value`在基类中被声明为受保护的，`Derived` 可以直接访问它。

要向派生类添加新功能，只需在派生类中像正常一样声明该函数：

```cpp
class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }

    int getValue() const { return m_value; }
};
```

现在 `public` 将能够在 `Derived` 类型的对象上调用 `getValue()` 来访问 `m_value` 的值。

```cpp
int main()
{
    Derived derived { 5 };
    std::cout << "derived has value " << derived.getValue() << '\n';

    return 0;
}
```

程序运行结果如下：

```
derived has value 5
```

需要注意的是，`Base` 对象并不能访问 `Derived` 中的 `getValue()` 函数，所以下面的代码是不能工作的：

```cpp
int main()
{
    Base base { 5 };
    std::cout << "base has value " << base.getValue() << '\n';

    return 0;
}
```


这是因为`Base`类中并没有 `getValue()` 函数，它属于`Derived`类。因为 `Derived` 是 `Base`，所以它能够访问`Base`的属性。但是，`Base` 不能访问 `Derived` 的任何属性。

