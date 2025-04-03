---
title: 13.12 - 基于指针和引用的成员选择
alias: 13.12 - 基于指针和引用的成员选择
origin: /member-selection-with-pointers-and-references/
origin_title: "10.9 — Member selection with pointers and references"
time: 2022-8-25
type: translation
tags:
- struct
---
> [!note] "Key Takeaway"

## 结构体和结构体引用的成员选择

在[[13-7-Introduction-to-structs-members-and-member-selection|13.7 - 结构体、成员和成员选择]]中我们提到，访问结构体的成员可以使用[[member-selection-operator|成员选择运算符]]：
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 34, 65000.0 };

    // Use member selection operator (.) to select a member from struct object
    ++joe.age; // Joe had a birthday
    joe.wage = 68000.0; // Joe got a promotion

    return 0;
}
```

因为对象的引用其实就是对象本身，所以我们也可以对引用使用成员选择运算符来访问结构体成员：

```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

void printEmployee(const Employee& e)
{
    // Use member selection opeartor (.) to select member from reference to struct
    std::cout << "Id: " << e.id << '\n';
    std::cout << "  Age: " << e.age << '\n';
    std::cout << "  Wage: " << e.wage << '\n';
}

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    printEmployee(joe);

    return 0;
}
```


## 结构体指针的成员选择

不过，成员选择运算符并不能被用于指向结构体的指针：
```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    Employee* ptr{ &joe };
    std::cout << ptr.id << '\n'; // Compile error: can't use operator. with pointers

    return 0;
}
```

对于普通变量和引用，我们可以直接访问它。而对于保存着地址的指针来说，我们必须在访问对象前，首先对地址解引用以获得该对象。 所以，通过结构体访问成员的一种方式应该像下面这样：

```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    Employee* ptr{ &joe };
    std::cout << (*ptr).id << '\n'; // Not great but works: First dereference ptr, then use member selection

    return 0;
}
```

但是，这并不优雅，尤其是这里必须使用括号以确保正确的运算符优先级。

为了能够提供一个更简洁的语法，C++提供了指针运算符进行成员选择（有时候称为箭头运算符）使我们可以基于对象指针来访问其成员：

```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    Employee* ptr{ &joe };
    std::cout << ptr->id << '\n'; // Better: use -> to select member from pointer to object

    return 0;
}
```

指针成员选择运算符和普通的成员选择运算符用法类似，但是它会首先进行隐式的解引用。该箭头运算符不仅更容易写，也更不容易出错，因为它会隐式进行解引用，所以我们不需要操心运算符优先级的问题。因此，在通过结构体指针访问其成员时，应该总是使用箭头运算符来完成。

> [!success] "最佳实践"
> 当使用指针访问成员的值时，使用`->`;而不是`.`
	
## 同时使用指针和非指针成员访问

成员选择操作符始终应用于当前选定的变量。如果指针和普通成员变量混合使用，则成员选择`.`和`->`是按顺序使用的：

```cpp
#include <iostream>
#include <string>

struct Paw
{
    int claws{};
};

struct Animal
{
    std::string name{};
    Paw paw{};
};

int main()
{
    Animal puma{ "Puma", { 5 } };

    Animal* ptr{ &puma };

    // ptr is a pointer, use ->
    // paw is not a pointer, use .

    std::cout << (ptr->paw).claws << '\n';

    return 0;
}
```


注意 `(ptr->paw).claws`中的括号是可选的，因为 `operator->` and `operator.` 都是从左向右进行运算的，但是添加括号可以提高可读性。
