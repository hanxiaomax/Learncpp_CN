---
title: M.2 - 右值引用
alias: M.2 - 右值引用
origin: /rvalue-references/
origin_title: "M.2 — R-value references"
time: 2022-9-16
type: translation
tags:
- R-value-references
- references
---

??? note "关键点速记"


在第九章中我们介绍了[[value-category|值类型]]([[9-2-Value-categories-lvalues-and-rvalues|9.2 - 值的分类（左值和右值）]])——值类型是表达式的一个属性，用于确定表达式求值得到值、函数还是对象。我们还介绍了[[lvalue|左值]]和[[rvalue|右值]]，以便展开对[[lvalue-reference|左值引用]]的讨论。

如果你对左值和右值感到生疏了，现在正是复习它们的好时机。

## 复习：左值

在C++11之前，C++中只有左值引用这一种引用，所以它被称为“引用”。但是到了C++11，它被重新命名为左值引用。==左值引用必须通过可修改左值初始化。==

|左值引用	|可用于初始化	|可修改|
|:----|:----|:----|
|Modifiable l-values	|Yes	|Yes
|Non-modifiable l-values|	No	|No
|R-values	|No	|No

 
 const 对象的左值引用可以通过可修改、不可修改的左值或右值初始化。但是，这些值都不能被修改。

|const左值的引用	|可用于初始化	|可修改|
|:----|:----|:----|
|Modifiable l-values	|Yes	|No
|Non-modifiable l-values	|Yes	|No
|R-values	|Yes|	No


==const 对象的左值引用尤其有用，因为它能够配合任何类型的实参（左值或右值）工作，且不会创建拷贝。==
 

## **R-value references**

C++11 添加了一种新的引用类型，称为[[rvalue-reference|右值引用]]。右值引用被设计出来的目的，是为了配合右值使用（也只能配合右值使用）。创建左值引用使用一个`&`符号，创建右值引用则使用两个：

```cpp
int x{ 5 };
int &lref{ x }; // 通过左值来初始化一个左值引用
int &&rref{ 5 }; // 使用右值 5（字面量）来初始化右值引用
```

右值引用不能够通过左值来初始化。

|右值引用	|可用于初始化|可修改|
|:----|:----|:----|
|Modifiable l-values	|No	|No
|Non-modifiable l-values	|No	|No
|R-values	|Yes	|Yes


|const右值引用	|可用于初始化|可修改|
|:----|:----|:----|
|Modifiable l-values	|No	|No
|Non-modifiable l-values	|No	|No
|R-values	|Yes|	No

右值引用有两个有用的属性。首先，==右值引用可以将初始化它们的对象的生命周期延长到自己的生命周期==(对const对象的左值引用也可以做到这一点)。其次，你==可以通过指向非const右值引用来修改右值。==

考虑下面的例子：

```cpp
#include <iostream>

class Fraction
{
private:
	int m_numerator;
	int m_denominator;

public:
	Fraction(int numerator = 0, int denominator = 1) :
		m_numerator{ numerator }, m_denominator{ denominator }
	{
	}

	friend std::ostream& operator<<(std::ostream& out, const Fraction &f1)
	{
		out << f1.m_numerator << '/' << f1.m_denominator;
		return out;
	}
};

int main()
{
	auto &&rref{ Fraction{ 3, 5 } }; // 对临时 Fraction 的右值引用

	// operator<< 的参数f1会绑定到临时对象，而不会创建拷贝
	std::cout << rref << '\n';

	return 0;
} // rref (和临时的Fraction) 离开作用域
```

程序输出：

```
3/5
```

作为一个临时对象，`Fraction(3, 5)`通常会在表达式结束后就离开作用域。但是，因为我们使用它初始化了一个右值引用，所以它的持续时间被延长到了和该右值引用一样——语句块结尾时离开作用域。然后，我们变可以通过该右值引用打印 `Fraction` 的值。

现在让我们看一个不那么直观的例子:

```cpp
#include <iostream>

int main()
{
    int &&rref{ 5 }; // 通过字面量初始化右值引用，此时创建了临时对象5
    rref = 10;
    std::cout << rref << '\n';

    return 0;
}
```

程序输出：

```
10
```


虽然用字面值初始化一个右值引用，然后再通过右值引用修改该右值看起来有些奇怪。但是当我们这么做时，会从字面值构造一个临时对象，此时右值引用引用的对象是该临时对象而不是字面量本身。

不过，上面两个例子并不是常见的右值使用场合。

## 使用右值引用作为函数形参


==右值引用通常用作函数形参==。在重载函数时，如果你希望函数的行为在处理左值右值时不同，则可以使用右值作为函数形参。

```cpp
#include <iostream>

void fun(const int &lref) // 左值形参调用这个函数
{
	std::cout << "l-value reference to const\n";
}

void fun(int &&rref) // 右值形参调用这个函数
{
	std::cout << "r-value reference\n";
}

int main()
{
	int x{ 5 };
	fun(x); // l-value argument calls l-value version of function
	fun(5); // r-value argument calls r-value version of function

	return 0;
}
```


打印结果：

```
l-value reference to const
r-value reference
```

如你所见，当传递一个左值时，重载函数解析为具有左值引用的版本。当传递一个右值引用，重载函数解析到具有右值引用的版本(这被认为是比左值引用const更好的匹配)。

为什么要这么做呢？我们会在下一课中更详细地讨论这个问题。毫无疑问，这是[[move-semantics|移动语义]]的重要组成部分。

有一点需要注意的是：

```cpp
int &&ref{ 5 };
fun(ref);
```

上面代码实际上会调用左值引用版本的函数！尽管`ref`是一个右值引用，但是它本身是一个左值（所有有名字的变量都是左值）。造成混淆的根本原因在于，我们在不同的语境中使用了术语”右值“。应该这样理解：==命名对象是左值，匿名对象是右值。命名对象或匿名对象的类型与它是左值还是右值无关==。或者换句话说，如果右值引用不叫右值引用的话，就不会出现这种无解了。

## 返回右值引用

==您几乎不应该返回右值的引用，原因与你几乎不应该返回左值的引用相同==。在大多数情况下，当被引用的对象在函数结束时离开作用域时，返回的结果最终会成为一个[[dangling|悬垂]]引用。
