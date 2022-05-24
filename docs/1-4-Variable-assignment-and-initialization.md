---
alias: 1.4 - 变量赋值和初始化
origin: /variable-assignment-and-initialization/
origin_title: 1.4 — Variable assignment and initialization
time: 2022-1-6
type: translation
tags:
- variable
- initialization
---


在上一节课  [[1-3-Introduction-to-objects-and-variables|1.3 对象和变量]] 中，我们介绍了如何定义一个变量。在这一节课中，我们会介绍如何为变量赋值并使用它存储的值。

首先回忆一下，下面这个代码片段中，我们在内存中为一个名为 x 的整型变量分配了内存，然后类似地，又创建了两个整型变量，分别叫做 y 和 z：

```cpp
int x; // define an integer variable named x
int y, z; // define two integer variables, named y and z
```

## 变量赋值

变量创建完毕后，你可以使用运算符 `=` 为其赋值（在另外一个单独的语句中），这个操作称为拷贝赋值（或赋值）。

```cpp
int width; // define an integer variable named width
width = 5; // copy assignment of value 5 into variable width

// variable width now has value 5
```

拷贝赋值名字的来历，源于上述操作将赋值运算符右侧的值拷贝后赋值给了左侧的变量。`=` 称为赋值运算符。

下面的例子中，我们先后两次使用了赋值操作。

```cpp
#include <iostream>

int main()
{
	int width;
	width = 5; // copy assignment of value 5 into variable width

	// variable width now has value 5

	width = 7; // change value stored in variable width to 7

	// variable width now has value 7

	return 0;
}
```


在我们把 7 赋值给变量 `width` 的时候，之前的值（5）就被覆盖掉了。一般的变量只能够存储一个值。

!!! warning 注意

	新手程序员常犯的错误之一就是将赋值运算符(`=`)和相等比较运算符(`==`)弄混淆。赋值运算符用于给变量赋值，而相等比较运算符则用于校验两个操作数的值是否相等。

## 初始化

上述赋值过程的缺点之一，是它需要两条语句才能完成：首先定义变量，然后为变量赋值。

这两步其实是可以合并的。在定义变量的时候，我们可以为这个变量设置一个初始值，这个过程称为初始化。用于初始化变量的这个值，称为[[初始化值(initializer)]]。

C++ 中的初始化是出奇的复杂，这里向你展示一个简化后的版本。

在 C++ 中有4种基本的变量初始化方法：

```cpp
int a; // 无初始化值
int b = 5; // 在等号后放置初始化值
int c( 6 ); // 在括号中放置初始化值
int d { 7 }; // 在花括号中放置初始化值
```

你可能已经注意到了上述代码片段中额外的空格（例如 `int d{7};`）。是否使用这些空格来增强可读性，属于一种个人偏好。

## 默认初始化

在不提供任何初始化值的时候（例如上面例子中的变量 `a`），将进行默认初始化。在大多数情况下，默认初始化会导致变量存放一个[[不确定值(indeterminate)]]。相关内容我们会在[[1-6-Uninitialized-variables-and-undefined-behavior]]中进行介绍。

## 拷贝初始化

如果等号后面提供了初始化值，此时将进行拷贝初始化。拷贝初始化继承自C语言。

```cpp
int width = 5; // copy initialization of value 5 into variable width
```

和拷贝赋值很类似，拷贝初始化会将等号右边的值拷贝到左侧创建的变量。

对于上述简单类型 `int` 而言，拷贝初始化是非常高效的。然而，在处理复杂类型时，拷贝初始化则是低效的。

## 直接初始化

当我们将初始化值置于括号内时，将进行直接初始化。

```cpp
int width( 5 ); // direct initialization of value 5 into variable width
```

对于 `int` 这样的简单数据类型而言，拷贝初始化和直接初始化本质上几乎没什么区别。对于复杂类型的变量，直接初始化相对于拷贝初始化则更加高效。

## 括号初始化 Brace initialization

不幸的是，直接初始化并不适用于所有类型（例如初始化一个包含一个列表的对象）。为了提供更为一致的初始化机制，C++ 支持了基于花括号的括号初始化（也称为统一初始化或列表初始化）。

括号初始化有三种形式。

