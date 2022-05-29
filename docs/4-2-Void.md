---
title: 4.2 - Void
alias: 4.2 - Void
origin: /void/
origin_title: "4.2 — Void"
time: 2021-5-24
type: translation
tags:
- void
---

Void 是最容易介绍的数据类型。基本上，void 意味着“没有类型”！

因此，变量不能被定义为 void 类型：

```cpp
void value; // won't work, variables can't be defined with a void type
```

但 Void  可以被用在其他地方。

## 不返回值的函数

最常见的用到 void 的地方是指示函数没有返回值：

```cpp
void writeValue(int x) // void here means no return value
{
    std::cout << "The value of x is: " << x << '\n';
    // no return statement, because this function doesn't return a value
}
```

如果你在这种类型的函数中使用了 `return` 语句，则会导致编译器报错：

```cpp
void noReturn(int x) // void here means no return value
{
    return 5; // error
}
```

在 Visual Studio 2017 上，报错信息如下：

```
error C2562: 'noReturn': 'void' function returning a value
```

## 弃用: 不接受产生的函数

在 C 语言中，void 还被用来表明函数不接受任何参数：

```cpp
int getValue(void) // void here means no parameters
{
    int x{};
    std::cin >> x;
    return x;
}
```

尽管上述用法在 C++ 中仍然可用（向后兼容），这种方式在 C++ 中被认为是已经弃用的方法。下面这种方式是等价的，也是 C++ 所推荐的：

```cpp
int getValue() // 空的函数形参就隐含不接受参数的含义
{
    int x{};
    std::cin >> x;
    return x;
}
```

!!! success "最佳实践"

    使用空的形参列表而非 void 来表示函数不接受参数

## void 的其他用法

void 关键字在 C++ 中的第三种用法（更高级的用法）我们会在[[11-14-Void-pointers|11.4 - void 指针]]中进行介绍 . Since we haven’t covered what a pointer is yet, you don’t need to worry about this case for now.

Let’s move on!
