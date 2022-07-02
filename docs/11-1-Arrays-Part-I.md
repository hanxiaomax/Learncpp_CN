---
title: 11.1 - 数组（第一部分）
alias: 11.1 - 数组（第一部分）
origin: /arrays-part-i/
origin_title: "11.1 — Arrays (Part I)"
time: 2022-4-8
type: translation
tags:
- array
---

??? note "关键点速记"
	- 访问数组中的单个元素，需要使用数组名、下标操作符(`[]`)和下标(或索引)，下标从0开始计数
	- `int prime[5]{}; //初始化数组为0`
	- 在 C++ 中数组 [[subscripts|下标(subscripts)]]必须是整型类型，包括 `char`, `short`, `int`, `long`, `long long`等，奇怪的是布尔类型竟然也可以（`false`对应索引为0，`true`对应索引为1）。
	- 数组的下标可以是[[literals|字面量]]、变量（`const` 或非 `const` 类型）或者是一个求值结果为整形类型的表达式。
	- 数组的长度(方括号之间)必须是**编译时常量**，非 `const` 变量或者[[runtime|运行时]]常量

注意：这一章相对于前面几章会更有难度。如果你感泄气，一定要坚持住。好戏还在后面呢！


在 [[10-5-Introduction-to-structs-members-and-member-selection|10.5 - 结构体、成员和成员选择]] 中，我们介绍了如何通过结构体将多种不同类型的数据聚合为一个变量。这项能力在我们需要对一个单独的对象进行建模时是很有用的。不过，当我们需要保存一系列相关的实例时，这个结构体就排不上用场了。

幸运的是，结构体并不是 C++ 中唯一能聚合数据的类型。**数组**可以将一系列具有相同类型的变量聚合为一个变量。

考虑这样一种情况，您想要记录一个班级 30 个学生的考试成绩。如果没有数组，你将不得不分配 30 个几乎相同的变量！

```cpp
// allocate 30 integer variables (each with a different name)
int testScoreStudent1{};
int testScoreStudent2{};
int testScoreStudent3{};
// ...
int testScoreStudent30{};
```

数组为我们提供了一种更简单的方法。下面的数组定义本质上与上面的代码是等价的:

```cpp
int testScore[30]{}; // allocate 30 integer variables in a fixed array
```

在数组变量声明中，我们使用方括号(`[]`)告诉编译器这是一个数组变量(而不是普通的变量)，以及分配多少变量(称为**数组长度**)。

在上面的例子中，我们声明了一个名为 `testScore` 的固定数组，长度为30。**固定数组**(也称为**固定长度数组**或**固定大小数组**)是在编译时已知长度的数组。`当testScore` 实例化时，将分配30个整数。

## 数组元素和下标

数组中的每个变量都被称为**元素**。元素没有自己的名称。而如果要访问数组中的单个元素，则需要使用数组名、下标操作符(`[]`)和一个被称为下标(或索引)的形参来告诉编译器需要哪个元素。这个过程被称为数组的取下标(subscripting)或索引(indexing)操作。

在上面的例子中，数组中的第一个元素是 `testScore[0]`。第二个是 `testScore[1]`。第十个是 `testScore[9]`。`testScore` 数组中的最后一个元素是`testScore[29]`。这很好，因为我们不再需要跟踪一堆不同的(但相关的)名称——我们只需改变下标来访问不同的元素。

**重要**：与日常生活中我们通常从1开始计数不同，在C++中，数组总是从0开始计数！

对于长度为 N 的数组，数组元素编号从0到N-1。这被称为数组的**范围**。


## 数组程序实例

下面是一个示例程序，将数组的定义和索引放在一起:

```cpp
#include <iostream>

int main()
{
    int prime[5]{}; // hold the first 5 prime numbers
    prime[0] = 2; // The first element has index 0
    prime[1] = 3;
    prime[2] = 5;
    prime[3] = 7;
    prime[4] = 11; // The last element has index 4 (array length-1)

    std::cout << "The lowest prime number is: " << prime[0] << '\n';
    std::cout << "The sum of the first 5 primes is: " << prime[0] + prime[1] + prime[2] + prime[3] + prime[4] << '\n';

    return 0;
}
```


打印结果为：

```
The lowest prime number is: 2
The sum of the first 5 primes is: 28
```

## 数组数据类型

数组可以由任何数据类型组成。在下面的例子中我们声明了一个`double`类型的数组：