```cpp
int width { 5 }; // 直接括号初始化（推荐）
int height = { 6 }; // 拷贝括号初始化
int depth {}; // 值初始化（详见下节）
```

直接括号初始化和拷贝括号初始化几乎是完全一样的，但通常更推荐直接括号初始化。

括号初始化的一个额外优点是，它不允许[[缩窄转换(narrowing conversions)]]的发生。也就是说，如果你使用括号初始化去初始化一个变量时，如果初始化值并不能被”安全的“存储，编译器会抛出一个告警或错误。例如：

```cpp
int width { 4.5 }; // 错误: not all double values fit into an int
```

在上面的代码片段中，我们尝试将一个包含了小数部分的值 4.5 赋值给一个整型变量（只能存储整数部分）。拷贝和直接初始化都会丢弃小数部分，最终结果就是正数部分 4 被存储在了变量 `width` 中。而对于括号初始化，上述操作会导致编译器报错（通常来讲这是件好事，因为很少有故意丢失数据精度的需求）。不会造成潜在数据丢失的类型转换则是允许的。

!!! success "最佳实践"

	只要条件允许，应该尽可能使用括号初始化。

!!! faq

	Q；C++ 提供了拷贝初始化、直接初始化和括号初始化。那么是否存在直接赋值和括号赋值呢？
	A：C++ 并不支持直接赋值和括号赋值语法


## 值初始化和零初始化

如果使用空的花括号来初始化变量，则会进行值初始化，值初始化会把变量初始值设置为0（或者空，如果空值对于给定类型是合适的初值的话）。在这种情况下，如果初始化为全0，也称之为零初始化。

```cpp
int width {}; // zero initialization to value 0
```

!!! faq

	Q: 什么时候应该使用 { 0 } ，是什么时候使用 {}?
	如果你使用的的确是0这个具体值，那么就应当明确地将其初始化为0

	int x { 0 }; // explicit initialization to value 0
	std::cout << x; // we're using that zero value

	如果初始化的值只是临时值且即将被替换，则可以使用值初始化。

	int x {}; // value initialization
	std::cin >> x; // we're immediately replacing that value



## 习惯性地初始化变量

变量在创建时，就应该初始化。也许你将来会遇到某种特例（例如某段性能及其关键的代码中所包含的大量变量）允许你不去初始化变量，前提是你是有意而为之的（避免因为忘记了而没有初始化变量的这种情况）

关于这个话题的讨论，Bjarne Stroustrup (C++之父) 和 Herb Sutter (C++ 大师) 提供了他们的见解，详细内容请参考[这里](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#es20-always-initialize-an-object).

我们会在[[1-6-Uninitialized-variables-and-undefined-behavior]]中详细讨论当我们试图使用一个没有被”恰当定义“的变量时会发生什么。

> [!INFO] Q&A
> 在创建变量时对其进行初始化。

## 初始化多个变量

在上一节课中我们提到，C++支持使用一个语句定义多个变量（通过逗号分割变量名）：

```cpp
int a, b;
```

同时我们也提到，最佳实践其实是避免使用该语法。不过，由于我们难免还是会遇到此类风格的代码，对它多些了解也未尝不是件好事。同时也能够再次提醒你避免使用这种语法。

你可以在一行代码中初始化多个变量：

```cpp
int a = 5, b = 6; // copy initialization
int c( 7 ), d( 8 ); // direct initialization
int e { 9 }, f { 10 }; // brace initialization (preferred)
```

不幸的是，这里有一个非常常见坑。当程序员错误地使用了一个初始化语句并期望它能够初始化多个变量时，错误便可能发生：

```cpp
int a, b = 5; // wrong (a is not initialized!)

int a = 5, b = 5; // correct
```

在第一行语句中，变量 `a` 并没有被初始化，编译器可能会对此发出提醒，也可能不会。如果编译器忽略了该问题，那么你的程序将可能因此间歇性地崩溃或输出错误结果。我们稍后就会介绍使用未初始化的变量会带来哪些问题。

有一种方法可以帮助你记忆并避免上述问题，如果你考虑使用直接初始化或者括号初始化的场景，上述写法显而易见是有问题的：

```cpp
int a, b( 5 );
int c, d{ 5 };
```

看上去可能稍微清楚些，5被用于初始化`b`或者`d`，而不是 `a` 或者 `c`