```cpp
#include <iostream>

int main()
{
    double batteryLifeInHours[3]{}; // 分配 3 个 doubles
    batteryLifeInHours[0] = 2.0;
    batteryLifeInHours[1] = 3.0;
    batteryLifeInHours[2] = 4.3;

    std::cout << "The average battery life is " << (batteryLifeInHours[0] + batteryLifeInHours[1] + batteryLifeInHours[2]) / 3.0 << " hour(s)\n";

    return 0;
}
```

打印结果如下：

```
The average battery life is 3.1 hour(s)
```

数组也可以由结构体组成。考虑下面的例子：

```cpp
struct Rectangle
{
    int length{};
    int width{};
};
Rectangle rects[5]{}; // declare an array of 5 Rectangle
```

要访问数组中结构体元素的成员，首先选择想要访问的数组元素，然后使用成员选择操作符选择想要访问的成员：

```cpp
rects[0].length = 24;
```

数组甚至可以由数组组成，这个会在今后的课程中讨论。

## 数组下标

在 C++ 中数组 [[subscripts|下标(subscripts)]]必须是整型类型，包括 `char`, `short`, `int`, `long`, `long long`等，奇怪的是布尔类型竟然也可以（`false`对应索引为0，`true`对应索引为1）。数组的下标可以是[[literals|字面量]]、变量（`const` 或非 `const` 类型）或者是一个求值结果为整形类型的表达式。

下面是一些数组下标的例子：

```cpp
int array[5]{}; // 声明长度为 5 的数组

// 使用字面量索引:
array[1] = 7; // ok

// 使用枚举索引
enum Animals
{
    animal_cat = 2
};
array[animal_cat] = 4; // ok

// 使用变量（非 const）作为索引
int index{ 3 };
array[index] = 7; // ok

// 使用求值结果为整形类型的表达式作为索引
array[1+2] = 7; // ok
```


## 声明固定长度数组

声明固定数组时，数组的长度(方括号之间)必须是[[4-14-Compile-time-constants-constant-expressions-and-constexpr|编译时常量]]。这是因为固定数组的长度必须在编译时知道。下面是一些声明固定数组的不同方法:

```cpp
// 使用字面量常量
int numberOfLessonsPerDay[7]{}; // Ok

//使用 constexpr 符号常量
constexpr int daysPerWeek{ 7 };
int numberOfLessonsPerDay[daysPerWeek]{}; // Ok

// 使用枚举
enum DaysOfWeek
{
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,

    maxDaysOfWeek
};
int numberOfLessonsPerDay[maxDaysOfWeek]{}; // Ok

// 使用宏
#define DAYS_PER_WEEK 7
int numberOfLessonsPerDay[DAYS_PER_WEEK]{}; // 可以，但是不要这么做（应当使用 constexpr 符号常量）

```


注意，非 `const` 变量或者[[runtime|运行时]]常量是不行的：

```cpp
// 使用非 const 变量
int daysPerWeek{};
std::cin >> daysPerWeek;
int numberOfLessonsPerDay[daysPerWeek]{}; // Not ok -- daysPerWeek 不是编译时常量

// 使用运行时常量 
int temp{ 5 };
const int daysPerWeek{ temp }; // daysPerWeek 直到运行时在直到，所以是运行时常量而不是编译时常量
int numberOfLessonsPerDay[daysPerWeek]{}; // Not ok
```

注意，在最后两种情况下会产生错误，因为数组的长度不是编译时常量。有些编译器可能会允许这些类型的数组(出于与C99兼容的原因)，但它们在++中是无效的，不应该在C++程序中使用。如果编译器允许这些数组，那么您可能忘记禁用编译器扩展。


## 动态数组

因为固定数组在编译时分配内存，因此会带来两个限制：

- 固定数组的长度不能基于用户输入或运行时计算的其他值来设定。
- 固定数组的长度是固定的不能改变。

在许多情况下，这些限制不合理的。幸运的是，C++支持第二种数组，称为**动态数组**。动态数组的长度可以在运行时设置，也可以更改其长度。然而，动态数组的实例化稍微复杂一些，因此我们将在后面介绍它们。


## 小结

固定数组提供了一种简单的方法来分配和使用相同类型的多个变量，但数组的长度在编译时必须是已知的。

我们将在下一课中学习更多关于固定数组的主题。
